//const socketAPI = require("./test-device")
const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const app = express()

//const db = require("./db").db;
var shifts = require('./routes/shift/shiftRouter');
var departments = require('./routes/department/departmentRouter');
var workingDays = require('./routes/workingDay/workingDayRouter');
var attendance = require('./routes/attendance/attendanceRouter');
var employee = require('./routes/employee/employeeRouter');
var auth = require('./routes/auth/authRouter');
var role = require('./routes/role/roleRouter');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', shifts);
app.use('/', departments);
app.use('/', workingDays);
app.use('/', attendance);
app.use('/', employee);
app.use('/', auth);
app.use('/', role);

/* app.post("/getRealTimeData", (req, res) => {
    let userId = req.body.userId;
    let attendanceTime = req.body.attTime;
    console.log(userId, attendanceTime)
    
    var query = `insert into attendance_logs (UserID, CheckInTime) 
                values ('${userId}', '${attendanceTime}')`;

    var result = db.queryHandler(query);

    result.then(data => {
        console.log("last insert Id: ", data.insertId);
        var query = "select * from attendance_logs";
        db.queryHandler(query)
        .then(data => {
            data.map(item => {
                console.log(item.id, item.userId, item.checkInTime)
            })
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
    res.send("Submitted")
}) */

app.get("/getUsers", (req, res) => {
    try{
        socketAPI.then(data => {
            res.json(data.users)
        })
        .catch(err => {
            console.log("Problem occured while fetching user data!")
        })
    } catch(e){}
})

/* app.get("/getAttendance", (req, res) => {
    var query = "select * from attendance_logs";
    var result = db.queryHandler(query);
    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
        
    // socketAPI.then(data => {
    //     res.json(data.attendences)
    // })
    // .catch(err => {
    //     console.log("Problem occured while fetching data!")
    // })
}) */

app.listen(3000, () => {
    console.log("server is running on port 3000!")
})