var db = require('../db').db;

exports.getAttendance = function(req, res) {
    var query = "select * from attendance_logs";
    var result = db.queryHandler(query);
    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.getRealTimeData = function(req, res) {
    let userId = req.body.userId;
    let attendanceTime = req.body.attTime;
    console.log(userId, attendanceTime)
    
    var query = `insert into attendance_logs (UserID, CheckInTime) 
                values ('${userId}', '${attendanceTime}')`;

    console.log(query);
    
    /* var result = db.queryHandler(query);

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
        res.json(true);
    })
    .catch(err => {
        console.log(err)
    }) */
    res.send("Submitted")
};