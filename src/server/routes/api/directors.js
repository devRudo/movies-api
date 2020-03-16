const express = require('express');
const { DataTypes } = require('sequelize');
const cwd = process.cwd();
const logger = require(cwd + '/config/logger');
const Movie = require(cwd + '/src/server/models/Movie');
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
        Director
            .create(data)
            .then((created) => {
                response.json(created);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.get('/:directorId', (request, response, next) => {
        Director
            .findOne({
                where: {
                    dir_id: request.params.directorId
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
        Director
            .update(data, {
                where: {
                    dir_id: request.params.directorId
                }
            })
            .then((updated) => {
                response.json(updated);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.delete('/:directorId', (request, response, next) => {
        Director.destroy({
            where: {
                dir_id: request.params.directorId
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
        logger.error(err.stack.split("\n")[0]);
        res.send('Internal Server Error');
    });
    return router;
};

module.exports = directors;