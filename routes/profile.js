var express = require('express');
var router = express.Router();
const multer  = require('multer')
const fs = require('fs');
const path = require('path');

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

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
    const name = req.body.name;
    const filePath = `/uploads/${req.file.filename}`;

    res.send(`
        <p>Zure izena: ${name}</p>
        <p>Fitxategia: <a href="${filePath}" target="_blank">${filePath}</a></p>
      `);
})

module.exports = router;
