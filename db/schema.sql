DROP DATABASE IF EXISTS Employees_info;
CREATE DATABASE Employees_info ;

USE Employees_info;

CREATE TABLE departments(
department_id INT auto_increment PRIMARY KEY,
department_name VARCHAR(30)
);

CREATE TABLE roles (
role_id INT auto_increment PRIMARY KEY,
role_title VARCHAR(30),
salary DECIMAL,
department_id int,
 FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
CREATE TABLE employee (
employee_id INT auto_increment PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id Int,
manager_id int,
 FOREIGN KEY (role_id) REFERENCES roles(role_id) ,
 FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);