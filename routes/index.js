const express = require('express');
const path = require('path');
const router = express.Router();

router.use('/auth', require('./authRouters'));
router.use('/api', require('./postRoutes'));

module.exports = router;