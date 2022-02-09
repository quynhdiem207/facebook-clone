const router = require('express').Router();

const postRouter = require('./posts');
const userRouter = require('./users');
const authRouter = require('./auth');

router.use('/posts', postRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;