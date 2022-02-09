const { validationResult } = require('express-validator');

exports.validateMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const allErrors = errors.array().map(err => err.msg);

        return res.status(422).json({
            errors: allErrors
        })
    } else {
        next();
    }
}