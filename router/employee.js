const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const empAuth = require('./empAuth')
const moment = require('moment')

const {
  getEmployeeTasks,
  getCurrentDayTasks,
  setEmployeeTasks,
  getEmployeeData,
  updateEmployeeData,
  getCurrentDayChartData,
  updateTasks,
  deleteTasks,
  addLeave,
  getApplications,
  deleteRequest,
  updateApplication
} = require('../database')

// const conn = mysql.createConnection({
//   host: process.env.MYSQL_URI,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_USER
// });

router.use(empAuth)

router
  .route('/dashboard')
  .get(async (req, res) => {
    let username = req.session.username
    const data = await getCurrentDayTasks(username)
    const { workData, breakData, meetingData } = await getCurrentDayChartData(username)
    let tasks = req.session.prevData //req.flash('data')
    if (tasks !== null && tasks !== undefined && tasks.length > 0) {
      tasks.forEach(task => {
        task.date = new Date(task.date)
      });
    }
    // console.log(req.session.visited)
    res.render('EmployeeDashboard', {
      username: username,
      data: data ? data : {},
      data1: workData,
      data2: breakData,
      data3: meetingData,
      tasks: tasks ? tasks : [],
      visited: req.session.visited === undefined ? false : req.session.visited
    })
  })
  .post(async (req, res) => {
    let { find_task_date } = req.body
    let { username } = req.session
    let tasks = await getEmployeeTasks(find_task_date, username)
    let data = await getCurrentDayTasks(username)
    const { workData, breakData, meetingData } = await getCurrentDayChartData(username)
    if (tasks === null) {
      req.session.visited = true
      req.session.prevData = []
      res.redirect('/employee/dashboard')
    } else {
      req.session.visited = false
      req.session.prevData = tasks
      res.render('EmployeeDashboard', {
        username: username,
        data: data ? data : {},
        data1: workData,
        data2: breakData,
        data3: meetingData,
        tasks: tasks,
        visited: false
      })
    }
  })

router
  .route('/updateEmployee')
  .get(async (req, res) => {

    let { username } = req.session
    const data = await getEmployeeData(username)
    res.render('UpdateEmployee', { data: data })

  })
  .post(async (req, res) => {

    let updatedData = {
      data: req.body,
      prevUsername: req.session.username
    }

    await updateEmployeeData(updatedData)
    req.session.username = req.body.username
    console.log(req.session.username)
    res.redirect('/employee/dashboard')
  });

  router
  .route('/applications')
  .get(async (req, res) => {
    let username = req.session.username;
    const data = await getApplications(username);
    res.render('EmployeeApplications',{data: data});
  })

router
  .route('/addTask')
  .post(async (req, res) => {

    let timedate = req.body.st_time;
    let currDate = new Date();
    currDate = moment(currDate).format('YYYY-MM-DD');

    let data = {
      username: req.session.username,
      desc: req.body.desc,
      type: req.body.type,
      time_taken: req.body.time_taken,
      st_time: `${timedate.split("T")[1]}:00`,
      date: timedate.split("T")[0],
    }
    
    await setEmployeeTasks(data)

    if (data.date !== currDate) {
      let prevData = await getEmployeeTasks(data.date, data.username)
      req.session.prevData = prevData
    }

    res.redirect('/employee/dashboard');
  });


router
  .route('/deleteTask')
  .post(async (req, res) => {
    
    let deleteData = {
      data: req.body,
      username: req.session.username
    }
    let data = await deleteTasks(deleteData)
    if (deleteData.data.date !== undefined) {
      req.session.prevData = data;
    }
    res.redirect('/employee/dashboard');
  });

router
  .route('/updateTask')
  .post(async (req, res) => {
    let updateData = {
      data: req.body,
      username: req.session.username
    }
    // console.log(req.body)
    let data = await updateTasks(updateData)
    // console.log(data)
    if (updateData.data.prevDate !== undefined) { // req.flash('data', data)
       req.session.prevData = data
    }
    res.redirect('/employee/dashboard')
  })

router
  .route('/addLeave')
  .post(async (req, res) => {
    let leaveData = {
      data: req.body,
      username: req.session.username
    }
    let data = await addLeave(leaveData);
    res.redirect('/employee/dashboard')
  })

router
  .route('/deleteApplication')
  .post(async (req, res) => {
    let data = req.body;
    await deleteRequest(data);
    res.redirect('/employee/applications');
  })

router
  .route('/updateApplication')
  .post(async (req, res) => {
    let username = req.session.username;
    let data = req.body;
    await updateApplication(data,username);
    res.redirect('/employee/applications');
  })

router
  .route('/logout')
  .get((req, res) => {
    req.session.destroy()
    res.redirect('/')
  })

module.exports = router