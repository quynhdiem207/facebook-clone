const router = require('express').Router();

// Load all controllers
const {
    registerController,
    activeController,
    loginController,
    forgetController,
    resetController
} = require('../controllers/Auth');

// Load all validators
const {
    registerValidator,
    loginValidator,
    forgetValidator,
    resetValidator
} = require('../helpers/AuthValidators');

const { validateMiddleware } = require('../helpers/Validator');

router.post(
    '/register',
    registerValidator,
    validateMiddleware,
    registerController
);

router.post(
    '/active',
    activeController
);

router.post(
    '/login',
    loginValidator,
    validateMiddleware,
    loginController
);

router.post(
    '/forget',
    forgetValidator,
    validateMiddleware,
    forgetController
);

router.post(
    '/reset',
    resetValidator,
    validateMiddleware,
    resetController
);

module.exports = router;