const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cwd = process.cwd();
const app = express();
const port = 3000;


// Serving static files
app.use('/', express.static(path.join(cwd, '/src/public')));
app.use(bodyParser.json());

const router = require('./routes/routes.js')(app);

router.listen(port, () => console.log(`API server running on port ${port}`));