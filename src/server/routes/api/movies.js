const express = require('express');
const { DataTypes } = require('sequelize');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
const Movie = require(cwd + '/src/server/models/Movie');
const Director = require(cwd + '/src/server/models/Director');

let movies = () => {
    const router = express.Router();
    router.get('/', (request, response, next) => {
        Movie.findAll()
            .then((movies) => {
                response.json(movies);
            })
            .catch((err) => {
                next(err);
            });
    });
    router.post('/', (request, response, next) => {
        let data = request.body;
        let directorName = request.body.director;
        Director
            .findAndCountAll({
                where: {
                    name: directorName
                }
            })
            .then((director) => {
                if (director.count === 0) {
                    Director
                        .create({
                            name: directorName
                        })
                        .then((director) => {
                            Movie
                                .create(data)
                                .then((created) => {
                                    Movie
                                        .update({
                                            dir_id: director.dir_id
                                        }, {
                                            where: {
                                                director: created.director
                                            }
                                        })
                                        .then((updated) => {
                                            response.json(updated);
                                        })
                                        .catch((err) => {
                                            next(err);
                                        });
                                })
                                .catch((err) => {
                                    next(err);
                                })
                        })
                        .catch((err) => {
                            next(err);
                        })
                }
                else {
                    Movie
                        .create(data)
                        .then((created) => {
                            Director
                                .findOne({
                                    where: {
                                        name: created.director
                                    }
                                })
                                .then((director) => {
                                    Movie
                                        .update({
                                            dir_id: director.dir_id
                                        }, {
                                            where: {
                                                rank: created.rank
                                            }
                                        })
                                        .then((updated) => {
                                            response.json(updated);
                                        })
                                        .catch((err) => {
                                            next(err);
                                        })
                                })

                        });
                }
            })
            .catch((err) => {

            });
    });

    router.get('/:movieId', (request, response, next) => {
        Movie
            .findOne({
                where: {
                    rank: request.params.movieId
                }
            })
            .then((movie) => {
                response.json(movie);
            })
            .catch((err) => {
                next(err);
            });
    });
    router.put('/:movieId', (request, response, next) => {
        let data = request.body;
        Movie
            .update(data, {
                where: {
                    rank: request.params.movieId
                }
            })
            .then((updated) => {
                response.json(updated);
            })
    });

    router.delete('/:movieId', (request, response, next) => {
        Movie
            .destroy({
                where: {
                    rank: request.params.movieId
                }
            })
            .then((deleted) => {
                response.json(deleted);
            })
            .catch((err) => {
                next(err);
            });
    })
    router.use((err, req, res, next) => {
        logger.error(err.stack.split("\n")[0]);
        res.status(500).send(err.stack);
    })
    return router;
}

module.exports = movies;