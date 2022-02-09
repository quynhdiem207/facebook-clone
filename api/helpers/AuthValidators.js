const { check } = require('express-validator');
const _ = require('lodash');

exports.registerValidator = [
    check('username')
        .notEmpty().withMessage('Username is required')
        .isString().withMessage('Username must be string')
        .isLength({ min: 3, max: 20 }).withMessage('Username must between 3 - 20 characters'),
    check('email')
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email must be string')
        .isEmail().withMessage('Email must be valid')
        .isLength({ max: 50 }).withMessage('Email must be less than 50 characters'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be string')
        .isLength({ min: 6 }).withMessage('Password must be more than 6 characters')
];

exports.loginValidator = [
    check('email')
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email must be string')
        .isEmail().withMessage('Email must be valid')
        .isLength({ max: 50 }).withMessage('Email must be less than 50 characters'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be string')
        .isLength({ min: 6 }).withMessage('Password must be more than 6 characters')
];

exports.forgetValidator = [
    check('email')
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email must be string')
        .isEmail().withMessage('Email must be valid')
        .isLength({ max: 50 }).withMessage('Email must be less than 50 characters')
];

exports.resetValidator = [
    check('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be string')
        .isLength({ min: 6 }).withMessage('Password must be more than 6 characters')
];