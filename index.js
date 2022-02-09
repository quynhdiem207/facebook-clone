const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');

const database = require('./api/libs/Database');
const routers = require('./api/routes');

// connect database
database.connect();

dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
}));

// routes
app.use('/api', routers);

app.listen(process.env.PORT || 8080, () => console.log('Server started!'));