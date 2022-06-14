var db = require("../db").db;
const bcrypt = require("bcryptjs/dist/bcrypt");
const mailSenderHelper = require("../helpers/mailSender");

exports.getById = function (req, res) {
  //console.log(req.params.id)
  var query = `select id,
                      shift_id, role_id, department_id, 
                      full_name, email_id, password, fn_dateFormat(dob) as dob, 
                      contact_no, address,
                      fn_dateTimeFormat(created_at) as created_at
              from employees
              where id = ${req.params.id}`;
  console.log(query);
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
  var query = `select row_number() over(order by id) as sn,
                        employees.id as id,
                        shifts.shift_name as shift_name, shifts.id as shift_id, 
                        roles.role_name as role_name, roles.id as role_id, 
                        departments.department_name as department_name, departments.id as department_id, 
                        full_name, 
                        email_id, password, fn_dateFormat(dob) as dob, 
                        contact_no, address,
                        fn_dateTimeFormat(employees.created_at) as created_at
                from employees 
                join shifts on employees.shift_id = shifts.id
                join roles on employees.role_id = roles.id
                join departments on employees.department_id = departments.id
                order by id `;

  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.insertEmployeeData = function (req, res) {
  var query = `insert into employees (
                shift_id, 
                department_id, 
                role_id, 
                full_name, 
                email_id, 
                password, 
                dob, 
                contact_no, 
                address, 
                created_at, 
                created_by
              ) 
              values (
                '${req.body.shift_id}', 
                '${req.body.department_id}',
                '${req.body.role_id}',
                '${req.body.full_name}', 
                '${req.body.email_id}', 
                '${getEncryptedPasswordFromEmail(req.body.email_id)}',
                '${req.body.dob}', 
                '${req.body.contact_no}', 
                '${req.body.address}', 
                now(),
                '1'
              )`;



  console.log(query);

  var result = db.queryHandler(query);

  result
    .then((data) => {
      console.log("last insert Id: ", data.insertId);
      mailSenderHelper.send(
        res,
        req.body.full_name,
        req.body.email_id,
        password
      );
    //   res.json(data.insertId);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateEmployeeData = function (req, res) {
  //console.log(req.body);
  var query = `update employees 
                 set address = '${req.body.address}', 
                 contact_no = '${req.body.contact_no}', 
                 dob = '${req.body.dob}', 
                 email_id = '${req.body.email_id}', 
                 password = '${getEncryptedPasswordFromEmail(req.body.email_id)}',
                 full_name = '${req.body.full_name}', 
                 shift_id = '${req.body.shift_id}',
                 role_id = '${req.body.role_id}',
                 department_id = '${req.body.department_id}'
                 where id = '${req.body.id}'`;

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

function getEncryptedPasswordFromEmail(email){
  let password = email.split("@")[0];
  return encryptedPassword = bcrypt.hashSync(password, 8)
}
