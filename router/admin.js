const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const adminAuth = require('./adminAuth')

const conn = mysql.createConnection({
  host: process.env.MYSQL_URI,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_USER
});

router.use(adminAuth)

router
  .route('/add_employee')
  .get((req, res) => {
    conn.query(`SELECT * from employee_info`, (err, data) => {
      if (err) {
        throw err;
      }
      else {
        res.render('AdminDashboard', { data: data });
      }
    });
  })
  .post((req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let contact = req.body.contact;
    let dept = req.body.dept;
    let join_date = req.body.join_date;
    let password = req.body.password;
    conn.query(`INSERT INTO  employee_info(username,email,contact,dept,join_date,password) VALUES('${username}','${email}','${contact}','${dept}','${join_date}','${password}')`, (err, rows) => {
      if (err) throw err;
      console.log('Data inserted');
    });
    res.redirect('/add_employee');
  });

router
  .route('/update_employee')
  .get((req, res) => {
    let username = "mayur";
    conn.query(`SELECT * from employee_info WHERE username='${username}'`, (err, data) => {
      if (err) {
        throw err;
      }
      else {
        res.render('UpdateEmployee', { data: data });
      }
    });
  })
  .post((req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let contact = req.body.contact;
    let dept = req.body.department;
    let checkval = req.body.checkval;
    let password = req.body.new_password;
    console.log(contact);
    if (checkval === undefined) {
      conn.query(`UPDATE employee_info SET username = '${username}', dept = '${dept}', contact= '${contact}' WHERE email = '${email}';`, (err, rows) => {
        if (err) {
          throw err;
        }
        else {
          console.log('Data updated');
          res.redirect('/updateEmployee');
        }
      });
    } else {
      conn.query(`UPDATE employee_info SET username = '${username}',  dept = '${dept}', contact= '${contact}', password = '${password}' WHERE email = '${email}';`, (err, rows) => {
        if (err) {
          throw err;
        }
        else {
          console.log('Data updated');
          res.redirect('/updateEmployee');
        }
      });
    }
  });

router.post('/deactivate', (req, res) => {
  let email = req.body.email;
  conn.query(`DELETE FROM employee_info WHERE email='${email}'`, (err, rows) => {
    if (err) throw err;
  });
  res.redirect('/addEmployee');
});

module.exports = router