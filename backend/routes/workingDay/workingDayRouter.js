var express = require('express');
var router = express.Router();

var workingDayController = require('../../controllers/workingDay');

router.get('/api/workingDays', workingDayController.getAll);
router.post('/api/workingDays', workingDayController.insertWorkingDayData);

module.exports = router;