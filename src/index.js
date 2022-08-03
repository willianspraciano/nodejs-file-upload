require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const routes = require('./app/routes');
const swaggerDocs = require('./swagger.json');
const { response } = require('express');

const app = express();

/**
 * Database setup
 */

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(routes);

app.use('/', (request, response) => {
  return response.json({ status: 'Server running!' });
});

app.listen(process.env.APP_PORT || 3333);
