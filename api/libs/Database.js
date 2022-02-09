const mongoose = require('mongoose');
const { MONGO_URL } = require('../config/database');

const connect = async () => {
    try {
        await mongoose.connect(MONGO_URL);

        console.log('Connect successfully!!!');
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = { connect }