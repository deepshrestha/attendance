var express = require('express');
var router = express.Router();

var leaveRequestController = require('../../controllers/leaveRequest');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/leave-requests/approvers/:requested_by',  leaveRequestController.getSeniorApprovers);
router.post('/api/leave-requests/process',  leaveRequestController.processLeaveRequest);
router.get('/api/leave-requests/:id',  leaveRequestController.getById);
router.get('/api/leave-requests',  leaveRequestController.getAll);
router.post('/api/leave-requests',  leaveRequestController.insertLeaveRequestData);
router.put('/api/leave-requests',  leaveRequestController.updateLeaveRequestData);
router.get('/api/leave-requests/leave-count/:id/:requested_by',  leaveRequestController.getRemainingLeaveDays);
router.get('/api/leave-requests/requestor/:requested_by/:leave_status_id',  leaveRequestController.getMyLeaveRequests);
router.get('/api/leave-requests/approver/:requested_to',  leaveRequestController.getLeaveRequests);

module.exports = router;