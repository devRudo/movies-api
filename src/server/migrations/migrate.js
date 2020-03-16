const { Sequelize } = require('sequelize');
const sequelize = require('../database/connect.js');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');


let createDB = async (sequelize) => {
    try {
        const Director = await sequelize.define('director', {
            dir_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING
            }
        }, {
            sequelize,
            modelName: 'director',
            timestamps: false
        });
        const Movie = await sequelize.define('movie', {
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
            }
        }, {
            sequelize,
            modelName: 'movie',
            timestamps: false
        });
        Director.hasMany(Movie, {
            foreignKey: { name: 'dir_id' },
            onDelete: 'CASCADE'
        });
        sequelize
            .sync({ force: true });
    }
    catch (err) {
        logger.error("Unable to sync models with the database");
    }
}

sequelize
    .authenticate()
    .then(() => {
        createDB(sequelize);
    })
    .catch(() => {
        logger.error("Unable to connect to the database")
    })