const express = require('express') 
const app = express()
const path = require('path')
const ejs = require('ejs')
const {authenticate} = require('./database.js')
const publicDirectoryPath = path.join(__dirname, 'public');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('login')
})

app.post('/', async (req, res) => {
  var { username, password } = req.body
  const result = await authenticate(username, password)
  console.log(result)
  if(result) {
    res.send('success')
  }
  else {
    res.send('User not found')
  }

})

app.listen(3000, () => "server running..")