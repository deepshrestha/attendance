var db = require('../db').db;

exports.getById = function(req, res) {
    //console.log(req.params.id)
    var query = `select id,
                        name,
                        fn_dateTimeFormat(created_at) as created_at
                from leave_master
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
    var query = `select row_number() over(order by l.id) as sn,
                        l.id,
                        name,
                        fn_dateTimeFormat(l.created_at) as created_at,
                        e.full_name as created_by
                from leave_master l
                join employees e on l.created_by = e.id
                order by l.id`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.insertLeaveMasterData = function(req, res) {
    //console.log(req.body);
    var query = `insert into leave_master (name, created_at, created_by) 
                 values ('${req.body.name}', now(), '${req.body.created_by}')`;

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

exports.updateLeaveMasterData = function(req, res) {
    //console.log(req.body);
    var query = `update leave_master 
                 set name = '${req.body.name}'
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