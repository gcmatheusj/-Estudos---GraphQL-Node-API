import * as DataLoader from 'dataloader'

import { UserInstance } from '../models/UserModel'
import { PostInstance } from '../models/PostModels'

export interface DataLoaders {
    user: DataLoader<number, UserInstance>
    post: DataLoader<number, PostInstance>
}