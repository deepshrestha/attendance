var db = require('../db').db;

exports.getById = function(req, res) {
    //console.log(req.params.id)
    var query = `select id,
                        designation_name,
                        fn_dateTimeFormat(created_at) as created_at
                from designations
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
    var query = `select row_number() over(order by d.id) as sn,
                        d.id,
                        designation_name,
                        fn_dateTimeFormat(d.created_at) as created_at,
                        e.full_name as created_by
                from designations d
                join employees e on d.created_by = e.id
                where designation_name <> 'None'
                order by d.id`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.insertDesignationData = function(req, res) {
    //console.log(req.body);
    var query = `insert into designations (designation_name, created_at, created_by) 
                 values ('${req.body.designation_name}', now(), '${req.body.created_by}')`;

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

exports.updateDesignationData = function(req, res) {
    //console.log(req.body);
    var query = `update designations 
                 set designation_name = '${req.body.designation_name}',
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