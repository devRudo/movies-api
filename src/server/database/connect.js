const { Sequelize } = require('sequelize');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
const config = require(cwd + '/config/config');
let options = {};
if (config.NODE_ENV !== 'production') {
    options.overrideProcessEnv = true
    require('dotenv-extended').load(options);
}

const sequelize = new Sequelize(config.mysql.url, {
    dialect: 'mysql',
    logging: msg => logger.database(msg)
});

module.exports = {
    sequelize
};