const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

let sql;

// connection to sqlite3
const db = new sqlite3.Database(
  "./employees.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

// create table

// sql = `CREATE TABLE employees(
//         first_name,
//         middle_name,
//         date_of_graduation,
//         date_of_employment,
//         position,
//         salary,
//         supervisor,
//         employee_code PRIMARY KEY,
//         Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(
//           first_name,
//           middle_name,
//           date_of_graduation,
//           date_of_employment,
//           position,
//           salary,
//           supervisor,
//           employee_code,
//           Timestamp) ON CONFLICT IGNORE
//     )`;
// db.run(sql);

// insert data into database

const insertData = () => {
  sql = `INSERT OR REPLACE INTO employees( first_name,
        middle_name,
        date_of_graduation,
        date_of_employment,
        position,
        salary,
        supervisor,
        employee_code) VALUES(?,?,?,?,?,?,?,?)`;

  fs.readFile("./Data/employees-csv.csv", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let dataArr = data.split("\n");
    for (let i = 1; i < dataArr.length; i++) {
      const first_name = dataArr[i].split(",")[0];
      const middle_name = dataArr[i].split(",")[1];
      const date_of_graduation = dataArr[i].split(",")[2];
      const date_of_employment = dataArr[i].split(",")[3];
      const position = dataArr[i].split(",")[4];
      const salary = dataArr[i].split(",")[5];
      const supervisor = dataArr[i].split(",")[6];
      const employee_code = dataArr[i].split(",")[7];
      // console.log(
      //   dataArr[i].split(",")[0],
      //   dataArr[i].split(",")[1],
      //   dataArr[i].split(",")[2],
      //   dataArr[i].split(",")[3],
      //   dataArr[i].split(",")[4],
      //   dataArr[i].split(",")[5],
      //   dataArr[i].split(",")[6],
      //   dataArr[i].split(",")[7]
      // );
      db.run(
        sql,
        [
          first_name,
          middle_name,
          date_of_graduation,
          date_of_employment,
          position,
          salary,
          supervisor,
          employee_code,
        ],
        (err) => {
          if (err) return console.error(err.message);
        }
      );
    }
  });
};

// drop table
// db.run("DROP TABLE employees");

// query database
// const queryDatabase = () => {
//   sql = ` SELECT * FROM employees`;

//   db.all(sql, [], (err, rows) => {
//     if (err) return console.error(err.message);
//     return rows;
//   });
// };

// select duplicates
// sql = `
// SELECT * FROM employees
// WHERE EXISTS (
//   SELECT 1 FROM employees copy_employees
//   WHERE employees.first_name = copy_employees.first_name
//   AND employees.middle_name = copy_employees.middle_name
//   AND employees.rowid > copy_employees.rowid
// );
// `;
// db.all(sql, [], (err, rows) => {
//   if (err) return console.log(err.message);
//   console.log(rows);
// });

const deleteDuplicates = () => {
  sql = `
  DELETE FROM employees
  WHERE EXISTS (
    SELECT 1 FROM employees copy_employees 
    WHERE employees.first_name = copy_employees.first_name
    AND employees.middle_name = copy_employees.middle_name
    AND employees.rowid > copy_employees.rowid
  );
  `;
  db.run(sql);
};

const deleteEmptyRows = () => {
  sql = `DELETE FROM employees WHERE  first_name=""`;
  db.run(sql);
};

module.exports = { insertData, deleteEmptyRows, deleteDuplicates };
