const bodyParser = require('body-parser');
const express = require('express');

const routes = require('./routes');
const handleErrors = require('./lib/handleErrors');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use('/api', routes);

app.use(handleErrors.handleSequelizeErrors);
app.use(handleErrors.handleDasaErrors);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));