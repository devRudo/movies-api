const { Sequelize } = require('sequelize');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');

const sequelize = new Sequelize('mysql://vijay:rudo@localhost/movies', {
    logging: false
});

module.exports = sequelize;