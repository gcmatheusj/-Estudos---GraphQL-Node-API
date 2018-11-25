import * as Sequelize from "sequelize";
import { ModelsInterface } from "./ModelsInterface";

export interface DbConnection extends ModelsInterface {
  //Instância do sequelize
  sequelize: Sequelize.Sequelize
}