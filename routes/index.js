const express = require('express');
const path = require('path');
const router = express.Router();

router.use('/auth', require('./authRouters'));
router.use('/api', require('./postRoutes'));
router.use((error, req, res, next) => {
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({message: message});
});
router.use('*', (req, res, next) => {
    res.status(404).json({message: 'Page not found'});
});

module.exports = router;