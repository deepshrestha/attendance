var db = require('../db').db;

exports.getById = function (req, res) {
    var query = `select id,
                        shift_name, 
                        start_week_day, 
                        CASE WHEN allow_overtime = 1 THEN 'true' ELSE 'false' END AS allow_overtime, 
                        start_overtime,
                        fn_dateTimeFormat(created_at) as created_at
                from shifts
                where id = ${req.params.id}`;
    var result = db.queryHandler(query);
  
    result
      .then((data) => {
        res.json(data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

exports.getAll = function(req, res) {
    var query = `select row_number() over(order by id) as sn,
                        id,
                        shift_name, 
                        start_week_day, 
                        CASE WHEN allow_overtime = 1 THEN 'true' ELSE 'false' END AS allow_overtime, 
                        start_overtime,
                        fn_dateTimeFormat(created_at) as created_at
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
                values ('${req.body.shift_name}', '${req.body.start_week_day}', ${req.body.allow_overtime}, '${req.body.start_overtime}', now(), '1')`;

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

exports.updateShiftData = function (req, res) {
    console.log(req.body);
    var query = `update shifts 
                   set shift_name = '${req.body.shift_name}',
                   start_week_day = '${req.body.start_week_day}', 
                   allow_overtime = '${req.body.allow_overtime}',
                   start_overtime = '${req.body.start_overtime}'
                   where id = '${req.body.id}'`;
  
    console.log(query);
  
    var result = db.queryHandler(query);
  
    result
      .then((data) => {
        //console.log(data);
        res.json({
          success: true,
          message: "Updated successfully",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  exports.updateAllowOvertime = function (req, res) {
    console.log(req.body);
    var query = `update shifts 
                   set allow_overtime = ${req.body.allow_overtime}
                   where id = '${req.body.id}'`;
  
    console.log(query);
  
    var result = db.queryHandler(query);
  
    result
      .then((data) => {
        //console.log(data);
        res.json({
          success: true,
          message: "Overtime field Updated successfully",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  