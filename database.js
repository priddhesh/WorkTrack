const mysql = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_URI,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_USER
}).promise()

const authenticate = async (username, password) => {

    try {
        const [result] = await pool.query(`SELECT * FROM employee_info WHERE username = ? AND password = ?`, [username, password])
        console.log(result)
        
        if(result.length > 0) return true // user found
        else return false // user not found

    }
    catch(err) {
        console.log(err)
    }
} 


module.exports = { authenticate, pool }