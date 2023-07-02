const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const empAuth = require('./empAuth')
const {
  getEmployeeTasks,
  getCurrentDayTasks,
  setEmployeeTasks,
  getEmployeeData,
  updateEmployeeData,
} = require('../database')

const conn = mysql.createConnection({
  host: process.env.MYSQL_URI,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_USER
});

router.use(empAuth)

router
  .route('/dashboard')
  .get(async (req, res) => {

    let username = req.session.username
    const data = await getCurrentDayTasks(username)
    console.log(data)
    res.render('EmployeeDashboard', { data: data ? data : {}, tasks: {} })
  })
  .post(async (req, res) => {
    let { find_task_date } = req.body
    let { username } = req.session
    let tasks = await getEmployeeTasks(find_task_date, username)
    let data = await getCurrentDayTasks(username)
    console.log(tasks)
    if (tasks === null) {
      res.redirect('/employee/dashboard')
    } else {
      res.render('EmployeeDashboard', { data: data, tasks: tasks })
    }
  })

router
  .route('/updateEmployee')
  .get(async (req, res) => {

    let { username } = req.session
    const data = await getEmployeeData(username)
    res.render('updateEmployee', { data: data })

  })
  .post(async (req, res) => {

    let updatedData = req.body;

    await updateEmployeeData(updatedData)
    req.session.username = req.body.username
    console.log(req.session.username)
    res.redirect('/employee/updateEmployee')
  });

router
  .route('/addTask')
  .post(async (req, res) => {

    let timedate = req.body.st_time

    let data = {
      username: req.session.username,
      desc: req.body.desc,
      type: req.body.type,
      time_taken: req.body.time_taken,
      st_time: `${timedate.split("T")[1]}:00`,
      date: timedate.split("T")[0],
    }

    await setEmployeeTasks(data)

    res.redirect('/employee/dashboard');
  });

router
  .route('/deleteTask')
  .post((req, res) => {
    let desc = req.body.desc;
    let type = req.body.type;
    let st_time = req.body.st_time;
    let time = req.body.time;
    console.log(desc, type, st_time, time)
    conn.query(`DELETE FROM tasks WHERE (task_description='${desc}') AND (task_type='${type}') AND (start_time='${st_time}')`, (err, rows) => {
      if (err) throw err;
      console.log('Data deleted');
    });
    res.redirect('/employee/dashboard');
  });

router
  .route('/updateTask')
  .post((req, res) => {
    let desc = req.body.udesc;
    let type = req.body.utype;
    let st_time = req.body.ust_time;
    let time_taken = req.body.utime_taken;
    let prevDesc = req.body.prevDesc;
    console.log(time_taken)
    conn.query(`UPDATE tasks SET task_description = '${desc}',  task_type = '${type}', start_time= '${st_time}', time_taken = '${time_taken}' WHERE task_description = '${prevDesc}';`, (err, rows) => {
      if (err) {
        throw err;
      }
      else {
        console.log('Task updated');
      }
    });
    res.redirect('/employee/dashboard');
  });

router 
  .route('/logout')
  .get((req, res) => {
    req.session.destroy()
    res.redirect('/')
  })

module.exports = router