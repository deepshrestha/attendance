var db = require("../db").db;

exports.getById = function (req, res) {
  //console.log(req.params.id)
  var query = `select id,
                      role_name, parent_id, fn_dateTimeFormat(created_at) as created_at
              from roles
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
  var query = `select row_number() over(order by r1.id) as sn, 
                      r1.id,
                      r1.role_name, 
                      r1.parent_id, 
                      r2.role_name as parent_role, 
                      fn_dateTimeFormat(r1.created_at) as created_at,
                      e.full_name as created_by
                from roles as r1 
                join employees e on r1.created_by = e.id
                left join roles as r2 on r1.parent_id = r2.id
                where r1.role_name <> 'None'`;

  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.insertRoleData = function (req, res) {
  
  var query = `insert into roles (
                role_name, 
                parent_id,
                created_at, 
                created_by
              ) 
              values (
                '${req.body.role_name}', 
                '${req.body.parent_id}', 
                now(),
                '${req.body.created_by}'
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

exports.updateRoleData = function (req, res) {
  //console.log(req.body);
  var query = `update roles 
                 set role_name = '${req.body.role_name}', 
                 updated_at = now(),
                 updated_by = '${req.body.updated_by}',
                 parent_id = '${req.body.parent_id}'
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
