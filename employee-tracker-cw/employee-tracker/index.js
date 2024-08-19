const inquirer = require("inquirer");
const { Pool } = require("pg");
require("console.table");
let db;

async function initDb() {
  const pool = new Pool({
    user: "charlesrwilson",
    host: "localhost",
    database: "employee_db",
    password: "Cwil0096",
    port: 5432,
  });

  return await pool.connect();
}

async function init() {
  db = await initDb();
  mainMenu();

}


async function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((answer) => {
      if (answer.action == "View All Departments") {
        db.query("SELECT * FROM department;", function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.table(data.rows);
            mainMenu();
          }
        });
      } else if (answer.action == "View All Roles") {
        db.query("SELECT * FROM role;", function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.table(data.rows);
            mainMenu();
          }
        });
      } else if (answer.action == "View All Employees") {
        db.query("SELECT * FROM employee;", function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.table(data.rows);
            mainMenu();
          }
        });
      }
      // TO DO:  View All Employees
      else if (answer.action == "Add a Department") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the name of the department?",
              name: "name",
            },
          ])
          .then((answers) => {
            // db.query(`INSERT INTO department (name, title) VALUES (?, ?)`, [answers.name, answers.title] ,function (err, data) {
            db.query(
              `INSERT INTO department (name) VALUES ($1);`,
              [answers.name],
              function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Department has been added!");
                  mainMenu();
                }
              }
            );
          });
      } else if (answer.action == "Add a Role") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the Title of the role?",
              name: "title",
            },
            {
              type: "input",
              message: "What is the Salary of the role?",
              name: "salary",
            },
            {
              type: "input",
              message: "What is the Department of the role?",
              name: "department",
            },
          ])
          .then((answers) => {
            // db.query(`INSERT INTO department (name, title) VALUES (?, ?)`, [answers.name, answers.title] ,function (err, data) {
            db.query(
              `INSERT INTO role (title, salary, department) VALUES ($1, $2, $3);`,
              [answers.title, answers.salary, answers.department],
              function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("A Role has been added!");
                  mainMenu();
                }
              }
            );
          });
      } else if (answer.action == "Add an Employee") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the first name of the employee?",
              name: "first_name",
            },
            {
              type: "input",
              message: "What is the last name of the employee?",
              name: "last_name",
            },
            {
              type: "input",
              message: "What is the role of the employee?",
              name: "role_id",
            },
            {
              type: "input",
              message: "What is the manager ID of the employee?",
              name: "manager_id",
            },
          ])
          .then((answers) => {
            // db.query(`INSERT INTO department (name, title) VALUES (?, ?)`, [answers.name, answers.title] ,function (err, data) {
            db.query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`,
              [
                answers.first_name,
                answers.last_name,
                answers.role_id,
                answers.manager_id,
              ],
              function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("An employee has been added!");
                  mainMenu();
                }
              }
            );
          });
      } else if (answer.action == "Update an Employee Role") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the id of the employee to be updated?",
              name: "id",
            },
            {
              type: "input",
              message: "What is the new role id of the employee?",
              name: "role_id",
            }
          ])
          .then((answers) => {
            // db.query(`INSERT INTO department (name, title) VALUES (?, ?)`, [answers.name, answers.title] ,function (err, data) {
            db.query(
              `UPDATE employee SET role_id = $1 WHERE id = $2;`,
              [
                answers.role_id,
                answers.id
              ],
              function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("An employee has been updated!");
                  mainMenu();
                }
              }
            );
          });
      }
    });
}

init();
