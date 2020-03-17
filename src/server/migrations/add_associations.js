const Sequelize = require('sequelize');

module.exports = {
    up: async (query) => {
        await query.addColumn('movies', 'dir_id', {
            after: 'year',
            type: Sequelize.INTEGER,
            references: {
                model: 'directors',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },
    down: async (query) => {
        await query.removeColumn('movies', 'dir_id');
    }
}