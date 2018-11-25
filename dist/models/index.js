"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
let config = require('../config/config.json')[env];
let db = null;
if (!db) {
    db = {};
    //Instancia do sequelize
    const sequelize = new Sequelize("graphql_blog_development", "root", null, {
        host: "127.0.0.1",
        dialect: "mysql"
    });
    //Realiza um filtro na pasta models pegando apenas os models
    fs
        .readdirSync(__dirname)
        .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
        .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model['name']] = model;
    });
    //Responsável por gerenciar o relacionamento nos models.
    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    //Cria um novo atributo no db para sincronizar o sequelize com o mysql.
    db['sequelize'] = sequelize;
}
//Realiza um cast e faz a tipagem do db.
exports.default = db;
