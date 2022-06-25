var db = require("../db").db;

exports.getById = function (req, res) {
  //console.log(req.params.id)
  var query = `select id,
                        name,
                        leave_days,
                        fn_dateTimeFormat(created_at) as created_at
                from leave_master
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

exports.getAll = function (req, res) {
  var query = `select row_number() over(order by l.id) as sn,
                        l.id,
                        name,
                        leave_days,
                        fn_dateTimeFormat(l.created_at) as created_at,
                        e.full_name as created_by
                from leave_master l
                join employees e on l.created_by = e.id
                order by l.id`;

  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllWithLeaveDaysOfRequestor = function (req, res) {

    var query = `SELECT lm.*, 
                CASE WHEN lr.id is NOT NULL THEN lm.leave_days - SUM(datediff(lr.end_date, lr.start_date) + 1) 
                ELSE lm.leave_days
                END as remaining_leave_days 
                FROM leave_master lm LEFT JOIN leave_request lr ON lr.leave_master_id = lm.id AND lr.requested_by = ${req.query.requested_by} 
                GROUP by lm.id;`;

  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.insertLeaveMasterData = function (req, res) {
  //console.log(req.body);
  var query = `insert into leave_master (name, leave_days, created_at, created_by) 
                 values ('${req.body.name}', '${req.body.leave_days}', now(), '${req.body.created_by}')`;

  console.log(query);

  var result = db.queryHandler(query);

  result
    .then((data) => {
      console.log("last insert Id: ", data.insertId);
      res.json(
        {
            success: true,
            message: "Created successfully"
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateLeaveMasterData = function (req, res) {
  //console.log(req.body);
  var query = `update leave_master 
                 set name = '${req.body.name}',
                     leave_days = '${req.body.leave_days}',
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
