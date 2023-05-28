const inquirer = require('inquirer');
const db =require('./connection/connection.js');
const cTable =require('console.table');

db.connect((err)=>{
    if(err)throw err;
    console.log(`
    _ _ _ _ _ _ _              _ _ _ _ _ _
    |                                     |
    |       ***Employees_info***          |                                     |
    |_ __ __ _ __              __ ___ __ _| \n`)
    // promptchoices();
})
function promptchoices(){
   inquirer
    .prompt([
        {
            type:'list',
            name:'option',
            message:'what would you like to do?',
            choices :['View all Departments','View all Roles','View all Employees','Add a Department','Add a Role','Add an Employee','Update an Employee role', 'View Employees by Manager','close program']
        }

    ])
    .then(function (promptresponse) {
        if (promptresponse.option === 'View all Departments') {
            viewDepartments();
        } else if (promptresponse.option === 'View all Roles'){
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
        }else if (promptresponse.option === 'View Employees by Manager') {
            viewEmployeesByManager();
        } else  if (promptresponse.option === 'close program') {
            db.end();
        }else{
            console.log("Invalid Attempt");
            promptchoices();
        }
    })
}

//To View all the Departments in the  Database
function viewDepartments(){
    db.query(`SELECT * FROM departments;`,(err,res)=>{
        if(err)throw err;
        console.table(res);

        promptchoices();

    })
}
function viewRoles(){
    db.query(`SELECT 
    roles.role_id as ROLE_ID,
     roles.role_title as ROLE_TITLE,
      roles.salary as Employee_Salary, 
      departments.department_id as Department_ID, 
      departments.department_name as DEPARTMENT
       FROM 
       roles JOIN departments ON roles.department_id = departments.department_id;`,(err,res)=>{
        if(err)throw err;
        console.table(res);

        promptchoices();
    })
}
function viewEmployees(){
    db.query(`SELECT
     employee.employee_id AS EMPLOYEE_ID,
      employee.first_name AS FIRST_NAME ,
      employee.last_name AS LAST_NAME ,
      roles.role_id AS ROLE_ID,
      roles.role_title AS  JOB_TITLE,
       roles.salary AS SALARY ,
       departments.department_name AS DEPARTMENT
        ,departments.department_id AS DEPARTMENT_ID,
         employee.manager_id AS MANAGER 
         FROM
          EMPLOYEE JOIN roles
           ON employee.role_id =roles.role_id JOIN departments ON roles.department_id =departments.department_id;`,(err,res)=>{
        if(err)throw err;
        console.table(res);

        promptchoices();
    })
}
function viewEmployeesByManager(){
    db.query(`SELECT
    e.Employee_id,
    e.First_name,
    e.Last_name,
    r.Role_Title,
    CONCAT(m.first_name, ' ', m.last_name) AS Manager_name
FROM
    employee e
LEFT JOIN
    employee m ON e.manager_id = m.employee_id
JOIN
    roles r ON e.role_id = r.role_id;`,(err,res)=>{
        if(err)throw err;
        console.table(res);

        promptchoices();
    })
}
function addDepartment(){
    return inquirer.prompt ([{
        type:'input',
        name:'department_name',
        massage:'Enter the Department Name'
    }
]).then((response)=>{
    db.query(`INSERT INTO departments (department_name) VALUES ('${response.department_name}')`,(err,res)=>{
        if (err)throw err;
        console.table(`\n ${response.department_name} addded to the Database \n`);
        promptchoices();
    })
})
}
function addRole(){
   
}
promptchoices();
