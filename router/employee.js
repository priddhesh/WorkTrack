const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const empAuth = require('./empAuth')

const conn = mysql.createConnection({
  host: process.env.MYSQL_URI,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_USER
});

router.use(empAuth)

router
  .route('/dashboard')
  .get((req, res) => {
    conn.query(`SELECT * from tasks`, (err, data) => {
      if (err) {
        throw err;
      }
      else {
        console.log(data);
        res.render('EmployeeDashboard', { data: data });
      }
    });
  });

router
  .route('/add_task')
  .post((req, res) => {
    let desc = req.body.desc;
    let type = req.body.type;
    let timedate = req.body.st_time;
    let time_taken = req.body.time_taken;
    let st_time = `${timedate.split("T")[1]}:00`;
    let date = timedate.split("T")[0];
    conn.query(`INSERT INTO  tasks(task_description,task_type,date,start_time,time_taken,username) VALUES('${desc}','${type}','${date}','${st_time}','${time_taken}','')`, (err, rows) => {
      if (err) throw err;
      console.log('Data inserted');
    });
    res.redirect('/employee/dashboard');
  });


module.exports = router