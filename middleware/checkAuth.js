const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
    const token = req.headers['Authorization'];
    console.log(token);
}