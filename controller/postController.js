const pool = require('../config/db_connection');

exports.allPosts = async (req, res, next) => {
    const data = await pool.query('SELECT * FROM posts');
    res.status(200).json(data.rows);
}
exports.newPost = async (req, res, next) => {
    console.log(req.body);
}