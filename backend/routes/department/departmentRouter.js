var express = require('express');
var router = express.Router();

var departmentController = require('../../controllers/department');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/departments/:id', [authJwtMiddleWare.verifyToken], departmentController.getById);
router.get('/api/departments', [authJwtMiddleWare.verifyToken], departmentController.getAll);
router.post('/api/departments', [authJwtMiddleWare.verifyToken], departmentController.insertDepartmentData);
router.put('/api/departments', [authJwtMiddleWare.verifyToken], departmentController.updateDepartmentData);

module.exports = router;