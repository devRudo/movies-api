const cwd = process.cwd();
const Sequelize = require('sequelize');
const sequelize = require(cwd + '/src/server/database/connect');
let Director = sequelize.define('director', {
    dir_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    }
}, {
    sequelize,
    modelName: 'director'
});

module.exports = Director;