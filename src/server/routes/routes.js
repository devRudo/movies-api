module.exports = (app) => {
    app.get('/', (request, response, next) => {
        throw new Error();
    });
    app.use('/api/movies', require('./api/movies.js')());
    app.use('/api/directors', require('./api/directors.js')());
    app.use('*', (req, res, next) => {
        res.status(404).json({ err: "API Endpoint " + req.originalUrl + " does not exists" });
        next();
    });
    return app;
};