var authJwtMiddleWare = require("../../middlewares/authJwt");

var express = require('express');
var router = express.Router();

var employeeController = require('../../controllers/employee');

router.get('/api/employees/:id', [authJwtMiddleWare.verifyToken], employeeController.getById);
router.get('/api/employees', [authJwtMiddleWare.verifyToken], employeeController.getAll);
router.post('/api/employees', [authJwtMiddleWare.verifyToken], employeeController.insertEmployeeData);
router.put('/api/employees', [authJwtMiddleWare.verifyToken], employeeController.updateEmployeeData);

module.exports = router;