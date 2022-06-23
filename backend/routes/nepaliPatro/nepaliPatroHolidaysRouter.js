var express = require('express');
var router = express.Router();

var nepaliPatroHolidays = require('../../controllers/nepaliPatroHoliday2079');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.post('/api/nepaliPatroHolidays/import', [authJwtMiddleWare.verifyToken], nepaliPatroHolidays.import);

module.exports = router;