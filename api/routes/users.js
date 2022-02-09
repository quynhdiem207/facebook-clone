const router = require('express').Router();

const AuthMiddleware = require('../middlewares/AuthMiddleware');

const {
    updateUserController,
    deleteUserController,
    getUserController,
    followUserController,
    unfollowUserController
} = require('../controllers/User');

router.put('/:_id/unfollow', AuthMiddleware, unfollowUserController);
router.put('/:_id/follow', AuthMiddleware, followUserController);
router.put('/:_id', AuthMiddleware, updateUserController);
router.delete('/:_id', AuthMiddleware, deleteUserController);
router.get('/:_id', getUserController);

module.exports = router;