const Sequelize = require('sequelize');

module.exports = {
    up: async (query) => {
        await query.createTable('movies', {
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
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },
    down: async (query) => {
        await query.dropTable('movies');
    }
}