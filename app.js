const express = require('express');
const apiRouter = require('./worker/api');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('www'));
app.use(apiRouter);

app.listen(config.port || 3000, function() {
  console.log('server is listening at http://localhost:' + config.port);
})