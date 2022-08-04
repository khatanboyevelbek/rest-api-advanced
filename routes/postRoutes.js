const express = require('express');
const router = express.Router();
const {allPosts, newPost} = require('../controller/postController');

router.get('/feeds', allPosts);
router.post('/new_post', newPost);

module.exports = router;