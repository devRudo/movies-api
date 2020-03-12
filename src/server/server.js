const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cwd = process.cwd();
// for automatically fetching environment variables from .env file
require('dotenv').config({ path: path.join(cwd, '/config.js') });
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool();

// Serving static files
app.use('/', express.static(path.join(cwd, '/src/public')));
app.use(bodyParser.json());

// Home Route
app.get('/', (request, response) => {
    throw new Error();
});

// Routes for movies
app.get('/api/movies', (request, response, next) => {
    pool
        .connect()
        .then((client) => {
            console.log("Conected Successfully");
            client.query('select * from movies')
                .then((res) => {
                    response.json(res.rows);
                })
                .catch((err) => {
                    next(err);
                })
                .finally(() => {
                    client.release();
                    console.log(`Disconnected Successfully`);
                });
        })
        .catch((err) => {
            next(err);
        });

});
app.post('/api/movies', (request, response, next) => {
    let data = request.body;
    let directorName = request.body.director;
    let values = Object.values(data);
    pool
        .connect()
        .then((client) => {
            client
                .query(`select dir_id from directors where name='${directorName}';`)
                .then((res) => {
                    if (res.rows.length === 0) {
                        client
                            .query('insert into directors(name) values($1)', [directorName])
                            .then(() => {
                                pool
                                    .connect()
                                    .then((client) => {
                                        client
                                            .query(`select dir_id from directors where name='${directorName}';`)
                                            .then((res) => {
                                                values.push(res.rows[0].dir_id);
                                            })
                                            .catch((err) => {
                                                next(err);
                                            });
                                    })
                                    .catch((err) => {
                                        next(err);
                                    });
                            })
                            .catch((err) => {
                                next(err);
                            });
                        client.query('insert into movies values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)', values)
                            .then((res) => {
                                response.json(res.rows);
                            })
                            .catch((err) => {
                                next(err);
                            });
                    }
                    else {
                        client
                            .query(`select dir_id from directors where name='${directorName}';`)
                            .then((res) => {
                                values.push(res.rows[0].dir_id);
                                client
                                    .query(`insert into movies values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, values)
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
                })
                .finally(() => {
                    client.release();
                });
        });
})

app.get('/api/movies/:movieId', (request, response, next) => {
    pool
        .connect()
        .then((client) => {
            console.log("Conected Successfully");
            client.query('select * from movies where rank=$1', [request.params.movieId])
                .then((res) => {
                    response.json(res.rows);
                })
                .catch((err) => {
                    next(err);
                })
                .finally(() => {
                    client.release();
                    console.log(`Disconnected Successfully`);
                });
        })
        .catch((err) => {
            next(err);
        });
})
app.put('/api/movies/:movieId', (request, response, next) => {
    let data = request.body;
    let columns = Object.keys(data);
    let result = [];
    columns.forEach((column) => {
        result.push(column.concat("='").concat(data[column]).concat("'"));
    })
    result = result.join(",");
    pool
        .connect()
        .then((client) => {
            console.log("Conected Successfully");
            client.query(`update movies set ${result} where rank = $1`, [request.params.movieId])
                .then((res) => {
                    response.json(res.rows);
                })
                .catch((err) => {
                    next(err);
                })
                .finally(() => {
                    client.release();
                    console.log(`Disconnected Successfully`);
                });
        })
        .catch((err) => {
            next(err);
        });
})
app.delete('/api/movies/:movieId', (request, response, next) => {
    pool
        .connect()
        .then((client) => {
            console.log("Conected Successfully");
            client.query('delete from movies where rank=$1;', [request.params.movieId])
                .then((res) => {
                    response.json(res.rows);
                })
                .catch((err) => {
                    next(err);
                })
                .finally(() => {
                    client.release();
                    console.log(`Disconnected Successfully`);
                });
        })
        .catch((err) => {
            next(err);
        });
})

// Routes for directors
app.get('/api/directors', (request, response, next) => {
    pool
        .connect()
        .then((client) => {
            console.log("Conected Successfully");
            client.query('select * from directors;')
                .then((res) => {
                    response.json(res.rows);
                })
                .catch((err) => {
                    next(err);
                })
                .finally(() => {
                    client.release();
                    console.log(`Disconnected Successfully`);
                });
        })
        .catch((err) => {
            next(err);
        });
})
app.post('/api/directors', (request, response, next) => {
    let data = request.body;
    data.forEach((director) => {
        let value = Object.values(director);
        console.log(value);
        pool
            .connect()
            .then((client) => {
                console.log("Conected Successfully");
                client.query('insert into directors(name) values($1)', value)
                    .then((res) => {
                        response.status(200).send("Data inserted Successfully");
                        response.json(res.rows);
                    })
                    .catch((err) => {
                        next(err);
                    })
                    .finally(() => {
                        client.release();
                        console.log(`Disconnected Successfully`);
                    });
            })
            .catch((err) => {
                next(err);
            });
    });
})

app.get('/api/directors/:directorId', (request, response, next) => {
    pool
        .connect()
        .then((client) => {
            console.log("Conected Successfully");
            client.query('select * from directors where dir_id=$1', [request.params.directorId])
                .then((res) => {
                    response.json(res.rows);
                })
                .catch((err) => {
                    next(err);
                })
                .finally(() => {
                    client.release();
                    console.log(`Disconnected Successfully`);
                });
        })
        .catch((err) => {
            next(err);
        });
})
app.put('/api/directors/:directorId', (request, response, next) => {
    let data = request.body;
    let columns = Object.keys(data);
    let values = Object.values(data);
    let result = [];
    columns.forEach((column) => {
        result.push(column.concat("='").concat(data[column]).concat("'"));
    })
    result = result.join(",");
    pool
        .connect()
        .then((client) => {
            console.log("Conected Successfully");
            client.query(`update directors set ${result} where dir_id = $1`, [request.params.directorId])
                .then((res) => {
                    response.json(res.rows);
                })
                .catch((err) => {
                    next(err);
                })
                .finally(() => {
                    client.release();
                    console.log(`Disconnected Successfully`);
                });
        })
        .catch((err) => {
            next(err);
        });
})
app.delete('/api/directors/:directorId', (request, response, next) => {
    pool
        .connect()
        .then((client) => {
            console.log("Conected Successfully");
            client.query('delete from directors where dir_id=$1;', [request.params.directorId])
                .then((res) => {
                    response.json(res.rows);
                })
                .catch((err) => {
                    next(err);
                })
                .finally(() => {
                    client.release();
                    console.log(`Disconnected Successfully`);
                });
        })
        .catch((err) => {
            next(err);
        });
})

app.use((err, req, res, next) => {
    console.error(err.stack.split("\n")[0]);
    res.status(500).send('Internal Server Error');
})

app.listen(port, () => console.log(`API server running on port ${port}`));