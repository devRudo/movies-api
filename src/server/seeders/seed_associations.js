const fs = require('fs');
const cwd = process.cwd();
const path = require('path');
const logger = require(path.join(cwd, '/config/logger.js'));
const { sequelize } = require(path.join(cwd, '/src/server/database/connect'));
module.exports = {
    up: async (query) => {
        sequelize
            .query('update movies,directors set movies.dir_id=directors.id where movies.director=directors.name');
    },
    down: async (query) => {

    }
}