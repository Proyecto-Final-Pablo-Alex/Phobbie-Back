// ---------- IMPORT PACKAGES ----------- //
const router = require('express').Router()
const uploader = require('../configs/cloudinary.config.js')

// ---------- CLODINARY UPLOAD ROUTE ----------- //
router.post('/upload', uploader.single("imageUrl"), (req, res, next) => {
    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }
    res.status(200).json({image: req.file.path})
})


module.exports = router