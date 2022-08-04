require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT;

const corsConfig = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'FETCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credential: true
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './files');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

app.use(express.json());
app.use(multer({storage: storage}).single('image'));
app.use(cors(corsConfig));

//Initialize route
app.use(require('./routes/index'));

server.listen(port, () => {
    console.log('Server is running');
})