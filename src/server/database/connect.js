const path = require('path');
const cwd = process.cwd();
const { Client } = require('pg');
// for automatically fetching environment variables from .env file
require('dotenv').config({ path: path.join(cwd, '/config.js') });

let client = new Client();

// function for connecting to database
let dbconnect = () => {
    client.connect()
        .then(() => {
            console.log("Connected Successfully");
        })
        .catch((err) => {
            console.log(err.stack.split("\n")[0].split(":")[1]);
        });
};
dbconnect();
module.exports.all;
