import { ModelsInterface } from "./ModelsInterface";

export interface BaseModelInterface {
  //"?" diz que o atributo ou método é opcional.
  prototype?
  //Método de classe - Serve para associar um model com outro.
  associate?(models: ModelsInterface)
}