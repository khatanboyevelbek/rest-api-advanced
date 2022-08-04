const { json } = require('express');
const pool = require('../config/db_connection');

exports.allPosts = async (req, res, next) => {
    try{
        const data = await pool.query('SELECT * FROM posts');
        res.status(200).json(data.rows);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}
exports.newPost = async (req, res, next) => {
    const {title, description, creator_id} = req.body;
    const image = req.file
    try{
        const data = await pool.query('INSERT INTO posts(title,description,creator_id,image) VALUES ($1,$2,$3,$4) RETURNING *',[title,description,creator_id,image.path]);
        res.status(201).json({message: 'Post successfuly saved', data: data.rows});
    } catch(err){
        res.status(500).json(err.message);
    }
}