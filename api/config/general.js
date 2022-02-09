const Env = require('../libs/Env');

module.exports = {
    PORT: Env.get('PORT'),
    CLIENT: Env.get('CLIENT'),
    MAIL_KEY: Env.get('MAIL_KEY'),
    MAIL_FROM: Env.get('MAIL_FROM')
}