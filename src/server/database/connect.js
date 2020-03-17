const { Sequelize } = require('sequelize');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
require('dotenv-extended').load();


const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    logging: false
});

let connect = () => {
    sequelize
        .authenticate()
        .then(() => {
            logger.info("connnected");
        })
        .catch((err) => {
            logger.error("Unable to connect to database");
        });
}

module.exports = {
    sequelize,
    connect
};