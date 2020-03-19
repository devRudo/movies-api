const express = require('express');
const Joi = require('@hapi/joi');
const cwd = process.cwd();
const path = require('path');
const logger = require(cwd + '/config/logger');
const Movie = require(path.join(cwd, '/src/server/models/Movie'));

let movies = () => {
    const router = express.Router();
    router.get('/', (request, response, next) => {
        Movie
            .findAll()
            .then((movies) => {
                response.render('pages/movies', { title: "Movies Project || All movies", movies: movies });
            })
    });
    router.get('/:movieId', (request, response, next) => {
        Movie
            .findOne({
                where: {
                    rank: request.params.movieId
                }
            })
            .then((movie) => {
                response.render('pages/movie', { title: "Movies Project || Movie with given id", movie: movie });
            })
    });
    router.use((err, req, res, next) => {
        logger.error(err);
        if (Array.isArray(err)) {
            res.status(500).send('Internal Server Error');
        }
        else {
            res.status(500).send(err);
        }
    });
    return router;
}

module.exports = movies;