INSERT INTO departments(department_name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');


INSERT INTO roles (role_title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 1600000, 3),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('lawyer', 190000, 4);

INSERT INTO employee(first_name,last_name ,role_id,manager_id)
VALUES 
('John','Doe', 1 ,null),
('Mike','Chan', 2 ,1),
('Ashley','Rodriguez', 3 ,null),
('Kevin','Tupic', 4 ,3),
('Kunal','Singh', 5 ,null),
('Malia','brown', 6 ,5),
('Sarah','Lourd', 7 ,null),
('Tom','Allen', 8 ,7);