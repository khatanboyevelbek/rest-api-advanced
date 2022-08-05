const express = require('express');
const path = require('path');
const router = express.Router();
const {allPosts, getSinglePost, createPost, updatePost, deletePost} = require('../controller/postController');

router.get('/feeds', allPosts);
router.get('/post/:id', getSinglePost)
router.post('/new_post', createPost);
router.put('/post/:id', updatePost);
router.delete('/post/:id', deletePost);
router.use('/files', express.static(path.join(process.cwd(),'/files')));

module.exports = router;