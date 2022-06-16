var express = require('express');
var router = express.Router();

var leaveStatusController = require('../../controllers/leaveStatus');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/leave-status/:id', [authJwtMiddleWare.verifyToken], leaveStatusController.getById);
router.get('/api/leave-status', [authJwtMiddleWare.verifyToken], leaveStatusController.getAll);
router.post('/api/leave-status', [authJwtMiddleWare.verifyToken], leaveStatusController.insertLeaveStatusData);
router.put('/api/leave-status', [authJwtMiddleWare.verifyToken], leaveStatusController.updateLeaveStatusData);

module.exports = router;