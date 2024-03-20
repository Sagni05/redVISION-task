const { Sequelize } = require("sequelize");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require("./config");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    logging: false,
    dialect: "mysql"
});

async function connect() {
    try {
        await sequelize.authenticate();
        console.log("Connection established with the database");
    } catch (e) {
        console.error("Unable to connect to the database:", e);
    }
}

connect();

module.exports = sequelize;
