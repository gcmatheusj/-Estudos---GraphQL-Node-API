import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'

import db from './models'
import schema from './graphql/schema'
import { extractJwtMiddleware } from './middlewares/extract-jwt.middleware'
import { DataLoaderFactory } from './graphql/dataloaders/DataLoaderFactory';
import { RequestedFields } from './graphql/ast/RequestedFields';

class App {

  public express: express.Application
  private dataLoaderFactory: DataLoaderFactory
  private resquestedFields: RequestedFields

  constructor(){
    this.express = express()
    this.init()
  }

  private init(): void {
    this.dataLoaderFactory = new DataLoaderFactory(db)
    this.resquestedFields = new RequestedFields()
    this.middleware()
  }

  private middleware(): void {
    this.express.use('/graphql', 
      extractJwtMiddleware(),

      (req, res, next) => {
        req['context']['db'] = db
        //Para cada nova requisição uma nova instância de dataLoaders será criada.
        req['context']['dataloaders'] = this.dataLoaderFactory.getLoaders()
        req['context']['requestedFields'] = this.resquestedFields
        next()
      },

      graphqlHTTP(req => ({
        schema: schema,
        graphiql: process.env.NODE_ENV.trim() === 'development',
        context: req['context']
      })))
  }
}

export default new App().express