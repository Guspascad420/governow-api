const Sequelize = require('sequelize')
const db = require('../config/database')

const DataTypes = Sequelize.DataTypes

const User = db.define('users', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
})

module.exports = User

