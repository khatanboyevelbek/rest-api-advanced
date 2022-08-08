require('dotenv').config();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const pool = require('../config/db_connection');

const deleteFile = (p) => {
    const imagePath = path.join(process.cwd(),'/files',p);
    fs.unlink(imagePath, (error) => {
     if(error) throw error;
    });
 }

exports.signup = async (req, res, next) => {
    const {email, password, firstname, lastname} = req.body;
    try{
        const data = await pool.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
        if(data.rows.length > 0){
            const error = new Error('This email is already exist');
            error.statusCode = 409;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await pool.query('INSERT INTO users(email, password, firstname, lastname) VALUES ($1,$2,$3,$4) RETURNING *', [email, hashedPassword,firstname, lastname]);
        res.status(201).json({message: 'You successfuly signed up', user: user.rows});
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const data = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if(data.rows.length === 0){
            const error = new Error('The account with this email is not exist');
            error.statusCode = 401;
            throw error;
        }
        const onMatch = await bcrypt.compare(password, data.rows[0].password);
        if(!onMatch){
            const error = new Error('Password is incorrect');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({email: email, user_id: data.rows[0].user_id}, process.env.JWT_PRIVATE_KEY, {expiresIn: "1h"});
        res.status(200).json({email: email, token: token});
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.logout = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userPosts = await pool.query('SELECT * FROM posts WHERE creator_id = $1', [id]);
        await pool.query('DELETE FROM users WHERE user_id = $1',[id]);
        if(userPosts.rows.length > 0){
            for(let i = 0; i < userPosts.rows.length; i++){
                deleteFile(userPosts.rows[i].image);
            }
        }
        res.status(200).json({message: 'You successfuly logged out'});
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}