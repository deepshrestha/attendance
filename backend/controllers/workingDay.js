var db = require('../db').db;

exports.getAll = function(req, res) {
    var query = `select row_number() over(order by id) as sn,
                        working_day, 
                        start_time, 
                        end_time, 
                        fn_dateFormat(created_at) as created_at
                from working_days
                order by id`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.insertWorkingDayData = function(req, res) {
    //console.log(req.body);
    var query = `insert into working_days (
                    working_day, 
                    start_time,  
                    end_time,
                    created_at, 
                    created_by
                ) 
                values (
                    '${req.body.workingDay}', 
                    '${req.body.startTime}', 
                    '${req.body.endTime}', 
                    now(), 
                    '1')
                `;

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