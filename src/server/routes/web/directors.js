const express = require('express');
const Joi = require('@hapi/joi');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
const path = require('path');
const Director = require(path.join(cwd, '/src/server/models/Director'));

let directors = () => {
    const router = express.Router();
    router.get('/', (request, response, next) => {
        Director
            .findAll()
            .then((directors) => {
                response.render('pages/directors', { title: "Movies Project || All directors", directors: directors });
            })
    });
    router.get('/:directorId', (request, response, next) => {
        Director
            .findOne({
                where: {
                    id: request.params.directorId
                }
            })
            .then((director) => {
                response.render('pages/director', { title: "Movies Project || Director with given id", director: director });
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
    })
    return router;
}

module.exports = directors;