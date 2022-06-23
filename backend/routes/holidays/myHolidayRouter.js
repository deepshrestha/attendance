var express = require('express');
var router = express.Router();

var holidayController = require('../../controllers/myHoliday');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/holidays', [authJwtMiddleWare.verifyToken], holidayController.getAll);

module.exports = router;