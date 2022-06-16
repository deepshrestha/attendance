var express = require('express');
var router = express.Router();

var leaveRequestController = require('../../controllers/leaveRequest');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/leave-requests/approvers',  leaveRequestController.getSeniorApprovers);
router.get('/api/leave-requests/:id',  leaveRequestController.getById);
router.get('/api/leave-requests',  leaveRequestController.getAll);
router.post('/api/leave-requests',  leaveRequestController.insertLeaveRequestData);
router.put('/api/leave-requests',  leaveRequestController.updateLeaveRequestData);

module.exports = router;