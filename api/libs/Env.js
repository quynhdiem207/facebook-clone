const env = require('dotenv').config().parsed;

module.exports = {
    getAll() {
        return env;
    },
    get(key, defaultValue) {
        return env[key] || defaultValue;
    }
}