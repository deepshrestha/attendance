var express = require('express');
var router = express.Router();

var shiftController = require('../../controllers/shift');

router.get('/api/shifts', shiftController.getAll);
router.post('/api/shifts', shiftController.insertShiftData);

module.exports = router;