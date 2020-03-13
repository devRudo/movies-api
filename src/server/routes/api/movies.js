const express = require('express');
const query = require('../../database/query').query;

let movies = () => {
    const router = express.Router();
    router.get('/', (request, response, next) => {
        query('select * from movies')
            .then((res) => {
                response.json(res.rows);
            })
            .catch((err) => {
                next(err);
            });
    });
    router.post('/', (request, response, next) => {
        let data = request.body;
        let directorName = request.body.director;
        let values = Object.values(data);
        query(`select dir_id from directors where name='${directorName}';`)
            .then((res) => {
                if (res.rows.length === 0) {
                    query('insert into directors(name) values($1)', [directorName])
                        .then(() => {
                            query(`select dir_id from directors where name='${directorName}';`)
                                .then((res) => {
                                    values.push(res.rows[0].dir_id);
                                })
                                .then()
                                .catch((err) => {
                                    next(err);
                                })
                        })
                        .catch((err) => {
                            next(err);
                        });
                    query('insert into movies values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)', values)
                        .then((res) => {
                            response.json(res.rows);
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
                else {
                    query(`select dir_id from directors where name='${directorName}';`)
                        .then((res) => {
                            values.push(res.rows[0].dir_id);
                            query(`insert into movies values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, values)
                                .then(() => {
                                    response.send("Operation Successfull");
                                })
                                .catch((err) => {
                                    next(err);
                                });
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
            })
            .catch((err) => {
                next(err);
            });
    })

    router.get('/:movieId', (request, response, next) => {
        query('select * from movies where rank=$1', [request.params.movieId])
            .then((res) => {
                response.json(res.rows);
            })
            .catch((err) => {
                next(err);
            });
    })
    router.put('/:movieId', (request, response, next) => {
        let data = request.body;
        let columns = Object.keys(data);
        let result = [];
        columns.forEach((column) => {
            result.push(column.concat("='").concat(data[column]).concat("'"));
        })
        result = result.join(",");

        query(`update movies set ${result} where rank = $1`, [request.params.movieId])
            .then((res) => {
                response.json(res.rows);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.delete('/:movieId', (request, response, next) => {
        query('delete from movies where rank=$1;', [request.params.movieId])
            .then((res) => {
                response.json(res.rows);
            })
            .catch((err) => {
                next(err);
            });
    })
    router.use((err, req, res, next) => {
        console.error(err.stack.split("\n")[0]);
        res.status(500).send('Internal Server Error');
    })
    return router;
}

module.exports = movies;