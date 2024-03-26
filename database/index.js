const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

let db_conn = null

function createConnection() {
    try {
        return new Sequelize({
            dialect: process.env.DB_DIALECT,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST
        });
    } catch (error) {
        return error;
    }
}

module.exports = db_conn = db_conn !== null ? db_conn : createConnection();
