var express = require('express');
var router = express.Router();

var shiftController = require('../../controllers/shift');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/shifts', [authJwtMiddleWare.verifyToken], shiftController.getAll);
router.post('/api/shifts', [authJwtMiddleWare.verifyToken], shiftController.insertShiftData);

module.exports = router;