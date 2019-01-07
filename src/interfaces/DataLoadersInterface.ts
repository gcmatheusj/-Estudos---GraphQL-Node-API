import * as DataLoader from 'dataloader'

import { DataLoaderParam } from './DataLoaderParamInterface'
import { UserInstance } from '../models/UserModel'
import { PostInstance } from '../models/PostModels'

export interface DataLoaders {
    userLoader: DataLoader<DataLoaderParam<number>, UserInstance>
    postLoader: DataLoader<DataLoaderParam<number>, PostInstance>
}