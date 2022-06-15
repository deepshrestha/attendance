var express = require('express');
var router = express.Router();

var workingDayController = require('../../controllers/workingDay');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/workingDays', [authJwtMiddleWare.verifyToken], workingDayController.getAll);
router.post('/api/workingDays', [authJwtMiddleWare.verifyToken], workingDayController.insertWorkingDayData);
router.get('/api/workingDays/:id', [authJwtMiddleWare.verifyToken], workingDayController.getById);
router.put('/api/workingDays', [authJwtMiddleWare.verifyToken], workingDayController.updateWorkingDayData);

module.exports = router;