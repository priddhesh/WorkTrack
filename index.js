const express = require('express');
var nodemailer = require('nodemailer');
const app = express();
const mysql = require('mysql');
require('dotenv').config()
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use('/scripts', express.static(__dirname + '/scripts'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

app.get('/addEmployee', (req, res) => {
    conn.query(`SELECT * from employee_info`, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.render('AdminDashboard', { data: data });
        }
    });
});

app.get('/dashboard', (req, res) => {
    let todayDate = new Date()
    todayDate = todayDate.toISOString().split('T')[0]

    conn.query(`SELECT * from tasks WHERE date='${todayDate}'`, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            conn.query(`select time_taken from tasks where  task_type='Work' AND date='${todayDate}';`, (err, data1) => {
                if (err) {
                    throw err;
                }
                else {
                    conn.query(`select time_taken from tasks where  task_type='Meeting' AND date='${todayDate}';`, (err, data2) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            conn.query(`select time_taken from tasks where  task_type='Break' AND date='${todayDate}';`, (err, data3) => {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    res.render('EmployeeDashboard', { data: data, data1: data1, data2: data2, data3: data3 });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.get('/updateEmployee', (req, res) => {
    let username = "mayur";
    conn.query(`SELECT * from employee_info WHERE username='${username}'`, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.render('UpdateEmployee', { data: data });
        }
    });
});

app.post('/add_employee', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let contact = req.body.contact;
    let dept = req.body.dept;
    let join_date = req.body.join_date;
    let password = req.body.password;
    conn.query(`INSERT INTO  employee_info(username,email,contact,dept,join_date,password) VALUES('${username}','${email}','${contact}','${dept}','${join_date}','${password}')`, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                }
            });

            var mailOptions = {
                from: process.env.EMAIL,
                to: `${email}`,
                subject: 'Login Credentials',
                text: `Your login credentials are as follows:\nUsername: ${username}  '\nPassword:  ${password} '\n\nRegards,\nAdmin`
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response)
                }
            })

            console.log('Data updated');
            res.redirect('/addEmployee');
        }
    });
});

app.post('/update_employee', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let contact = req.body.contact;
    let dept = req.body.department;
    let checkval = req.body.checkval;
    let password = req.body.new_password;
    if (checkval == undefined) {
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

app.post('/add_task', (req, res) => {
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
    res.redirect('/dashboard');
});

app.post('/deactivate', (req, res) => {
    let email = req.body.email;
    conn.query(`DELETE FROM employee_info WHERE email='${email}'`, (err, rows) => {
        if (err) throw err;
        else{
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                }
            });

            var mailOptions = {
                from: process.env.EMAIL,
                to: `${email}`,
                subject: 'Account Deactivated',
                text: `Your account has been deactivated by the admin.\n\nRegards,\nAdmin`
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response)
                }
            })
            res.redirect('/addEmployee');
        }
    });
});

app.post('/deleteTask', (req, res) => {
    let desc = req.body.desc;
    let type = req.body.type;
    let st_time = req.body.st_time;
    let time = req.body.time;
    conn.query(`DELETE FROM tasks WHERE (task_description='${desc}') AND (task_type='${type}') AND (start_time='${st_time}')`, (err, rows) => {
        if (err) throw err;
        console.log('Data deleted');
    });
    res.redirect('/dashboard');
});

app.post('/updateTask', (req, res) => {
    let desc = req.body.udesc;
    let type = req.body.utype;
    let st_time = req.body.ust_time;
    let time_taken = req.body.utime_taken;
    let prevDesc = req.body.prevDesc;
    conn.query(`UPDATE tasks SET task_description = '${desc}',  task_type = '${type}', start_time= '${st_time}', time_taken = '${time_taken}' WHERE task_description = '${prevDesc}';`, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            console.log('Task updated');
        }
    });
    res.redirect('/dashboard');
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});
