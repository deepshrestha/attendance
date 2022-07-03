var db = require("../db").db;
var transaction = require("../db").transaction;

const mailSenderHelper = require("../helpers/mailSender");

const leaveMaster = require('./leaveMaster')

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
                start_date, end_date, leave_count_days, requested_at, remarks) 
                values (
                  '${req.body.leave_master_id}', 
                  '${req.body.requested_by}', 
                  '${req.body.requested_to}', 
                  '${req.body.start_date}', 
                  '${req.body.end_date}', 
                  datediff('${req.body.end_date}', '${req.body.start_date}') + 1,
                  now(), 
                  '${req.body.remarks}'
                )`;

  //console.log(query);

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
                 leave_count_days = datediff('${req.body.end_date}', '${req.body.start_date}') + 1,
                 remarks = '${req.body.remarks}'
                 where id = '${req.body.id}'`;

  //console.log(query);

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

exports.getRemainingLeaveDays = function(req, res) {
  var query = `select coalesce(sum(leave_count_days), 0) as requested_pending_leave,
                      m.name
              from leave_request r
              join leave_master m on (m.id = r.leave_master_id and r.leave_master_id = ${req.params.id})
              left join leave_request_detail d on (d.leave_request_id = r.id)
              where d.leave_request_id is null
              and r.requested_by = ${req.params.requested_by}`;

  //console.log(query);
  var result = db.queryHandler(query);

  result
    .then((data) => {
      if(data[0].requested_pending_leave > 0) {
        res.json(
          {
            pending_leave: true,
            message: `You have already been requested ${data[0].name} for ${data[0].requested_pending_leave} day/s`
          }
        );
      }
      else {
        var query = `select m.leave_days - coalesce(sum(leave_count_days), 0) as total_leave_count,
                            m.name
                    from leave_master m
                    join leave_request r on (r.leave_master_id = m.id and r.leave_master_id = ${req.params.id})
                    left join leave_request_detail d on (r.id = d.leave_request_id and status_id = 1)
                    where d.leave_request_id is not null
                    and r.requested_by = ${req.params.requested_by}`;

        //console.log(query);
        var result = db.queryHandler(query);

        result
        .then((data) => {
          res.json(
            {
              pending_leave: false,
              total_remaining_leave: data[0].total_leave_count,
              message: `You have ${data[0].total_leave_count} day/s of ${data[0].name} remaining`
            }
          );
        })
        .catch((err) => {
        console.log(err);
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });     
  
};

exports.getSeniorApprovers = function (req, res) {
  var query = `select approverEmployee.id, approverEmployee.full_name from employees approverEmployee
                 join employees requestorEmployee on requestorEmployee.id = ${req.params.requested_by}
                 join departments d on approverEmployee.department_id = requestorEmployee.department_id = d.id
                 join roles r on requestorEmployee.role_id = r.id
                 where approverEmployee.role_id = r.parent_id
    `;
  //console.log(query);
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
                e3.full_name as leave_processed_by,
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
                LEFT JOIN employees e3 ON lrd.leave_processed_by = e3.id
                LEFT JOIN leave_status ls on ls.id = lrd.status_id
                where lr.requested_by = ${
                  req.params.requested_by
                } ${getStatusWhereQuery(req.params.leave_status_id)}
                group by lr.id
                ) as tmp_table order by id`;

  var result = db.queryHandler(query);
  //console.log(result);
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
                WHERE FIND_IN_SET(${req.params.requested_to}, REPLACE(lr.requested_to, ' ', ''))
                ${getStatusWhereQuery(req.query.leave_status_id)}
                group by lr.id
                ) as tmp_table order by id`;

  //console.log(query);

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
  var statusName = req.body.status_name; 
  var query0 = `select id from leave_status where name='${statusName}'`;
  transaction.begin();
  var result0 = db.queryHandler(query0);
  result0.then((data) => {
    var statusId = data[0]["id"];
    var query = `insert into leave_request_detail(leave_request_id, status_id, status_date, leave_processed_by, remarks) 
        values(
            ${req.body.leave_request_id}, ${statusId}, now(), ${req.body.leave_processed_by}, '${req.body.remarks}'
        )`;

    //console.log(query);

    var result = db.queryHandler(query);

    result
      .then((data) => {
        if(statusName === 'Approved'){
          var query12 = `select m.leave_days - coalesce(sum(r.leave_count_days), 0) as total_leave_count,
                                m.name
                        from leave_master m
                        join leave_request r1 on r1.id = ${req.body.leave_request_id}
                        join leave_request r on (r.leave_master_id = m.id AND r.leave_master_id = r1.leave_master_id AND r.requested_by = r1.requested_by)
                        left join leave_request_detail d on (r.id = d.leave_request_id and status_id = 1)
                        where d.leave_request_id is not null 
                        `;

            db.queryHandler(query12).then((data12) => {
              if(data12[0].total_leave_count < 0){
                transaction.rollback();
                res.json({
                  success: false,
                  message: `Approval failed. Leave limit has exceeded for this leave.`,
                });
              }
            })
        }

        var query1 = `select e.full_name as full_name, e1.full_name as leave_processor, e.email_id, 
            lm.name as leave_type_name,
            fn_dateFormat(lr.start_date) as start_date,
            fn_dateFormat(lr.end_date) as end_date from leave_request_detail lrd
            JOIN leave_request lr ON lrd.leave_request_id = lr.id
            JOIN employees e ON lr.requested_by = e.id
            JOIN employees e1 ON lrd.leave_processed_by = e1.id
            JOIN leave_master lm ON lr.leave_master_id = lm.id
            WHERE leave_request_id = ${req.body.leave_request_id} and status_id = ${statusId}
        `;

        var result1 = db.queryHandler(query1);
        result1.then((data1) => {
          mailSenderHelper.sendLeaveApprovalEmail(
            res,
            data1[0]["full_name"],
            data1[0]["email_id"],
            data1[0]["leave_processor"],
            data1[0]["leave_type_name"],
            statusName,
            data1[0]["start_date"],
            data1[0]["end_date"]
          );
          res.json({
            success: true,
            message: `Leave has been ${statusName}`,
          });
          transaction.commit();
        }).catch((err) => {
          transaction.rollback();
          console.log(err);
        });
      })
      .catch((err) => {
        transaction.rollback();
        console.log(err);
      });
  }).catch((err) => {
    transaction.rollback();
    console.log(err);
  });
};
