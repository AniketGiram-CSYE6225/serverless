const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const Model = Sequelize.Model;
const sequelize = require('../database/index.js');

class User extends Model { }

const user = {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
    },
    account_verified: {
        type: DataTypes.BOOLEAN,
        default: false
    },
    account_created: {
        type: DataTypes.DATE
    },
    account_updated: {
        type: DataTypes.DATE
    }
}

User.init(user, {
    sequelize,
    timestamps: true,
    createdAt: 'account_created',
    updatedAt: 'account_updated',
    modelName: 'User'
});

module.exports = User;
