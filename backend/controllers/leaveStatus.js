var db = require('../db').db;

exports.getById = function(req, res) {
    //console.log(req.params.id)
    var query = `select id,
                        name,
                        fn_dateTimeFormat(created_at) as created_at
                from leave_status
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
    var query = `select row_number() over(order by ls.id) as sn,
                        ls.id,
                        name,
                        fn_dateTimeFormat(ls.created_at) as created_at,
                        e.full_name as created_by
                from leave_status ls
                join employees e on ls.created_by = e.id
                order by ls.id`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.insertLeaveStatusData = function(req, res) {
    //console.log(req.body);
    var query = `insert into leave_status (name, created_at, created_by) 
                 values ('${req.body.name}', now(), '${req.body.created_by}')`;

    //console.log(query);
    
    var result = db.queryHandler(query);

    result.then(data => {
        console.log("last insert Id: ", data.insertId);
        res.json(
            {
                success: true,
                message: "Created successfully"
            }
        );
    })
    .catch(err => {
        console.log(err)
    })
};

exports.updateLeaveStatusData = function(req, res) {
    //console.log(req.body);
    var query = `update leave_status 
                 set name = '${req.body.name}',
                 updated_at = now(),
                 updated_by = '${req.body.updated_by}'
                 where id = '${req.body.id}'`;

    //console.log(query);
    
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