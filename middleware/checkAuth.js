require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if(!authHeaders){
        res.status(401).json({message: 'Authorization token is not found'});
    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, user) => {
        if(err){
            res.status(403).json({message: err.message});
        }
        req.user = user;
        next();
    });
}