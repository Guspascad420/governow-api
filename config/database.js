const Sequelize = require("sequelize")
 
// create connection
const db = new Sequelize('DATABASE_NAME', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});
 
// export connection
module.exports = db