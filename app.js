const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const fs = require('fs');
const userController = require('./controller/userController');
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true, }));
app.use(morgan('combined', {
    stream: fs.createWriteStream('./logs/access.log', {flags: 'a'})
}));
app.use(morgan('combined'));

// api routes.
app.get('/', (req, res) => {
  res.send({ title: 'Food delivery API works!'});
});

app.use('/register', userController.createUser);
app.use('/users', userController.getAllUsers);

const port = (process.env.PORT || 4000);
app.listen(port, () => console.log('Server listening on port ' + port));
