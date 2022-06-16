var express = require('express');
var router = express.Router();

var leaveMasterController = require('../../controllers/leaveMaster');
var authJwtMiddleWare = require("../../middlewares/authJwt");

router.get('/api/leaves/:id', [authJwtMiddleWare.verifyToken], leaveMasterController.getById);
router.get('/api/leaves', [authJwtMiddleWare.verifyToken], leaveMasterController.getAll);
router.post('/api/leaves', [authJwtMiddleWare.verifyToken], leaveMasterController.insertLeaveMasterData);
router.put('/api/leaves', [authJwtMiddleWare.verifyToken], leaveMasterController.updateLeaveMasterData);

module.exports = router;