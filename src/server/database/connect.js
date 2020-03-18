const { Sequelize } = require('sequelize');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
require('dotenv-extended').load();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    // timezone: '+05:30',
    logging: msg => logger.database(msg)
});

module.exports = {
    sequelize
};