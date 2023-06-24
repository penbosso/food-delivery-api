const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const fs = require('fs');
const errorHandler = require('./middleware/error-handler');
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true, }));


app.use(morgan('combined', {
    stream: fs.createWriteStream('./logs/access.log', { flags: 'a' })
}));
app.use(morgan('combined'))
// api routes.
app.get('/', (req, res) => {
    res.send({ message: 'Food delivery API works!' });
});

app.use('/users', require('./router/user-router'));
app.use('/restaurants', require('./router/restaurant-router'));
app.use('/menu-items', require('./router/menu-item-router'));
app.use('/orders', require('./router/order-router'));
// for uploading restaurant and menu item images
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filename = req.file.filename;
    const originalname = req.file.originalname;
    const mimetype = req.file.mimetype;
    const size = req.file.size;
    res.json({ filename, originalname, mimetype, size });
  });

// error handler. 
app.use(errorHandler);

const port = (process.env.PORT || 4000);
app.listen(port, () => console.log('Server listening on port ' + port));

module.exports = app;