"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
exports.default = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        passwd: {
            type: DataTypes.STRING(128),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        photo: {
            type: DataTypes.BLOB({
                length: 'long'
            }),
            allowNull: true,
            defaultValue: null
        },
    }, {
        tableName: "users",
        hooks: {
            beforeCreate: (user, options) => {
                //Valor randomico ao hash da senha.
                const salt = bcryptjs_1.genSaltSync();
                user.passwd = bcryptjs_1.hashSync(user.passwd, salt);
            }
        }
    });
    User.associate = (models) => { };
    //Verifica se a senha enviada é igual a senha criptografada.
    User.prototype.isPasswd = (encodedPasswd, passwd) => {
        return bcryptjs_1.compareSync(passwd, encodedPasswd);
    };
    return User;
};
