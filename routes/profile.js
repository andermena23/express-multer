var express = require('express');
var router = express.Router();
const multer  = require('multer')

const maxSize = 2 * 1024 * 1024; // 2 * 1MB

const formatFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Soilik irudi fitxategiak onartzen dira!'), false);
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = file.originalname.split('.').pop();
        const fileNameWithoutExtension = file.originalname.replace(`.${fileExtension}`, '');
        cb(null, `${fileNameWithoutExtension}-${uniqueSuffix}.${fileExtension}`)
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: formatFilter,
    limits: { fileSize: maxSize }
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    console.log(req.file)
    // req.body will hold the text fields, if there were any
    res.send("Jasota")
})

module.exports = router;
