const mysql = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_URI,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_USER
}).promise()

const authenticate = async (username, password, role) => {
    if(role === 'Admin') {
        try {
            const [data] = await pool.query(`SELECT * FROM admin_info WHERE username = ? AND password = ?`, [username, password])
            
            
            if(data.length > 0) return true // user found
            else return false // user not found

        }
        catch(err) {
            console.log(err)
        }
    } else {
        try {
            const [data] = await pool.query(`SELECT * FROM employee_info WHERE username = ? AND password = ?`, [username, password])
            
            
            if(data.length > 0) return true // user found
            else return false // user not found

        }
        catch(err) {
            console.log(err)
        }
    }
} 

const getCurrentDayTasks = async (username) => {
    let todayDate = new Date()
    todayDate = todayDate.toISOString().split('T')[0]
    try {
        const [data] = await pool.execute(`SELECT * from tasks WHERE date= ? AND username = ?`, [todayDate, username]) 
        
        if(data.length > 0) return data
        else return null
    }
    catch(err) {
        console.log(err)
    }
}

const getEmployeeTasks = async (date, username) => {
    try {
        const [data] = await pool.query(`SELECT * FROM tasks WHERE date = ? AND username = ?`, [date, username])
        
        
        if(data.length > 0) return data 
        else return null 

    }
    catch(err) {
        console.log(err)
    }   
}

const setEmployeeTasks = async ({username, desc, type, time_taken, st_time, date}) => {
    try {

        const [data] = await pool.execute('INSERT INTO  tasks(task_description,task_type,date,start_time,time_taken,username) VALUES(?,?,?,?,?,?)',[desc, type, date, st_time, time_taken, username])
        
        

    } catch(err) {
        console.log(err)
    }
}

const getEmployeeData = async (username) => {

    try {

        const [data] = await pool.execute('SELECT * FROM employee_info WHERE username = ?',[username])
        
        
        if(data.length > 0) return data
        else return null

    } catch(err) {
        console.log(err)
    }

}

const updateEmployeeData = async (data) => {
    
    let { email, username, department, contact, checkval, new_password } = data

    try {

        if(checkval === undefined) {
            await pool.execute(`UPDATE employee_info SET username = ?, dept = ?, contact= ? WHERE email = ?`,[username, department, contact, email])

        } else { 
            await pool.execute(`UPDATE employee_info SET username = ?, dept = ?, contact= ?, password = ? WHERE email = ?`,[username, department, contact, new_password, email])
            
        }
        console.log("Data Updated..")
    } catch(err) {
        console.log(err)
    }

}

module.exports = { 
    authenticate, 
    pool,
    getEmployeeTasks,
    getCurrentDayTasks,
    setEmployeeTasks,
    getEmployeeData,
    updateEmployeeData,
 }