const path = require('path');
const cwd = process.cwd();
const Umzug = require('umzug');
const logger = require(cwd + '/config/logger');
const { sequelize } = require(path.join(cwd, '/src/server/database/connect.js'));

let param = process.argv[process.argv.length - 1];

const umzug = new Umzug({
    migrations: {
        // indicates the folder containing the migration .js files
        path: path.join(cwd, '/src/server/migrations'),
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
        await umzug.up('create_movies_table.js')
            .then(() => {
                logger.info('movies table migrated');
            })
            .catch((err) => {
                logger.error('movies table not migrated');
            });
        await umzug.up('create_directors_table.js')
            .then(() => {
                logger.info('directors table migrated');
            })
            .catch((err) => {
                logger.error('directors table not migrated');
            });
        await umzug.up('add_associations.js')
            .then(() => {
                logger.info('associations done');
            })
            .catch((err) => {
                logger.error("Error while migrating the associations");
            });
    }
    else if (param === 'undo') {
        await umzug.down('add_associations.js')
            .then(() => {
                logger.info('associations undone');
            })
            .catch((err) => {
                logger.error('error while undoing associations');
            });
        await umzug.down('create_movies_table.js')
            .then(() => {
                logger.info('movies migration undone');
            })
            .catch((err) => {
                logger.error('error undoing movies migration');
            });
        await umzug.down('create_directors_table.js')
            .then(() => {
                logger.info('directors migrations undone');
            })
            .catch((err) => {
                logger.error('error undoing directions migration');
            });
    }
})();