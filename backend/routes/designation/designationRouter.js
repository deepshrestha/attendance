var express = require('express');
var router = express.Router();

var designationController = require('../../controllers/designation');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/designations/:id', [authJwtMiddleWare.verifyToken], designationController.getById);
router.get('/api/designations', [authJwtMiddleWare.verifyToken], designationController.getAll);
router.post('/api/designations', [authJwtMiddleWare.verifyToken], designationController.insertDesignationData);
router.put('/api/designations', [authJwtMiddleWare.verifyToken], designationController.updateDesignationData);

module.exports = router;