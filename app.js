const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const fs = require('fs');
const errorHandler = require('./middleware/error-handler');


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
  res.send({ message: 'Food delivery API works!'});
});

app.use('/users', require('./router/user-router'));
app.use('/restaurants', require('./router/restaurant-router'));
app.use('/menu-items', require('./router/menu-item-router'));
app.use('/orders', require('./router/order-router'));

// error handler. 
app.use(errorHandler);

const port = (process.env.PORT || 4000);
app.listen(port, () => console.log('Server listening on port ' + port));
