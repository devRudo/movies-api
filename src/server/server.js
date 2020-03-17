const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
const ejs = require('ejs');
const app = express();
const port = 3000;

const viewsDirectory = path.join(cwd, '/src/server/views');

// Serving static files
app.use('/', express.static(path.join(cwd, '/src/public')));
app.set('views', viewsDirectory);
app.set('view engine', 'ejs');
app.use(bodyParser.json());


const router = require('./routes/routes.js')(app);

router.listen(port, () => logger.info(`API server running on port ${port}`));