const path = require('path');
const cwd = process.cwd();
// for automatically fetching environment variables from .env file
require('dotenv').config({ path: path.join(cwd, '/config.js') });
const { Pool } = require('pg');
const pool = new Pool();

module.exports = { pool };