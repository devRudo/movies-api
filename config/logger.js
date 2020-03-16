const winston = require('winston');
const levels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    },
    colors: {
        error: 'red',
        warn: 'brown',
        info: 'green',
        debug: 'blue'
    }
};

const formatter = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    levels: levels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        formatter,
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log', level: 'info' }),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ]
});

module.exports = logger;
