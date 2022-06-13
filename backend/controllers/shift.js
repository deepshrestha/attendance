var db = require('../db').db;

exports.getAll = function(req, res) {
    var query = `select row_number() over(order by id) as sn,
                        shift_name, 
                        start_week_day, 
                        CASE WHEN allow_overtime = 1 THEN 'true' ELSE 'false' END AS allow_overtime, 
                        start_overtime,
                        fn_dateFormat(created_at) as created_at
                from shifts
                order by id`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.insertShiftData = function(req, res) {
    //console.log(req.body);
    var query = `insert into shifts (shift_name, start_week_day, allow_overtime, start_overtime, created_at, created_by) 
                values ('${req.body.shiftName}', '${req.body.startWeekDay}', ${req.body.allowOverTime}, '${req.body.startOverTime}', now(), '1')`;

    console.log(query);
    //return
    var result = db.queryHandler(query);

    result.then(data => {
        console.log("last insert Id: ", data.insertId);
        res.json(data.insertId);
    })
    .catch(err => {
        console.log(err)
    })
};