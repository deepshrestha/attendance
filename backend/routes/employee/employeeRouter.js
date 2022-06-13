var express = require('express');
var router = express.Router();

var employeeController = require('../../controllers/employee');

router.get('/api/employees/:id', employeeController.getById);
router.get('/api/employees', employeeController.getAll);
router.post('/api/employees', employeeController.insertEmployeeData);
router.put('/api/employees', employeeController.updateEmployeeData);

module.exports = router;