const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @route   [PUT] api/users/:_id
// @desc    Update user
// @access  Private
exports.updateUserController = async (req, res) => {
    const { _id } = req.params;
    const { _id: userId, isAdmin } = req.user;

    if (_id === userId || isAdmin) {
        const { newPassword, oldPassword, ...other } = req.body;

        try {
            const user = await User.findById(_id);

            if (newPassword) {
                if (!isAdmin) {
                    const isMatch = await bcrypt.compare(oldPassword, user.password);

                    if (!isMatch) {
                        return res.status(400).json('Old password incorrect, please try again');
                    }
                }

                const salt = await bcrypt.genSalt(10);
                other.password = await bcrypt.hash(newPassword, salt);
            }

            await user.updateOne({ $set: other });

            return res.json('Account has been update');
        } catch (err) {
            return res.status(500).json('Something went wrong. Please try again');
        }
    } else {
        return res.status(403).json('You can update your account only');
    }
}

// @route   [DELETE] api/users/:_id
// @desc    Update user
// @access  Private
exports.deleteUserController = async (req, res) => {
    const { _id } = req.params;
    const { _id: userId, isAdmin } = req.user;

    if (_id === userId || isAdmin) {
        try {
            await User.deleteOne({ _id });

            return res.json('Account has been deleted');
        } catch (err) {
            return res.status(500).json('Something went wrong. Please try again');
        }
    } else {
        return res.status(403).json('You can delete your account only');
    }
}

// @route   [GET] api/users/:_id
// @desc    Get a user
// @access  Public
exports.getUserController = async (req, res) => {
    const { _id } = req.params;

    try {
        const user = await User.findById(_id, "-password -createdAt -updatedAt").lean();

        return res.json(user);
    } catch (err) {
        return res.status(500).json('Something went wrong. Please try again');
    }
}

// @route   [PUT] api/users/:_id/follow
// @desc    Follow a user
// @access  Private
exports.followUserController = async (req, res) => {
    const { _id } = req.params;
    const { _id: userId } = req.user;

    if (_id !== userId) {
        try {
            const user = await User.findById(_id);

            if (!user.followers.includes(userId)) {
                const me = await User.findById(userId);

                await user.updateOne({ $push: { followers: userId } });
                await me.updateOne({ $push: { followings: _id } });

                return res.json('User has been followed');
            } else {
                return res.status(403).json('You already followed this user');
            }
        } catch (err) {
            return res.status(500).json('Something went wrong. Please try again');
        }
    } else {
        return res.status(403).json('You cant follow yourself');
    }
}

// @route   [PUT] api/users/:_id/follow
// @desc    Follow a user
// @access  Private
exports.unfollowUserController = async (req, res) => {
    const { _id } = req.params;
    const { _id: userId } = req.user;

    if (_id !== userId) {
        try {
            const user = await User.findById(_id);

            if (user.followers.includes(userId)) {
                const me = await User.findById(userId);

                await user.updateOne({ $pull: { followers: userId } });
                await me.updateOne({ $pull: { followings: _id } });

                return res.json('User has been unfollowed');
            } else {
                return res.status(403).json('You not follow this user');
            }
        } catch (err) {
            return res.status(500).json('Something went wrong. Please try again');
        }
    } else {
        return res.status(403).json('You cant unfollow yourself');
    }
}