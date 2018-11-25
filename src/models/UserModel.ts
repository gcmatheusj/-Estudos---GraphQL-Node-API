import * as Sequelize from "sequelize"
import { BaseModelInterface } from "../interfaces/BaseModelInterface"

export interface UserAttributes {
  id?: Number
  name?: String
  email?: String
  passwd?: String
  photo?: String
}

export interface UserInterface extends Sequelize.Instance<UserAttributes>, UserAttributes {
  isPasswd(encodedPasswd: String, passwd: String): boolean
}

//Permite trabalhar com query no BD.
export interface UserModel extends BaseModelInterface, Sequelize.Model<UserInterface, UserAttributes> {}

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
    }
  })
  return User
}