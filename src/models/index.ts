import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
import { DbConnection } from '../interfaces/DbConnectionInterface';

const basename: string = path.basename(module.filename)
const env: string = process.env.NODE_ENV || 'development'
let config = require('../config/config.json')[env]
let db = null

if(!db) {
  db = {}

  //Instancia do sequelize
  const sequelize: Sequelize.Sequelize = new Sequelize(
    "graphql_blog_development",
    "root",
    null,
    {
      host: "127.0.0.1",
      dialect: "mysql"
    }
  )

  //Realiza um filtro na pasta models pegando apenas os models
  fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach((file: string) => {
      const model = sequelize.import(path.join(__dirname, file))
      db[model['name']] = model
    })

  //Responsável por gerenciar o relacionamento nos models.
  Object.keys(db).forEach((modelName: string) => {
    if(db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  //Cria um novo atributo no db para sincronizar o sequelize com o mysql.
  db['sequelize'] = sequelize
}

//Realiza um cast e faz a tipagem do db.
export default <DbConnection>db