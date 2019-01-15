import { GraphQLResolveInfo } from "graphql"
import { Transaction } from "sequelize"

import { DbConnection } from '../../../interfaces/DbConnectionInterface'
import UserModel, { UserInstance } from "../../../models/UserModel"
import { handleError, throwError } from "../../../utils/utils"
import { compose } from "../../composable/composable.resolver";
import { authResolver, authResolvers } from "../../composable/auth.resolver";
import { verifyTokenResolver } from "../../composable/verify-token.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";
import { RequestedFields } from "../../ast/RequestedFields";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const userResolvers = {
    User: {
        posts: (user, { first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo ) => {
            const { db, requestedFields } = context

            return db.Post
                .findAll({
                    where: {author: user.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
                }).catch(handleError)
        }
    },

    Query: {
        users: (parent, { first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            const { db, requestedFields } = context
            
            return db.User
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                }).catch(handleError)
        },

        user: (parent, {id}, context: ResolverContext, info: GraphQLResolveInfo) => {
            const { db, requestedFields } = context

            id = parseInt(id)
            return db.User
                .findById(id, {
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                })
                .then((user: UserInstance) => {
                    throwError(!user, `User with id: ${id} not found!`)
                    
                    return user
                }).catch(handleError)
        },

        currentUser: compose(...authResolvers)((parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            const { db, authUser, requestedFields } = context
            
            return db.User
                .findById(authUser.id, {
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                })
                .then((user: UserInstance) => {
                    throwError(!user, `User with id: ${authUser.id} not found!`)

                    return user
                }).catch(handleError)
        })
    },
    Mutation: {
        createUser: (parent, {input},{db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .create(input, {transaction: t})
            }).catch(handleError)
        },

        updateUser: compose(...authResolvers)((parent, {input},{db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with id: ${authUser.id} not found!`)
                        
                        return user.update(input, {transaction: t})
                    })
            }).catch(handleError)
        }),

        updateUserPasswd: compose(...authResolvers)((parent, {input},{db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with id: ${authUser.id} not found!`)
                        
                        return user.update(input, {transaction: t})
                            .then((user: UserInstance) => !!user)
                    })
            }).catch(handleError)
        }),

        deleteUser: compose(...authResolvers)((parent, args, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
              return db.User
                .findById(authUser.id)
                .then((user: UserInstance) => {
                    throwError(!user, `User with id: ${authUser.id} not found!`)
                    
                    return user.destroy({transaction: t})
                        .then(user => true)
                        .catch(user => false)
                })  
            }).catch(handleError)
        })
    }
}