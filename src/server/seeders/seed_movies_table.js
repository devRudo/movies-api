const fs = require('fs');
const cwd = process.cwd();
const path = require('path');
const logger = require(path.join(cwd, '/config/logger.js'));
const moviesJSONPath = path.join(cwd, '/src/data/movies.json');

let readMovies = async (moviesJSONPath) => {
    let movies = await fs.readFileSync(moviesJSONPath, 'utf8', (err, data) => {
        if (err) {
            logger.error("Unable to read Json FIle");
            throw err;
        }
    });
    return movies;
}

module.exports = {
    up: async (query) => {
        readMovies(moviesJSONPath)
            .then((movies) => {
                movies = JSON.parse(movies);
                movies.forEach((movie) => {
                    movie.createdAt = new Date();
                    movie.updatedAt = new Date();
                });
                query.bulkInsert('movies', movies);
            })
            .catch((err) => {
                logger.error('unable to find json file');
            });
    },
    down: async (query) => {
        query.bulkDelete('movies', {}, {
        })
    }
}
