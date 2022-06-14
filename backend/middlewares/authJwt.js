const jwt = require("jsonwebtoken");
const authConfig = require("../auth");

exports.verifyToken = function (req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

// const authJwt = {
//   verifyToken
// };
// module.exports = authJwt;
