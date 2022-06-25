var db = require("../db").db;

exports.getById = function (req, res) {
  //console.log(req.params.id)
  var query = `select id,
                        leave_master_id,
                        requested_by, requested_to,
                        fn_dateFormat(start_date) as start_date,
                        fn_dateFormat(end_date) as end_date,
                        fn_dateTimeFormat(requested_at) as requested_at,
                        remarks
                from leave_request
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
  var query = `select row_number() over(order by lr.id) as sn,
                        lr.id,
                        lm.name as leave_type,
                        e1.full_name as requested_by, 
                        e2.full_name as requested_to,
                        fn_dateFormat(lr.start_date) as start_date,
                        fn_dateFormat(lr.end_date) as end_date,
                        fn_dateTimeFormat(lr.requested_at) as requested_at,
                        lr.remarks
                from leave_request lr
                join leave_master lm on lr.leave_master_id = lm.id
                join employees e1 on lr.requested_by = e1.id
                join employees e2 on lr.requested_to = e2.id
                order by lr.id`;

  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.insertLeaveRequestData = function (req, res) {
  //console.log(req.body);
  var query = `insert into leave_request (leave_master_id, requested_by, requested_to, 
                 start_date, end_date, requested_at, remarks) 
                 values ('${req.body.leave_master_id}', '${
    req.body.requested_by
  }', 
                 '${req.body.requested_to ? req.body.requested_to : 1}', '${
    req.body.start_date
  }', '${req.body.end_date}', 
                 now(), '${req.body.remarks}')`;

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

exports.updateLeaveRequestData = function (req, res) {
  //console.log(req.body);
  var query = `update leave_request 
                 set leave_master_id = '${req.body.leave_master_id}', 
                 requested_to = '${req.body.requested_to}', 
                 start_date = '${req.body.start_date}', 
                 end_date = '${req.body.end_date}',
                 remarks = '${req.body.remarks}'
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

exports.getSeniorApprovers = function (req, res) {
  var query = `select approverEmployee.id, approverEmployee.full_name from employees approverEmployee
                 join employees requestorEmployee on requestorEmployee.id = ${req.query.requested_by}
                 join departments d on approverEmployee.department_id = requestorEmployee.department_id = d.id
                 join roles r on requestorEmployee.role_id = r.id
                 where approverEmployee.role_id = r.parent_id
    `;
  console.log(query);
  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMyLeaveRequests = function (req, res) {
  var query = `SELECT row_number() over(order by id) as sn, tmp_table.* FROM (SELECT lr.id,
                lm.name as leave_type,
                e1.full_name as requested_by, 
                GROUP_CONCAT(e2.full_name SEPARATOR ', ') requested_to,
                fn_dateFormat(lr.start_date) as start_date,
                fn_dateFormat(lr.end_date) as end_date,
                fn_dateTimeFormat(lr.requested_at) as requested_at,
                case when lr.remarks = '' then 'N/a' else lr.remarks end as remarks,
                CASE WHEN ls.name IS NULL OR ls.name = ''
                THEN 'Pending'
                ELSE ls.name
                END AS status_name
                from leave_request lr
                join leave_master lm on lr.leave_master_id = lm.id
                join employees e1 on lr.requested_by = e1.id
                JOIN employees e2 ON FIND_IN_SET(e2.id, REPLACE(lr.requested_to, ' ', ''))
                LEFT JOIN leave_request_detail lrd on lr.id = lrd.leave_request_id
                LEFT JOIN leave_status ls on ls.id = lrd.status_id
                where lr.requested_by = ${
                  req.params.requested_by
                } ${getStatusWhereQuery(req.query.leave_status_id)}
                group by lr.id
                ) as tmp_table order by id`;

  var result = db.queryHandler(query);
  console.log(result);
  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLeaveRequests = function (req, res) {
  var query = `SELECT row_number() over(order by id) as sn, tmp_table.* FROM (SELECT lr.id,
                        lm.name as leave_type,
                        e1.full_name as requested_by,
                        GROUP_CONCAT(e2.full_name SEPARATOR ', ') requested_to,
                        fn_dateFormat(lr.start_date) as start_date,
                        fn_dateFormat(lr.end_date) as end_date,
                        fn_dateTimeFormat(lr.requested_at) as requested_at,
                        case when lr.remarks = '' then 'N/a' else lr.remarks end as remarks,
                        CASE WHEN ls.name IS NULL OR ls.name = ''
                        THEN 'Pending'
                        ELSE ls.name
                        END AS status_name
                from leave_request lr
                join leave_master lm on lr.leave_master_id = lm.id
                join employees e1 on lr.requested_by = e1.id
                JOIN employees e2 ON FIND_IN_SET(e2.id, REPLACE(lr.requested_to, ' ', ''))
                LEFT JOIN leave_request_detail lrd on lr.id = lrd.leave_request_id
                LEFT JOIN leave_status ls on ls.id = lrd.status_id
                WHERE FIND_IN_SET(${
                  req.params.requested_to
                }, REPLACE(lr.requested_to, ' ', ''))
                ${getStatusWhereQuery(req.query.leave_status_id)}
                group by lr.id
                ) as tmp_table order by id`;

  console.log(query);

  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

function getStatusWhereQuery(leaveStatusId) {
  return leaveStatusId == 0
    ? `and lrd.status_id is null`
    : `and lrd.status_id = ${leaveStatusId}`;
}
exports.processLeaveRequest = function (req, res) {
  var query0 = `select id from leave_status where name='${req.body.status_name}'`;
  var result0 = db.queryHandler(query0);
  result0.then((data) => {
    var query = `insert into leave_request_detail(leave_request_id, status_id, status_date, remarks) values(
            ${req.body.leave_request_id}, ${data[0]["id"]}, now(), '${req.body.remarks}'
        )`;

    console.log(query);

    var result = db.queryHandler(query);

    result
      .then((data) => {
        res.json({
          success: true,
          message: `Leave has been ${req.body.status_name}`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
