const cwd = process.cwd();
const Sequelize = require('sequelize');
const { sequelize } = require(cwd + '/src/server/database/connect');
let Director = sequelize.define('director', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'director'
});

module.exports = Director;