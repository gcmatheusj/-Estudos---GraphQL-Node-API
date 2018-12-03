import * as Sequelize from "sequelize"
import { BaseModelInterface } from "../interfaces/BaseModelInterface"
import { genSaltSync, hashSync, compareSync } from 'bcryptjs'
import { ModelsInterface } from "../interfaces/ModelsInterface"

export interface UserAttributes {
  id?: number
  name?: string
  email?: string
  passwd?: string
  photo?: string
  createdAt?: string
  updateAt?: string
}

export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
  isPasswd(encodedPasswd: String, passwd: String): boolean
}

//Permite trabalhar com query no BD.
export interface UserModel extends BaseModelInterface, Sequelize.Model<UserInstance, UserAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {
  const User: UserModel = sequelize.define('User', {
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
        beforeCreate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
          //Valor randomico ao hash da senha.
          const salt = genSaltSync()
          user.passwd = hashSync(user.passwd, salt)
        },
        beforeUpdate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
          if(user.changed('passwd')){
            //Valor randomico ao hash da senha.
            const salt = genSaltSync()
            user.passwd = hashSync(user.passwd, salt)
          }
        }
      }
  })

  User.associate = (models: ModelsInterface): void => {}

  //Verifica se a senha enviada é igual a senha criptografada.
  User.prototype.isPasswd = (encodedPasswd: string, passwd: string): boolean => {
    return compareSync(passwd, encodedPasswd)
  }

  return User
}