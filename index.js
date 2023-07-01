const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const { authenticate, pool } = require('./database.js')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('login')
})

app.post('/', async (req, res) => {
  var { username, password, role } = req.body
  const result = await authenticate(username, password, role)
  console.log(result)
  if (result) {
    res.send('success')
  }
  else {
    res.send('User not found')
  }

})

app.get('/addEmployee', (req, res) => {
  pool.query(`SELECT * from employee_info`, (err, data) => {
      if (err) {
          throw err;
      }
      else {
          res.render('AdminDashboard',{data:data});
      }
  });
});

app.get('/dashboard', (req, res) => {
  pool.query(`SELECT * from tasks`, (err, data) => {
      if (err) {
          throw err;
      }
      else {
          console.log(data);
          res.render('EmployeeDashboard',{data:data});
      }
  });
});


app.get('/updateEmployee', (req, res) => {
  let username = "mayur";
  pool.query(`SELECT * from employee_info WHERE username='${username}'`, (err, data) => {
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
  pool.query(`INSERT INTO  employee_info(username,email,contact,dept,join_date,password) VALUES('${username}','${email}','${contact}','${dept}','${join_date}','${password}')`, (err, rows) => {
    if (err) throw err;
    console.log('Data inserted');
  });
  res.redirect('/addEmployee');
});

app.post('/update_employee', (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let contact = req.body.contact;
  let dept = req.body.department;
  let checkval = req.body.checkval;
  let password = req.body.new_password;
  console.log(contact);
  if (checkval == undefined) {
    pool.query(`UPDATE employee_info SET username = '${username}', dept = '${dept}', contact= '${contact}' WHERE email = '${email}';`, (err, rows) => {
      if (err) {
        throw err;
      }
      else {
        console.log('Data updated');
        res.redirect('/updateEmployee');
      }
    });
  } else {
    pool.query(`UPDATE employee_info SET username = '${username}',  dept = '${dept}', contact= '${contact}', password = '${password}' WHERE email = '${email}';`, (err, rows) => {
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
  pool.query(`INSERT INTO  tasks(task_description,task_type,date,start_time,time_taken,username) VALUES('${desc}','${type}','${date}','${st_time}','${time_taken}','')`, (err, rows) => {
    if (err) throw err;
    console.log('Data inserted');
  });
  res.redirect('/dashboard');
});

app.post('/deactivate', (req, res) => {
  let email = req.body.email;
  pool.query(`DELETE FROM employee_info WHERE email='${email}'`, (err, rows) => {
      if (err) throw err;
  });
  res.redirect('/addEmployee');
});

app.listen(3000, () => "server running..")