const Post = require('../models/Post');
const User = require('../models/User');

// @route   [POST] api/posts/
// @desc    Create a post
// @access  Private
exports.createPostController = async (req, res) => {
    const { _id: userId } = req.user;

    const post = new Post({ userId, ...req.body });

    try {
        await post.save();

        return res.json('Post created');
    } catch (err) {
        return res.status(500).json('Something went wrong. Please try again');
    }
}

// @route   [PUT] api/posts/:_id
// @desc    Update a post
// @access  Private
exports.updatePostController = async (req, res) => {
    const { _id } = req.params;
    const { _id: userId } = req.user;

    try {
        const post = await Post.findById(_id);

        if (post.userId.toString() === userId) {
            await post.updateOne({ $set: req.body });

            return res.json('Post updated');
        } else {
            return res.status(403).json('You can update your posts only');
        }
    } catch (err) {
        return res.status(500).json('Something went wrong. Please try again');
    }
}

// @route   [DELETE] api/posts/:_id
// @desc    Delete a post
// @access  Private
exports.deletePostController = async (req, res) => {
    const { _id } = req.params;
    const { _id: userId } = req.user;

    try {
        const post = await Post.findById(_id);

        if (post.userId.toString() === userId) {
            await post.deleteOne();

            return res.json('Post deleted');
        } else {
            return res.status(403).json('You can delete your posts only');
        }
    } catch (err) {
        return res.status(500).json('Something went wrong. Please try again');
    }
}

// @route   [PUT] api/posts/:_id/like
// @desc    Like or dislike a post
// @access  Private
exports.likePostController = async (req, res) => {
    const { _id } = req.params;
    const { _id: userId } = req.user;

    try {
        const post = await Post.findById(_id);

        if (!post.likes.includes(userId)) {
            await post.updateOne({
                $push: {
                    likes: userId
                }
            });

            return res.json('Post has been liked');
        } else {
            await post.updateOne({
                $pull: {
                    likes: userId
                }
            });

            return res.json('Post has been disliked');
        }
    } catch (err) {
        return res.status(500).json('Something went wrong. Please try again');
    }
}

// @route   [GET] api/posts/:_id
// @desc    Get a post
// @access  Public
exports.getPostController = async (req, res) => {
    const { _id } = req.params;

    try {
        const post = await Post.findById(_id);

        return res.json(post);
    } catch (err) {
        return res.status(500).json('Something went wrong. Please try again');
    }
}

// @route   [GET] api/posts/timeline
// @desc    Get timeline posts
// @access  Private
exports.getTimelinePostController = async (req, res) => {
    const { _id: userId } = req.user;

    try {
        const user = await User.findById(userId);
        const userPosts = await Post.find({ userId });
        const friendPosts = await Promise.all(
            user.followings.map(friend => Post.find({ userId: friend }))
        )

        return res.json(userPosts.concat(...friendPosts));
    } catch (err) {
        return res.status(500).json('Something went wrong. Please try again');
    }
}