const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/send-request', (req, res, next) => {
    res.send('index');
})

router.get('/accept-request', (req, res, next) => {
    res.send('index');
})

router.get('/see-requests', (req, res, next) => {
    res.send('index');
})

router.get('/sendrequest', (req, res, next) => {
    res.send('index');
})



module.exports = router;

