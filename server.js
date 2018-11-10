const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const config = require('./config/config.json');
const port = config.development.port;

const apiRoutes = require('./controller/api.controller');

const corsOptions = {
    origin: 'http://localhost:4200',
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/api', apiRoutes);
app.listen(port, () => console.log('Server started on port 3000'));