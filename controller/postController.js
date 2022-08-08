const path = require('path');
const fs = require('fs');
const pool = require('../config/db_connection');

const deleteFile = (p) => {
   const imagePath = path.join(process.cwd(),'/files',p);
   fs.unlink(imagePath, (error) => {
    if(error) throw error;
   });
}

exports.allPosts = async (req, res, next) => {
    try{
        const data = await pool.query('SELECT * FROM posts WHERE creator_id = $1', [req.user.user_id]);
        if(data.rows.length == 0){
            const error = new Error('Posts not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(data.rows);
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.getSinglePost = async (req, res, next) => {
    try {
        const {id} = req.params;
        const data = await pool.query('SELECT * FROM posts WHERE post_id = $1 AND creator_id = $2',[id, req.user.user_id]);
        if(data.rows.length === 0){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(data.rows);
    } catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.createPost = async (req, res, next) => {
    try{
        const {title, description} = req.body;
        const image = req.file.path.split('/')[1];
        const data = await pool.query('INSERT INTO posts(title,description,creator_id,image) VALUES ($1,$2,$3,$4) RETURNING *',[title,description,req.user.user_id,image]);
        res.status(201).json({message: 'Post successfuly saved', data: data.rows});
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.updatePost = async (req, res, next) => {
    try{
        const {id} = req.params;
        const {title, description} = req.body;
        const image = req.file.path.split('/')[1];
        const oldPost = await pool.query('SELECT * FROM posts WHERE post_id = $1 AND creator_id = $2',[id, req.user.user_id]);
        const updatedPost = await pool.query(`
            UPDATE posts SET title = $1, description = $2, creator_id = $3, image = $4
            WHERE post_id = $5 RETURNING *
        `,[
            title ? title:oldPost.rows[0].title, 
            description ? description:oldPost.rows[0].description,
            req.user.user_id,
            image ? image:oldPost.rows[0].image,
            id
        ]);
        if(oldPost.rows[0].image !== updatedPost.rows[0].image){
            deleteFile(oldPost.rows[0].image);
        }
        res.status(200).json({message: 'Post successfuly updated', data: updatedPost.rows});
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.deletePost = async (req, res, next) => {
    try {
        const {id}= req.params;
        const data = await pool.query('DELETE FROM posts WHERE post_id = $1 AND creator_id = $2 RETURNING *', [id, req.user.user_id]);
        if(data.rows.length == 0){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        deleteFile(data.rows[0].image)
        res.status(200).json({message: 'Post successfuly deleted'});
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}