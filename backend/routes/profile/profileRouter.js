var express = require('express');
const multer = require('multer');
const path = require("path");
var router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/');
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({
    storage: storage
});

var profileController = require('../../controllers/myProfile');

router.get('/api/profile/:id', profileController.getProfileById);
router.post('/api/upload-image/:id', upload.single('image'), profileController.postProfileImage);

module.exports = router;