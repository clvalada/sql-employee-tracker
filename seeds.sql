-- Insert data into the department table
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Marketing');

-- Insert data into the role table
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 70000.00, 1),
  ('Software Engineer', 80000.00, 2),
  ('Marketing Specialist', 60000.00, 3),
  ('Sales Representative', 50000.00, 1),
  ('Engineering Manager',100000.00, 2);

-- Insert data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Tony', 'Stark', 1, NULL), -- Tony Stark is a Sales Manager with no manager
  ('Bruce', 'Banner', 2, 5),  -- Bruce Banner is a Software Engineer managed by Hank Pym
  ('Peter', 'Parker', 4, 1),  -- Peter Parker is a Sales Representative managed by Tony Stark
  ('Natasha', 'Romanoff', 3, NULL), -- Natasha Romanoff is a Marketing Specialist with no manager
  ('Hank', 'Pym', 2, NULL), -- Hank Pym is an Engineering Manager with no manager