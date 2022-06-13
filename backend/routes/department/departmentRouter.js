var express = require('express');
var router = express.Router();

var departmentController = require('../../controllers/department');

router.get('/api/departments/:id', departmentController.getById);
router.get('/api/departments', departmentController.getAll);
router.post('/api/departments', departmentController.insertDepartmentData);
router.put('/api/departments', departmentController.updateDepartmentData);

module.exports = router;