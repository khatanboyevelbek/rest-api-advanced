const express = require('express');
const router = express.Router();
const {signup} = require('../controller/authController');

router.put('/register', signup)

module.exports = router;