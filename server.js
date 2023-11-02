const inquirer = require('inquirer');
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name',
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

/*
While the user has not chosen to exit:
  Get the user's choice from the main menu

  If the user chooses "View all departments":
    Retrieve all departments from the database
    Display a formatted table showing department names and IDs

  If the user chooses "View all roles":
    Retrieve all roles from the database
    Display job title, role ID, department, and salary for each role

  If the user chooses "View all employees":
    Retrieve all employees from the database
    Display a formatted table showing employee data (ID, first name, last name, job title, department, salary, manager)

  If the user chooses "Add a department":
    Prompt the user to enter the name of the new department
    Add the new department to the database

  If the user chooses "Add a role":
    Prompt the user to enter the name, salary, and department for the new role
    Add the new role to the database

  If the user chooses "Add an employee":
    Prompt the user to enter the employee's first name, last name, role, and manager
    Add the new employee to the database

  If the user chooses "Update an employee role":
    Prompt the user to select an employee to update
    Prompt the user to enter the new role for the selected employee
    Update the employee's role in the database

  Display the main menu again

Exit the application
*/