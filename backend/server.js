//const socketAPI = require("./test-device")
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

//const db = require("./db").db;
var shifts = require('./routes/shift/shiftRouter');
var departments = require('./routes/department/departmentRouter');
var workingDays = require('./routes/workingDay/workingDayRouter');
var attendance = require('./routes/attendance/attendanceRouter');
var employee = require('./routes/employee/employeeRouter');
var auth = require('./routes/auth/authRouter');
var role = require('./routes/role/roleRouter');
var designation = require('./routes/designation/designationRouter');
var leaveMaster = require('./routes/leaves/leaveMasterRouter');
var leaveStatus = require('./routes/leaves/leaveStatusRouter');
var leaveRequest = require('./routes/leaves/leaveRequestRouter');
var holidays = require('./routes/holidays/myHolidayRouter');
var nepaliPatroHolidays = require('./routes/nepaliPatro/nepaliPatroHolidaysRouter');
var profile = require('./routes/profile/profileRouter');
var importUser = require('./routes/importUser/importUserRouter');

app.use(cors());
app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', shifts);
app.use('/', departments);
app.use('/', workingDays);
app.use('/', attendance);
app.use('/', employee);
app.use('/', auth);
app.use('/', role);
app.use('/', designation);
app.use('/', leaveMaster);
app.use('/', leaveStatus);
app.use('/', leaveRequest);
app.use('/', holidays);
app.use('/', nepaliPatroHolidays);
app.use('/', profile);
app.use('/', importUser);

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

app.listen(3000, () => {
    console.log("server is running on port 3000!")
})