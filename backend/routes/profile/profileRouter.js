var express = require('express');
var router = express.Router();

var profileController = require('../../controllers/myProfile');

router.get('/api/profile/:id', profileController.getProfileById);

module.exports = router;