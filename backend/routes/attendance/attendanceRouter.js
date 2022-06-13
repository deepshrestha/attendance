var express = require('express');
var router = express.Router();

var attendanceController = require('../../controllers/attendance');

router.get('/api/attendance', attendanceController.getAttendance);
router.post('/api/attendance', attendanceController.getRealTimeData);

module.exports = router;