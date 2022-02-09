const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

const User = require('../models/User');

// Config
const {
    JWT_SECRET,
    JWT_ACCOUNT_ACTIVATION,
    JWT_RESET_PASSWORD,
} = require('../config/auth');

const {
    MAIL_KEY,
    MAIL_FROM,
    CLIENT
} = require('../config/general');

sgMail.setApiKey(MAIL_KEY);

// @route   [POST] api/auth/register
// @desc    Regiter user
// @access  Public
exports.registerController = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json('Email is taken')
        }

        // Generate token
        const token = await jwt.sign(
            { username, email, password },
            JWT_ACCOUNT_ACTIVATION,
            { expiresIn: '15m' }
        );

        // Send mail
        const emailData = {
            from: MAIL_FROM,
            to: email,
            subject: 'Account activation link',
            html: `
                <h1>Please click to this link to active</h1>
                <p>${CLIENT}/users/activate/${token}</p>
                <hr />
                <p>This email contain sensitive info.</p>
                <p>${CLIENT}</p>
            `
        };

        await sgMail.send(emailData);

        return res.json(`Email has been sent to ${email}. Please check to active your account`);
    } catch (err) {
        return res.status(500).json('Sorry, something went wrong. Please try again');
    }
}

// @route   [POST] api/auth/active
// @desc    Active account
// @access  Public
exports.activeController = async (req, res) => {
    const { token } = req.body;

    try {
        await jwt.verify(
            token,
            JWT_ACCOUNT_ACTIVATION
        );

        const { username, email, password } = await jwt.decode(token);

        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const user = await new User({
                username,
                email,
                password: hashed
            });

            await user.save();

            return res.json('Register Successfully');
        } catch (err) {
            return res.status(500).json('Sorry, something went wrong. Please try again')
        }
    } catch (err) {
        return res.status(401).json('Invalid or Expired Token. Please sign up again');
    }
}

// @route   [POST] api/auth/login
// @desc    Login user
// @access  Public
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json('Not exist account with this email. Please sign up')
        }

        // Authenticate
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                error: 'Email and Password do not match'
            });
        }

        const { _id, username, isAdmin } = user;

        // Generate token
        const token = await jwt.sign(
            { _id, isAdmin },
            JWT_SECRET,
            { expiresIn: '7d' }, // token valid in 7 days , can set remember me in frontend for 30d
        )

        return res.json({
            token,
            user: { _id, username, email, isAdmin }
        });
    } catch (err) {
        return res.status(500).json('Sorry, something is wrong. Please try again');
    }
}

// @route   [POST] api/auth/login
// @desc    Forget password
// @access  Public
exports.forgetController = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            })
        }

        // Generate token
        const token = await jwt.sign(
            { _id: user._id },
            JWT_RESET_PASSWORD,
            { expiresIn: '10m' }
        )

        // Send mail
        const emailData = {
            from: MAIL_FROM,
            to: email,
            subject: 'Password reset link',
            html: `
                <h1>Please click to this link to reset your password</h1>
                <p>${CLIENT}/users/password/reset/${token}</p>
                <hr />
                <p>This email contain sensitive info.</p>
                <p>${CLIENT}</p>
            `
        }

        await sgMail.send(emailData);

        return res.json(`Email has been sent to ${email}. Please check mail to reset your password`)
    } catch (err) {
        return res.status(500).json('Sorry, something is wrong.Please try again');
    }
}

// @route   [POST] api/auth/login
// @desc    Reset password
// @access  Public
exports.resetController = async (req, res) => {
    const { password, token } = req.body;

    try {
        await jwt.verify(
            token,
            JWT_RESET_PASSWORD
        );

        const { _id } = await jwt.decode(token);

        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            await User.findByIdAndUpdate(
                _id,
                { password: hashed }
            );

            return res.json('Great! Now you can login with new password');
        } catch (err) {
            return res.status(500).json('Something went wrong. Please try again');
        }
    } catch (err) {
        return res.status(401).json('Invalid or Expired Token. Please choose "send email again" below');
    }
}