require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const pool = require('../config/db_connection');

exports.signup = async (req, res, next) => {
    const {email, password, firstname, lastname} = req.body;
    try{
        const data = await pool.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
        if(data.rows.length > 0){
            throw new Error('This email is already exist');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await pool.query('INSERT INTO users(email, password, firstname, lastname) VALUES ($1,$2,$3,$4)', [email, hashedPassword,firstname, lastname]);
        res.status(201).json({message: 'You successfuly signed up'});
    } catch(err){
        res.status(409).json({message: err.message});
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const data = await pool.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
        if(data.rows.length === 0){
            throw new Error('The account with this email is not exist');
        }
        const onMatch = await bcrypt.compare(password, data.rows[0].password);
        if(!onMatch){
            throw new Error('Password is incorrect');
        }
        const token = jwt.sign({email: email}, process.env.JWT_PRIVATE_KEY, {expiresIn: "1h"});
        res.status(200).json({email: email, token: token});
    } catch(err){
        res.status(401).json({message: err.message});
    }
}