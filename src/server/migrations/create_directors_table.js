const Sequelize = require('sequelize');

module.exports = {
    up: async (query) => {
        await query.createTable('directors', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING
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
        await query.dropTable('directors');
    }
}