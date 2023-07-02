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
  .route('/addEmployee')
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
    res.redirect('/addEmployee');
  });

router.post('/deactivate', (req, res) => {
  let email = req.body.email;
  conn.query(`DELETE FROM employee_info WHERE email='${email}'`, (err, rows) => {
    if (err) throw err;
  });
  res.redirect('/addEmployee');
});

router
  .route('/logout')
  .get((req, res) => {
    req.session.destroy()
    res.redirect('/')
  })

module.exports = router