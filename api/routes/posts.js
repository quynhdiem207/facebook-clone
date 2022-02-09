const router = require('express').Router();

const AuthMiddeware = require('../middlewares/AuthMiddleware');

const {
    getPostController,
    createPostController,
    updatePostController,
    deletePostController,
    likePostController,
    getTimelinePostController
} = require('../controllers/Post');

router.get('/timeline', AuthMiddeware, getTimelinePostController);
router.put('/:_id/like', AuthMiddeware, likePostController);
router.delete('/:_id', AuthMiddeware, deletePostController);
router.put('/:_id', AuthMiddeware, updatePostController);
router.get('/:_id', getPostController);
router.post('/', AuthMiddeware, createPostController);

module.exports = router;