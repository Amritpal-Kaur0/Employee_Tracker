const inquirer = require('inquirer');
const db =require('./connection/connection.js');
const cTable =require ('console.table');

const promptchoices=()=>{
    console.log(`
    _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    |                                     |
    |       ***Employees_info***          |
    |                                     |
    |__ __ __ __ __ __ __ _ __ __ ___ __ _|`)
    return inquirer
    .prompt([
        {
            type:'list',
            name:'option',
            message:'what would you like to do?',
            choices :['View all Departments','View all Roles','View all Employees','Add a Department','Add a Role','Add an Employee','Update an Employee role','close program']
        }

    ])
    .then(function (promptresponse) {
        if (promptresponse.option === 'View all Departments') {
            viewDepartments();
        } else if (promptresponse.option === 'View all Roles') {
            viewRoles();
        }else if (promptresponse.option === 'View all Employees') {
            viewEmployees();
        }else if (promptresponse.option === 'Add a Department') {
            addDepartment();
        }else if (promptresponse.option === 'Add a Role') {
            addRole();
        }else if (promptresponse.option === 'Add an Employee') {
            addEmployee();
        }else if (promptresponse.option === 'Update an Employee role') {
            updateEmployeeRole();
        } else  if (promptresponse.option === 'close program') {
            db.end();
        }
    })
}
promptchoices();