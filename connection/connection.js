const mysql =require('mysql2');

const db =mysql.createConnection(
    {
        //MYSQL host
        host:'localhost',
        //RDBMS (MySQL) USER
        user:'root',
         //RDBMS (MySQL) Password
        password:"password",
         //RDBMS (MySQL) database name
        database:'Employees_info'
    },
    console.log(' #You are Connected to Employees_info database.')
);
module.exports = db ;
