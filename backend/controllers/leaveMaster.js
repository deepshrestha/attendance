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
  var query = `SELECT row_number() over(order by l1.id) as sn, l1.*, CASE WHEN taken_leaves_table.remaining_leave_days is NOT NULL 
          THEN taken_leaves_table.remaining_leave_days
          ELSE l1.leave_days
          END as remaining_leave_days 
          FROM leave_master l1 
          LEFT JOIN 
          (SELECT lm.*, CASE WHEN lr.id is NOT NULL THEN 
          lm.leave_days - coalesce(sum(leave_count_days), 0)
          ELSE lm.leave_days
          END as remaining_leave_days 
          FROM leave_master lm 
          JOIN leave_request lr ON lr.leave_master_id = lm.id AND lr.requested_by=${req.query.requested_by}
          left JOIN leave_request_detail d ON d.leave_request_id = lr.id AND d.status_id = 1 
          where d.leave_request_id is not null
          GROUP by lm.id) 
          as taken_leaves_table 
          ON l1.id = taken_leaves_table.id;`;

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
