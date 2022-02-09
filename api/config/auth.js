const Env = require('../libs/Env');

module.exports = {
    JWT_SECRET: Env.get('JWT_SECRET'),
    JWT_ACCOUNT_ACTIVATION: Env.get('JWT_ACCOUNT_ACTIVATION'),
    JWT_RESET_PASSWORD: Env.get('JWT_RESET_PASSWORD')
}