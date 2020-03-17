const path = require('path');
const cwd = process.cwd();
const Umzug = require('umzug');
const logger = require(cwd + '/config/logger');
const { sequelize } = require(path.join(cwd, '/src/server/database/connect.js'));

let param = process.argv[process.argv.length - 1];

const umzug = new Umzug({
    migrations: {
        // indicates the folder containing the migration .js files
        path: path.join(cwd, '/src/server/seeders'),
        pattern: /^\w+[\_]+\w+\.js$/,
        params: [
            // inject sequelize's QueryInterface in the migrations
            sequelize.getQueryInterface()
        ]
    },
    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize
    }
});

; (async () => {
    // checks migrations and run them if they are not already applied
    if (param === 'do') {
        await umzug.up('seed_directors_table.js')
            .then(() => {
                logger.info('Director table seeded with initial data');
            })
            .catch((err) => {
                console.log(err);
                logger.error('Error while populating Directors table');
            });
        await umzug.up('seed_movies_table.js')
            .then(() => {
                logger.info('Movies table seeded with initial data');
            })
            .catch((err) => {
                console.log(err);
                logger.error('Error while populating Movies table');
            });
        await umzug.up('seed_associations.js')
            .then(() => {
                logger.info('Associations seeded successfully');
            })
            .catch((err) => {
                console.log(err);
                logger.error('Error while populating associations');
            });
    }
    else if (param === 'undo') {
        await umzug.down('seed_associations.js')
            .then(() => {
                logger.info('Associations deleted successfully');
            })
            .catch((err) => {
                console.log(err);
                logger.error('Error while deleting data from associations');
            });
        await umzug.down('seed_directors_table.js')
            .then(() => {
                logger.info('Deleted all the initial data from directors table');
            })
            .catch((err) => {
                console.log(err);
                logger.error('Error while deleting data from Directors table');
            });
        await umzug.down('seed_movies_table.js')
            .then(() => {
                logger.info('Deleted all the initial data from Movies table');
            })
            .catch((err) => {
                console.log(err);
                logger.error('Error while deleting data from Movies table');
            });
    }
})();