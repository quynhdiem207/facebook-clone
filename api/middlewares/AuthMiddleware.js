const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');

const auth = async (req, res, next) => {
    const bearerToken = req.get('Authorization');

    if (!bearerToken) {
        return res.status(401).json({
            message: 'Authorization dinied'
        });
    }

    try {
        const token = bearerToken.split(' ')[1];

        await jwt.verify(token, JWT_SECRET);
        req.user = await jwt.decode(token);

        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Authorization dinied'
        })
    }
}

module.exports = auth;