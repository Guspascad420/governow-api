const Sequelize = require("sequelize")
 
// create connection
const db = new Sequelize('governow', 'root', 'gajelas2', {
    host: 'localhost',
    dialect: 'mysql'
});
 
// export connection
module.exports = db