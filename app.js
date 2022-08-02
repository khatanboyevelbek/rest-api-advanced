require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT;
const authRouters = require('./routes/authRouters');

const corsConfig = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'FETCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credential: true
}

app.use(express.json());
app.use(multer().any());
app.use(cors(corsConfig));

app.use('/auth', authRouters);

server.listen(port, () => {
    console.log('Server is running');
})