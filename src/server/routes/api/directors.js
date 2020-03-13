const express = require('express');
const path = require('path');
const cwd = process.cwd();
const bodyParser = require('body-parser');
const query = require('../../database/query').query;
const router = express.Router();

let directors = () => {
    router.get('/', (request, response, next) => {
        query('select * from directors;')
            .then((res) => {
                response.json(res.rows);
            })
            .catch((err) => {
                next(err);
            })
    });
    router.post('/', (request, response, next) => {
        let data = request.body;
        data.forEach((director) => {
            let value = Object.values(director);
            query('insert into directors(name) values($1)', value)
                .then((res) => {
                    response.json(request.body);
                })
                .catch((err) => {
                    next(err);
                });
        });
    });

    router.get('/:directorId', (request, response, next) => {
        query('select * from directors where dir_id=$1', [request.params.directorId])
            .then((res) => {
                response.json(res.rows);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.put('/:directorId', (request, response, next) => {
        let data = request.body;
        let columns = Object.keys(data);
        let values = Object.values(data);
        let result = [];
        columns.forEach((column) => {
            result.push(column.concat("='").concat(data[column]).concat("'"));
        })
        result = result.join(",");
        query(`update directors set ${result} where dir_id = $1`, [request.params.directorId])
            .then((res) => {
                response.json(request.body);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.delete('/:directorId', (request, response, next) => {
        query('delete from directors where dir_id=$1;', [request.params.directorId])
            .then((res) => {
                response.send("Director with the id " + request.params.directorId + " is deleted");
            })
            .catch((err) => {
                next(err);
            });
    });

    router.use((err, req, res, next) => {
        console.error(err.stack.split("\n")[0]);
        res.send('Internal Server Error');
    });
    return router;
};

module.exports = directors;