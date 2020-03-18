const express = require('express');
const Joi = require('@hapi/joi');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
const Movie = require(cwd + '/src/server/models/Movie');
const Director = require(cwd + '/src/server/models/Director');

let movies = () => {
    const router = express.Router();
    router.get('/', (request, response, next) => {
        Movie.findAll()
            .then((movies) => {
                if (movies) {
                    response.json(movies);
                }
                else {
                    response.json("NO MOVIES in the DATABASE");
                }
            })
            .catch((err) => {
                next(err);
            });
    });
    router.post('/', (request, response, next) => {
        let data = request.body;
        let directorName = request.body.director;
        const schema = Joi.object({
            rank: Joi.number().integer().greater(0).required(),
            title: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3).required(),
            description: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3).required(),
            runtime: Joi.number().integer().required(),
            genre: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3).required(),
            rating: Joi.number().precision(2).required(),
            metascore: Joi.string().alphanum().required(),
            votes: Joi.string().alphanum().required(),
            gross_earning_in_mil: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).required(),
            director: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3).required(),
            actor: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3).required(),
            year: Joi.number().integer().required(),
        });
        try {
            const value = schema.validate(data);
            if (value.error === undefined) {
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
                                                    dir_id: director.id
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
                                                    dir_id: director.id
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
                        next(err);
                    });
            }
            else {
                response.status(400).send(value.error);
            }
        }
        catch (err) {
            next(err);
        }
    });

    router.get('/:movieId', (request, response, next) => {
        Movie
            .findOne({
                where: {
                    rank: request.params.movieId
                }
            })
            .then((movie) => {
                if (movie) {
                    response.json(movie);
                }
                else {
                    response.json("No movie with the given id exists");
                }
            })
            .catch((err) => {
                next(err);
            });
    });
    router.put('/:movieId', (request, response, next) => {
        let data = request.body;
        const schema = Joi.object({
            rank: Joi.number().integer().greater(0),
            title: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3),
            description: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3),
            runtime: Joi.number().integer(),
            genre: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3),
            rating: Joi.number().precision(2),
            metascore: Joi.string().alphanum(),
            votes: Joi.string().alphanum(),
            gross_earning_in_mil: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/),
            director: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3),
            actor: Joi.string().trim().pattern(/[a-zA-Z0-9\ ]+/).min(3),
            year: Joi.number().integer(),
        });
        try {
            const value = schema.validate(data);
            if (value.error === undefined) {
                Movie
                    .update(data, {
                        where: {
                            rank: request.params.movieId
                        }
                    })
                    .then((updated) => {
                        if (updated[0] > 0) {
                            response.json(updated);
                        }
                        else {
                            response.json("Nothing to updated");
                        }
                    })
                    .catch((err) => {
                        next(err);
                    })
            }
            else {
                response.status(400).send(value.error);
            }
        }
        catch (err) {
            next(err);
        }
    });

    router.delete('/:movieId', (request, response, next) => {
        Movie
            .destroy({
                where: {
                    rank: request.params.movieId
                }
            })
            .then((deleted) => {
                if (deleted) {
                    response.json(deleted);
                }
                else {
                    response.json('unable to delete the movie with given id because the movie doesn\'t exist');
                }
            })
            .catch((err) => {
                next(err);
            });
    })
    router.use((err, req, res, next) => {
        logger.error(err);
        if (Array.isArray(err)) {
            res.status(500).send('Internal Server Error');
        }
        else {
            res.status(500).send(err);
        }
    })
    return router;
}

module.exports = movies;