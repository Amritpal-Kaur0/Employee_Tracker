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
    promptchoices();
})
function promptchoices(){
   inquirer
    .prompt([
        {
            type:'list',
            name:'option',
            message:'what would you like to do?',
            choices :['View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role'
            ,'Add an Employee',
            'Update an Employee role', 'View Employees by Manager',
            'View the total utilized budget of a department','close program'
        ]
        }

    ])
    .then(function (promptresponse) {
        const chosenOption = promptresponse.option;
        if (chosenOption === 'View all Departments') {
            viewDepartments();
        } else if (chosenOption === 'View all Roles'){
            viewRoles();
        }else if (chosenOption === 'View all Employees') {
            viewEmployees();
        }else if (chosenOption === 'Add a Department') {
            addDepartment();
        }else if (chosenOption === 'Add a Role') {
            addRole();
        }else if (chosenOption === 'Add an Employee') {
            addEmployee();
        }else if (chosenOption === 'Update an Employee role') {
            updateEmployeeRole();
        }else if (chosenOption === 'View Employees by Manager') {
            viewEmployeesByManager();
        }else if (chosenOption === 'View the total utilized budget of a department') {
            budgetbyDepartment();
        } else  if (chosenOption === 'close program') {
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
    db.query(`
    SELECT 
    roles.role_id AS ROLE_ID,
     roles.role_title AS ROLE_TITLE,
      roles.salary AS Employee_Salary, 
      departments.department_id AS Department_ID, 
      departments.department_name AS DEPARTMENT
       FROM 
       roles JOIN departments ON roles.department_id = departments.department_id;`,(err,res)=>{
        if(err)throw err;
        console.table(res);

        promptchoices();
    })
}
//view all employees in database
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
//Bonus - Application allows users to view employees by manager (2 points).
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
function addRole() {
    db.query('SELECT * FROM departments;', (err, res) => {
      if (err) throw err;
      const roleDepartment = res.map(department => ({
        name: department.department_name,
        value: department.department_id
      }));
  
      inquirer
        .prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department does this role belong to?',
            choices: roleDepartment
          },
          {
            name: 'role_title',
            type: 'input',
            message: 'What is the name of the role?'
          },
          {
            name: 'role_salary',
            type: 'input',
            message: 'What is the salary for this role?',
            validate: salaryValue => {
              if (isNaN(salaryValue)) {
                console.log('\n Enter a numerical value \n');
                return false;
              }
              return true;
            }
          }
        ])
        .then(response => {
          const { departmentName, role_title, role_salary } = response;
          const query = 'INSERT INTO roles (ROLE_TITLE, salary, department_id) VALUES (?, ?, ?)';
          const values = [role_title, role_salary, departmentName];
  
          db.query(query, values, (err, res) => {
            if (err) throw err;
            console.log(`\n ${role_title} has been added in Employee_Info database. \n`);
            promptchoices();
          });
        });
    });
  }
  function addEmployee() {
    db.query('SELECT * FROM roles;', (err, res) => {
      if (err) throw err;
      const employeeRoles = res.map(role => ({
        name: role.role_title,
        value: role.role_id
      }));
  
      db.query('SELECT * FROM employee;', (err, res) => {
        if (err) throw err;
        const managers = res.map(manager => ({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.employee_id
        }));
  
        inquirer
          .prompt([
            {
              name: 'first_name',
              type: 'input',
              message: "Enter the employee's first name:"
            },
            {
              name: 'last_name',
              type: 'input',
              message: "Enter the employee's last name:"
            },
            {
              name: 'role_id',
              type: 'list',
              message: "Select the employee's role:",
              choices: employeeRoles
            },
            {
              name: 'manager_id',
              type: 'list',
              message: "Select the employee's manager:",
              choices: [{ name: 'None', value: null }, ...managers]
            }
          ])
          .then(response => {
            const { first_name, last_name, role_id, manager_id } = response;
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const values = [first_name, last_name, role_id, manager_id];
  
            db.query(query, values, (err, res) => {
              if (err) throw err;
              console.log(`\n ${first_name} ${last_name} has been added to the Employee_Info database. \n`);
              promptchoices();
            });
          });
      });
    });
  }
  
//  Bonus- Application allows users to view the total utilized budget of a department—in other words, the combined salaries of all employees in that department (8 points).
  function budgetbyDepartment() {
    db.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      const departmentChoices = res.map(departments => ({
        name: departments.department_name,
        value: departments.department_id
      }));
  
      inquirer
        .prompt([
          {
            name: 'departmentId',
            type: 'list',
            message: 'Select a department:',
            choices: departmentChoices
          }
        ])
        .then(response => {
          const { departmentId } = response;
  
          db.query(`
            SELECT
              departments.department_name AS Department,
              SUM(roles.salary) AS Total_Budget
            FROM
              departments
            JOIN
              roles ON  departments.department_id = roles.department_id
            JOIN
              employee ON roles.role_id = employee.role_id
            WHERE
            departments.department_id = ?
            GROUP BY
              departments.department_name;
          `, [departmentId], (err, res) => {
            if (err) throw err;
            console.table(res);
  
            promptchoices();
          });
        });
    });
  }
  
  function updateEmployeeRole() {
    // Retrieve the list of employees from the database
    db.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;
  
      // Prompt the user to select an employee to update
      inquirer.prompt([
        {
          name: 'employeeId',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.employee_id
          }))
        }
      ]).then(answer => {
        const employeeId = answer.employeeId;
  
        // Retrieve the list of roles from the database
        db.query('SELECT * FROM roles', (err, roles) => {
          if (err) throw err;
  
          // Prompt the user to select a new role for the employee
          inquirer.prompt([
            {
              name: 'roleId',
              type: 'list',
              message: 'Select the new role for the employee:',
              choices: roles.map(roles => ({
                name: roles.role_title,
                value: roles.role_id
              }))
            }
          ]).then(answer => {
            const roleId = answer.roleId;
  
            // Update the employee's role in the database
            db.query('UPDATE employee SET role_id = ? WHERE employee_id = ?', [roleId, employeeId], (err, result) => {
              if (err) throw err;
  
              console.log('Employee role updated successfully.');
              promptchoices();
            });
          });
        });
      });
    });
  }

// promptchoices();
