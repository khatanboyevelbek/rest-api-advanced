require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT;
const multerConfig = require('./config/multerConfig');

const corsConfig = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'FETCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credential: true
}

app.use(express.json());
app.use(multer({storage: multerConfig.storage, fileFilter: multerConfig.fileFilter}).single('image'));
app.use(cors(corsConfig));

//Initialize route
app.use(require('./routes/index'));

server.listen(port, () => {
    console.log('Server is running');
})