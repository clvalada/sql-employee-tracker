const inquirer = require('inquirer');
const mysql = require('mysql');

/*
Initialize the application

Display a main menu with the following options:
1. View all departments
2. View all roles
3. View all employees
4. Add a department
5. Add a role
6. Add an employee
7. Update an employee role
8. Exit the application

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