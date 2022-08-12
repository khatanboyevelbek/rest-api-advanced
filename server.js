require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');
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

const morganLogStream = fs.createWriteStream(path.join(__dirname, '/logStream.log'),{flags: 'a'});
// const privateKey = fs.readFileSync('./server.key');
// const publicKey = fs.readFileSync('./server.cert');

app.use(express.json());
app.use(multer({storage: multerConfig.storage, fileFilter: multerConfig.fileFilter}).single('image'));
app.use(cors(corsConfig));
app.use(helmet());
app.use(morgan('combined', {stream: morganLogStream}));

//Initialize route
app.use(require('./routes/index'));

// https.createServer({key: privateKey, cert: publicKey}).listen(port, () => {
//     console.log('Server is running');
// })
server.listen(port, () => {
    console.log('Server is running');
});