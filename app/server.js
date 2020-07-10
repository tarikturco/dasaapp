const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use('/api', routes);

app.use((error, req, res, next) => {
  
  if (error.name == 'SequelizeValidationError') {
    res.status(400).send({ error: error.message });
  }
  next(error);
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));