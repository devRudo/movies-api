const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(cwd, '/config.js') });
const moviesJSONFilePath = path.join(cwd + '/src/data/movies.json');

const pool = new Pool();

let readMoviesJSON = new Promise((resolve, reject) => {
    fs.readFile(moviesJSONFilePath, 'utf8', (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});

let populateData = (moviesJSON) => {
    let createMoiveTableQuery = 'create table IF NOT EXISTS movies(Rank integer PRIMARY KEY, Title character varying(255), Description text, Runtime integer, Genre character varying(255), Rating real, Metascore varchar(255), Votes integer, Gross_Earning_in_Mil varchar(255), Director character varying(255), Actor character varying(255), Year integer, dir_id integer references directors(dir_id) on delete cascade) ;';
    let createDirectorTableQuery = 'create table if not exists directors(dir_id serial primary key, name varchar(255));';
    pool
        .connect()
        .then((client) => {
            client
                .query(createDirectorTableQuery)
                .then(() => {
                    let directors = Array.from(new Set(moviesJSON.map(movie => movie.Director)));
                    directors.forEach((director, index) => {
                        pool
                            .connect()
                            .then((client) => {
                                client
                                    .query('insert into directors(name) values($1)', [director])
                                    .then(() => {
                                        console.log(index + 1 + " " + director + " inserted");
                                    })
                                    .catch((err) => {
                                        console.error("Unable to insert " + director + " into the directors table");
                                        console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
                                    })
                                    .finally(() => {
                                        client.release();
                                    })
                            })
                            .catch((err) => {
                                console.error("Failed Connecting to database");
                                console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
                            });
                    })
                })
                .catch((err) => {
                    console.error("Unable to create directors table");
                    console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
                })
            client
                .query(createMoiveTableQuery)
                .then(() => {
                    moviesJSON.forEach((movie, index) => {
                        let values = Object.values(movie);
                        let director = movie.Director;
                        pool
                            .connect()
                            .then((client) => {
                                client
                                    .query(`select dir_id from directors where name='${director}'`)
                                    .then((res) => {
                                        values.push(res.rows[0].dir_id);
                                        pool
                                            .connect()
                                            .then((client) => {
                                                client
                                                    .query("insert into movies values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, $13)", values)
                                                    .then(() => {
                                                        console.log(index + 1 + " " + movie.Title + " inserted successfully");
                                                    })
                                                    .catch((err) => {
                                                        console.error("Query Syntax error while insertin into movies");
                                                        console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
                                                    })
                                                    .finally(() => {
                                                        client.release();
                                                    });
                                            })
                                            .catch((err) => {
                                                console.error("Unable to connect to database");
                                                console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
                                            });
                                    })
                                    .catch((err) => {
                                        console.error("Query Syntax error");
                                        console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
                                    })
                                    .finally(() => {
                                        client.release();
                                    })
                            })
                            .catch((err) => {
                                console.error("Unable to insert Movies data");
                                console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
                            });
                    })
                })
                .catch((err) => {
                    console.error("Unable to create Movies table");
                    console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
                })
                .finally(() => {
                    client.release();
                });
        })
        .catch((err) => {
            console.error("Failed Connecting to database");
            console.error("Error Code : " + err.code + " " + err.stack.split("\n")[0]);
        });
}

readMoviesJSON
    .then((moviesData) => {
        let moviesObj = JSON.parse(moviesData);
        populateData(moviesObj);
    })
    .catch((err) => {
        if (err.code === 'ENOENT') {
            console.error("Movies JSON data not found");
            console.error("Check the path: " + err.path);
        }
    });