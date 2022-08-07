const express = require('express');
const router = express.Router();
const {signup, login, logout} = require('../controller/authController');

router.put('/signup', signup);
router.post('/login', login);
router.delete('/logout/:id', logout);

module.exports = router;