const path = require('path');
const fs = require('fs');
const pool = require('../config/db_connection');

const deleteFile = (p) => {
   const imagePath = path.join(__dirname,'../',p);
   fs.unlink(imagePath, (err) => {
    if(err) throw err;
   });
}

exports.allPosts = async (req, res, next) => {
    try{
        const data = await pool.query('SELECT * FROM posts');
        if(data.rows.length === 0){
            throw new Error('Posts not found');
        }
        res.status(200).json(data.rows);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}
exports.getSinglePost = async (req, res, next) => {
    try {
        const {id} = req.params;
        const data = await pool.query('SELECT * FROM posts WHERE post_id = $1',[id]);
        if(data.rows.length === 0){
            throw new Error('Post not found');
        }
        res.status(200).json(data.rows);
    } catch(err) {
        res.status(404).json({message: err.message});
    }
}
exports.createPost = async (req, res, next) => {
    try{
        const {title, description, creator_id} = req.body;
        const image = req.file.path.split('/')[1];
        const data = await pool.query('INSERT INTO posts(title,description,creator_id,image) VALUES ($1,$2,$3,$4) RETURNING *',[title,description,creator_id,image]);
        res.status(201).json({message: 'Post successfuly saved', data: data.rows});
    } catch(err){
        res.status(500).json(err.message);
    }
}
exports.updatePost = async (req, res, next) => {
    try{
        const {id} = req.params;
        const {title, description, creator_id} = req.body;
        const image = req.file.path.split('/')[1];
        const oldPost = await pool.query('SELECT * FROM posts WHERE post_id = $1',[id]);
        const updatedPost = await pool.query(`
            UPDATE posts SET title = $1, description = $2, creator_id = $3, image = $4
            WHERE post_id = $5 RETURNING *
        `,[
            title ? title:oldPost.rows[0].title, 
            description ? description:oldPost.rows[0].description,
            creator_id ? creator_id:oldPost.rows[0].creator_id,
            image ? image:oldPost.rows[0].image,
            id
        ]);
        if(oldPost.rows[0].image !== updatedPost.rows[0].image){
            deleteFile(oldPost.rows[0].image);
        }
        res.status(200).json({message: 'Post successfuly updated', data: updatedPost.rows});
    } catch(err){
        res.status(500).json({message: err.message});
    }
}
exports.deletePost = async (req, res, next) => {
    try {
        const {id}= req.params;
        await pool.query('DELETE FROM posts WHERE post_id = $1', [id]);
        res.status(200).json({message: 'Post successfuly deleted'});
    } catch(err){
        res.status(500).json({message: err.message});
    }
}