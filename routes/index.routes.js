// ---------- IMPORT PACKAGES ----------- //
const express = require('express');
const router  = express.Router();

// ---------- ROUTES ----------- //
// ---------- Home view route ----------- //
router.get('/', (req, res, next) => {
  res.send('index');
});

module.exports = router;
