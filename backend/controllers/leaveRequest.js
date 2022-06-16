var db = require('../db').db;

exports.getById = function(req, res) {
    //console.log(req.params.id)
    var query = `select id,
                        leave_master_id,
                        requested_by, requested_to,
                        fn_dateFormat(start_date) as start_date,
                        fn_dateFormat(end_date) as end_date,
                        fn_dateTimeFormat(requested_at) as requested_at
                from leave_request
                where id = ${req.params.id}`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data[0]);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.getAll = function(req, res) {
    var query = `select row_number() over(order by lr.id) as sn,
                        lr.id,
                        lm.name as leave_type,
                        e1.full_name as requested_by, 
                        e2.full_name as requested_to,
                        fn_dateFormat(lr.start_date) as start_date,
                        fn_dateFormat(lr.end_date) as end_date,
                        fn_dateTimeFormat(lr.requested_at) as requested_at
                from leave_request lr
                join leave_master lm on lr.leave_master_id = lm.id
                join employees e1 on lr.requested_by = e1.id
                join employees e2 on lr.requested_to = e2.id
                order by lr.id`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.insertLeaveRequestData = function(req, res) {
    //console.log(req.body);
    var query = `insert into leave_request (leave_master_id, requested_by, requested_to, 
                 start_date, end_date, requested_at) 
                 values ('${req.body.leave_master_id}', '${req.body.requested_by}', 
                 '${req.body.requested_to}', '${req.body.start_date}', '${req.body.end_date}',
                 now())`;

    console.log(query);
    
    var result = db.queryHandler(query);

    result.then(data => {
        console.log("last insert Id: ", data.insertId);
        res.json(data.insertId);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.updateLeaveRequestData = function(req, res) {
    //console.log(req.body);
    var query = `update leave_request 
                 set leave_master_id = '${req.body.leave_master_id}', 
                 requested_to = '${req.body.requested_to}', 
                 start_date = '${req.body.start_date}', 
                 end_date = '${req.body.end_date}'
                 where id = '${req.body.id}'`;

    console.log(query);
    
    var result = db.queryHandler(query);

    result.then(data => {
        //console.log(data);
        res.json(
            {
                success: true,
                message: "Updated successfully"
            }
        );
    })
    .catch(err => {
        console.log(err)
    })
};

exports.getSeniorApprovers = function(req, res) {
    var query = `select approverEmployee.id, approverEmployee.full_name from employees approverEmployee
                 join employees requestorEmployee on requestorEmployee.id = ${req.query.requested_by}
                 join departments d on approverEmployee.department_id = d.id
                 join roles r on approverEmployee.role_id = r.parent_id
    `;
    console.log(query)
    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
}