var express = require('express');
var router = express.Router();

var importUserController = require('../../controllers/importUser');

router.post('/api/import-user-data', importUserController.postUserData);

module.exports = router;