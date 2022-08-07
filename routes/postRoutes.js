const express = require('express');
const path = require('path');
const router = express.Router();
const {allPosts, getSinglePost, createPost, updatePost, deletePost} = require('../controller/postController');
const {checkAuth} = require('../middleware/checkAuth');

router.get('/feeds', checkAuth ,allPosts);
router.get('/post/:id',checkAuth, getSinglePost)
router.post('/new_post',checkAuth, createPost);
router.put('/post/:id',checkAuth, updatePost);
router.delete('/post/:id',checkAuth, deletePost);
router.use('/files', checkAuth, express.static(path.join(process.cwd(),'/files')));

module.exports = router;