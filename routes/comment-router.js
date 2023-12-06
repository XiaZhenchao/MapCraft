/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
*/
const express = require('express')
const CommentController = require('../controllers/comment-controller')
const router = express.Router()

router.post('/comment', CommentController.createComment)
router.get('/comment/:id', CommentController.getCommentById)
router.get('/commentpairs',  CommentController.getCommentPairs)
router.put('/comment/:id',  CommentController.updateCommentById)
module.exports = router