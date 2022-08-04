const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRouters'));
router.use('/api', require('./postRoutes'));

module.exports = router;