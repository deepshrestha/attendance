var db = require('../db').db;

exports.getById = function(req, res) {
    //console.log(req.params.id)
    var query = `select id,
                        department_name,
                        fn_dateFormat(created_at) as created_at
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
    var query = `select row_number() over(order by id) as sn,
                        id,
                        department_name,
                        fn_dateFormat(created_at) as created_at
                from departments
                order by id`;

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
                 values ('${req.body.department_name}', now(), '1')`;

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

exports.updateDepartmentData = function(req, res) {
    //console.log(req.body);
    var query = `update departments 
                 set department_name = '${req.body.department_name}'
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