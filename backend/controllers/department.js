var db = require('../db').db;

exports.getById = function(req, res) {
    //console.log(req.params.id)
    var query = `select id,
                        department_name,
                        fn_dateTimeFormat(created_at) as created_at
                from departments
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
                        department_name,
                        fn_dateTimeFormat(d.created_at) as created_at,
                        e.full_name as created_by
                from departments d
                join employees e on d.created_by = e.id
                order by d.id`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.insertDepartmentData = function(req, res) {
    //console.log(req.body);
    var query = `insert into departments (department_name, created_at, created_by) 
                 values ('${req.body.department_name}', now(), '${req.body.created_by}')`;

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

exports.updateDepartmentData = function(req, res) {
    //console.log(req.body);
    var query = `update departments 
                 set department_name = '${req.body.department_name}'
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