const cwd = process.cwd();
const Sequelize = require('sequelize');
const { sequelize } = require(cwd + '/src/server/database/connect');
let Movie = sequelize.define('movie', {
    rank: {
        type: Sequelize.INTEGER(10),
        allownull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    runtime: {
        type: Sequelize.INTEGER
    },
    genre: {
        type: Sequelize.STRING
    },
    rating: {
        type: Sequelize.REAL
    },
    metascore: {
        type: Sequelize.STRING
    },
    votes: {
        type: Sequelize.STRING
    },
    gross_earning_in_mil: {
        type: Sequelize.STRING
    },
    director: {
        type: Sequelize.STRING
    },
    actor: {
        type: Sequelize.STRING
    },
    year: {
        type: Sequelize.INTEGER
    },
    dir_id: {
        type: Sequelize.INTEGER
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
    modelName: 'movie'
});

module.exports = Movie;