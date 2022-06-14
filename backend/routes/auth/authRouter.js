var express = require('express');
var router = express.Router();

var authController = require('../../controllers/auth');

router.post('/api/auth/signin', authController.signin);

module.exports = router;