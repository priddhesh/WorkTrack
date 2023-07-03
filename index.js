require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const session = require('express-session')
var nodemailer = require('nodemailer')
const admin = require('./router/admin')
const employee = require('./router/employee')
const { authenticate, pool } = require('./database')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    maxAge: 1000 * 60 * 60
  },
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())
app.set('view engine', 'ejs')

app
.route('/')
.get((req, res) => {
  res.render('login')
})
.post(async (req, res) => {
  var { username, password, role } = req.body
  const result = await authenticate(username, password, role)
  if (result) {
    req.session.username = username
    req.session.role = role
    if(role === 'Admin') res.redirect('/admin/addEmployee')
    else res.redirect('/employee/dashboard')
  }
  else {
    res.redirect('/')
  }
  
})

app.use('/admin', admin)
app.use('/employee', employee)

// app.get('/dashboard', (req, res) => {
//     let todayDate = new Date()
//     todayDate = todayDate.toISOString().split('T')[0]

//     conn.query(`SELECT * from tasks WHERE date='${todayDate}'`, (err, data) => {
//         if (err) {
//             throw err;
//         }
//         else {
//             conn.query(`select time_taken from tasks where  task_type='Work' AND date='${todayDate}';`, (err, data1) => {
//                 if (err) {
//                     throw err;
//                 }
//                 else {
//                     conn.query(`select time_taken from tasks where  task_type='Meeting' AND date='${todayDate}';`, (err, data2) => {
//                         if (err) {
//                             throw err;
//                         }
//                         else {
//                             conn.query(`select time_taken from tasks where  task_type='Break' AND date='${todayDate}';`, (err, data3) => {
//                                 if (err) {
//                                     throw err;
//                                 }
//                                 else {
//                                     res.render('EmployeeDashboard', { data: data, data1: data1, data2: data2, data3: data3 });
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// });

// app.post('/add_employee', (req, res) => {
//     let username = req.body.username;
//     let email = req.body.email;
//     let contact = req.body.contact;
//     let dept = req.body.dept;
//     let join_date = req.body.join_date;
//     let password = req.body.password;
//     conn.query(`INSERT INTO  employee_info(username,email,contact,dept,join_date,password) VALUES('${username}','${email}','${contact}','${dept}','${join_date}','${password}')`, (err, rows) => {
//         if (err) {
//             throw err;
//         }
//         else {
//             var transporter = nodemailer.createTransport({
//                 service: 'Gmail',
//                 auth: {
//                     user: process.env.EMAIL,
//                     pass: process.env.PASS
//                 }
//             });

//             var mailOptions = {
//                 from: process.env.EMAIL,
//                 to: `${email}`,
//                 subject: 'Login Credentials',
//                 text: `Your login credentials are as follows:\nUsername: ${username}  '\nPassword:  ${password} '\n\nRegards,\nAdmin`
//             }

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log('Email sent: ' + info.response)
//                 }
//             })

//             console.log('Data updated');
//             res.redirect('/addEmployee');
//         }
//     });
// });


// app.post('/deactivate', (req, res) => {
//     let email = req.body.email;
//     conn.query(`DELETE FROM employee_info WHERE email='${email}'`, (err, rows) => {
//         if (err) throw err;
//         else{
//             var transporter = nodemailer.createTransport({
//                 service: 'Gmail',
//                 auth: {
//                     user: process.env.EMAIL,
//                     pass: process.env.PASS
//                 }
//             });

//             var mailOptions = {
//                 from: process.env.EMAIL,
//                 to: `${email}`,
//                 subject: 'Account Deactivated',
//                 text: `Your account has been deactivated by the admin.\n\nRegards,\nAdmin`
//             }

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log('Email sent: ' + info.response)
//                 }
//             })
//             res.redirect('/addEmployee');
//         }
//     });
// });

app.listen('3000', () => {
    console.log('Server started on port 3000');
});
