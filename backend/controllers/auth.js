const bcrypt = require("bcryptjs/dist/bcrypt");
var jwt = require("jsonwebtoken");

var db = require("../db").db;
const config = require("../auth");

exports.signin = function (req, res) {
  var employeeByEmail = `select * from employees join roles on employees.role_id = roles.id
    where employees.email_id = '${req.body.email}' `;
  var result = db.queryHandler(employeeByEmail);
  result.then((data) => {
    if (data.length > 0) {
      employee = data[0];
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        employee.password
      );
      if (passwordIsValid) {
        var token = jwt.sign({ id: employee.id }, config.secret, {
          expiresIn: 86400, // 24 hours
        });
        var loggedInRole = employee.role_name;
        var authorities = [`ROLE_${loggedInRole.toUpperCase()}`];
        res.status(200).send({
          id: employee.id,
          email: employee.email_id,
          roles: authorities,
          accessToken: token,
        });
      } else {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
    } else {
      return res.status(404).send({ accessToken: null, message: "User Not found." });
    }
  });
};
