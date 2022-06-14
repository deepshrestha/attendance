var express = require('express');
var router = express.Router();

var roleController = require('../../controllers/role');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/roles', [authJwtMiddleWare.verifyToken], roleController.getAll);
router.post('/api/roles', [authJwtMiddleWare.verifyToken], roleController.insertRoleData);
router.get('/api/roles/:id', [authJwtMiddleWare.verifyToken], roleController.getById);
router.put('/api/roles', [authJwtMiddleWare.verifyToken], roleController.updateRoleData);

module.exports = router;