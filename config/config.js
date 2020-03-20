require('dotenv-extended').load();
module.exports = {
    mysql: {
        url: process.env.DATABASE_URL,
        database: process.env.MYSQL_DATABASE,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD
    },
    port: process.env.PORT || 3000
};