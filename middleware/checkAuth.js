require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.checkAuth = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      const error = new Error("Fobidden error");
      error.statusCode = 403;
      throw error;
    } else {
      const token = authHeaders.split(" ")[1];
      jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, user) => {
        if (error) {
          const error = new Error('Forbidden error');
          error.statusCode = 403;
          throw error;
        }
        req.user = user;
        next();
      });
    }
  } catch(error) {
    if(!error.statusCode){
        error.statusCode = 500;
    }
    next(error);
  }
};