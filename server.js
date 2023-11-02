require('dotenv').config();

const inquirer = require('inquirer');
const mysql = require('mysql');

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

// Create a MySQL connection using .env
const connection = mysql.createConnection({
  host: 'dbHost',
  user: 'dbUser',
  password: 'dbPassword',
  database: 'dbDatabase',
});

// Function to start the application
function employeeTracker() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'How can I help you?',
        name: 'action',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit the application',
        ],
      },
    ])
    .then(function (response) {
      const action = response.action;
      // Handle different user choices based on 'action'
      switch (action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit the application':
          exitApplication();
          break;
        default:
          console.log('Invalid choice');
          break;
      }
    });
}

function viewDepartments() {
  connection.query('SELECT id, name FROM department', function (error, results) {
    if (error) throw error;
    
    // Format and display the data as a table
    console.log('All Departments:');
    console.table(results);

    employeeTracker(); // Return to the main menu
  });
}

function viewRoles() {
  const query = `
    SELECT role.title AS 'Job Title', role.id AS 'Role ID', department.name AS 'Department', role.salary AS 'Salary'
    FROM role
    INNER JOIN department ON role.department_id = department.id;
  `;

  connection.query(query, function (error, results) {
    if (error) throw error;

    // Display the data in a table format
    console.log('All Roles:');
    console.table(results);

    employeeTracker(); // Return to the main menu
  });
}

function viewEmployees() {
  const query = `
    SELECT 
      employee.id AS 'Employee ID',
      employee.first_name AS 'First Name',
      employee.last_name AS 'Last Name',
      role.title AS 'Job Title',
      department.name AS 'Department',
      role.salary AS 'Salary',
      CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
  `;

  connection.query(query, function (error, results) {
    if (error) throw error;

    // Display the data in a table format
    console.log('All Employees:');
    console.table(results);

    employeeTracker(); // Return to the main menu
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter the name of the new department:',
        name: 'departmentName',
      },
    ])
    .then(function (response) {
      const departmentName = response.departmentName;

      // Insert the new department into the database
      const query = 'INSERT INTO department (name) VALUES (?)';
      connection.query(query, [departmentName], function (error, results) {
        if (error) throw error;

        console.log(`Department "${departmentName}" added to the database.`);
        employeeTracker(); // Return to the main menu
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter the title of the new role:',
        name: 'roleTitle',
      },
      {
        type: 'input',
        message: 'Enter the salary for the new role:',
        name: 'roleSalary',
      },
      {
        type: 'input',
        message: 'Enter the department for the new role:',
        name: 'departmentName',
      },
    ])
    .then(function (response) {
      const roleTitle = response.roleTitle;
      const roleSalary = parseFloat(response.roleSalary); // Parse salary as a float
      const departmentName = response.departmentName;

      // Find the department ID based on the provided department name
      const departmentQuery = 'SELECT id FROM department WHERE name = ?';
      connection.query(departmentQuery, [departmentName], function (error, departmentResults) {
        if (error) throw error;

        if (departmentResults.length === 0) {
          console.log(`Department "${departmentName}" not found. Please add the department first.`);
          employeeTracker(); // Return to the main menu
        } else {
          // Insert the new role into the database
          const departmentId = departmentResults[0].id;
          const roleInsertQuery = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?';
          connection.query(roleInsertQuery, [roleTitle, roleSalary, departmentId], function (error, results) {
            if (error) throw error;

            console.log(`Role "${roleTitle}" added to the database.`);
            employeeTracker(); // Return to the main menu
          });
        }
      });
    });
}

function addEmployee() {
  // Query to retrieve roles for the role selection prompt
  const roleQuery = 'SELECT id, title FROM role';

  // Query to retrieve employees for the manager selection prompt
  const managerQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee';

  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter the first name of the new employee:',
        name: 'firstName',
      },
      {
        type: 'input',
        message: 'Enter the last name of the new employee:',
        name: 'lastName',
      },
      {
        type: 'list',
        message: 'Select the role for the new employee:',
        name: 'roleID',
        choices: function () {
          return new Promise(function (resolve, reject) {
            connection.query(roleQuery, function (error, results) {
              if (error) {
                reject(error);
              } else {
                resolve(results.map(role => ({ name: role.title, value: role.id })));
              }
            });
          });
        },
      },
      {
        type: 'list',
        message: 'Select the manager for the new employee (if any):',
        name: 'managerID',
        choices: function () {
          return new Promise(function (resolve, reject) {
            connection.query(managerQuery, function (error, results) {
              if (error) {
                reject(error);
              } else {
                results.push({ name: 'None', value: null }); // Allow no manager
                resolve(results);
              }
            });
          });
        },
      },
    ])
    .then(function (response) {
      const firstName = response.firstName;
      const lastName = response.lastName;
      const roleID = response.roleID;
      const managerID = response.managerID;

      // Insert the new employee into the database
      const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      connection.query(query, [firstName, lastName, roleID, managerID], function (error, results) {
        if (error) throw error;

        console.log(`Employee "${firstName} ${lastName}" added to the database.`);
        employeeTracker(); // Return to the main menu
      });
    });
}

function updateEmployeeRole() {
  // Query to retrieve a list of employees for selection
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee';

  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select the employee to update:',
        name: 'employeeID',
        choices: function () {
          return new Promise(function (resolve, reject) {
            connection.query(employeeQuery, function (error, results) {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          });
        },
      },
      {
        type: 'list',
        message: 'Select the new role for the employee:',
        name: 'newRoleID',
        choices: function () {
          return new Promise(function (resolve, reject) {
            connection.query('SELECT id, title FROM role', function (error, results) {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          });
        },
      },
    ])
    .then(function (response) {
      const employeeID = response.employeeID;
      const newRoleID = response.newRoleID;

      // Update the employee's role in the database
      const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
      connection.query(query, [newRoleID, employeeID], function (error, results) {
        if (error) throw error;

        console.log('Employee role updated in the database.');
        employeeTracker(); // Return to the main menu
      });
    });
}

// Call the 'employeeTracker' function to start the application
employeeTracker();