const { Sequelize } = require('sequelize');
const sequelize = require('../database/connect.js');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
const fs = require('fs');
const path = require('path');
const moviesJSONPath = path.join(cwd, '/src/data/movies.json');

const seq = new Sequelize('mysql://vijay:rudo@localhost/movies');
const queryInterface = seq.getQueryInterface();
let seed = (queryInterface, Sequelize) => {
    fs.readFile(moviesJSONPath, 'utf8', (err, data) => {
        if (err) {
            logger.error("Unable to read Json FIle");
        }
        else {
            data = JSON.parse(data);
            let directors = [];
            Array.from(new Set(data.map(movie => movie.Director))).map((director) => {
                let directorsObj = {};
                directorsObj.name = director;
                directors.push(directorsObj);
            });
            queryInterface.bulkInsert('directors', directors);
            queryInterface.bulkInsert('movies', data);
            seq
                .query('update movies,directors set movies.dir_id=directors.dir_id where movies.director=directors.name')
                .then(([results, metadata]) => {
                    console.log(results);
                    console.log(metadata);
                });
        }
    });

};
sequelize
    .authenticate()
    .then(() => {
        seed(queryInterface, Sequelize);
    })
    .catch((err) => {
        logger.error("Unable to seed data");
    });