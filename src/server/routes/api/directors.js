const express = require('express');
const Joi = require('@hapi/joi');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
const Director = require(cwd + '/src/server/models/Director');


let directors = () => {
    const router = express.Router();
    router.get('/', (request, response, next) => {
        Director
            .findAll()
            .then((directors) => {
                response.json(directors);
            })
            .catch((err) => {
                next(err);
            });
    });
    router.post('/', (request, response, next) => {
        let data = request.body;
        const schema = Joi.object({
            name: Joi.string()
                .alphanum()
                .min(3)
                .required()
        });
        try {
            const value = schema.validate(data);
            if (value.error === undefined) {
                Director
                    .create(data)
                    .then((created) => {
                        response.json(created);
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

    router.get('/:directorId', (request, response, next) => {
        Director
            .findOne({
                where: {
                    id: request.params.directorId
                }
            })
            .then((director) => {
                response.json(director);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.put('/:directorId', (request, response, next) => {
        let data = request.body;
        const schema = Joi.object({
            name: Joi.string()
                .alphanum()
                .min(3)
                .required()
        });
        try {
            const value = schema.validate(data);
            if (value.error === undefined) {
                Director
                    .update(data, {
                        where: {
                            id: request.params.directorId
                        }
                    })
                    .then((updated) => {
                        response.json(updated);
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

    router.delete('/:directorId', (request, response, next) => {
        Director.destroy({
            where: {
                id: request.params.directorId
            }
        })
            .then((deleted) => {
                response.json(deleted);
            })
            .catch((err) => {
                next(err);
            });
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
};

module.exports = directors;