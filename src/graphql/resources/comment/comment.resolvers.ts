import { GraphQLResolveInfo } from "graphql"

import { DbConnection } from "../../../interfaces/DbConnectionInterface"
import { Transaction } from "sequelize"
import { CommentInstance } from "../../../models/CommentModel"
import { handleError, throwError } from "../../../utils/utils"
import { AuthUser } from "../../../interfaces/AuthUserInterface"
import { compose } from "../../composable/composable.resolver"
import { authResolvers } from "../../composable/auth.resolver"
import { DataLoaders } from "../../../interfaces/DataLoadersInterface"
import { ResolverContext } from "../../../interfaces/ResolverContextInterface"

export const commentResolvers = {
  //Resolvers não triviais.
  Comment: {
    user: (comment, args, {db, dataloaders: {userLoader}}: {db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
      return userLoader
        .load({
          key: comment.get('user'),
          info
        })
        .catch(handleError)
    },

    post: (comment, args, {db, dataloaders: {postLoader}}: {db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
      return postLoader
        .load({
          key: comment.get('post'),
          info
        })
        .catch(handleError)
    },

  },

  Query: {
    commentsByPost: (parent, {postId, first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
      const { db, requestedFields } = context
      
      postId = parseInt(postId)
      return db.Comment
        .findAll({
          where: {post: postId},
          limit: first,
          offset: offset,
          attributes: requestedFields.getFields(info)
        }).catch(handleError)
    }
  },

  Mutation: {
    createComment: compose(...authResolvers)((parent, { input }, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
      input.user = authUser.id
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comment
          .create(input, {transaction: t})
      }).catch(handleError)
    }),

    updateComment: compose(...authResolvers)((parent, {id, input }, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
      id = parseInt(id)
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comment
          .findById(id)
          .then((comment: CommentInstance) => {
              throwError(!comment, `Comment with id ${id} not found`)
              throwError(comment.get('user') !== authUser.id, `Unauthorized! You can only edit comments by yourself.`)
            
            return comment.update(input, {transaction: t})
          })
      }).catch(handleError)
    }),

    deleteComment: compose(...authResolvers)((parent, { id }, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
      id = parseInt(id)
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comment
          .findById(id)
          .then((comment: CommentInstance) => {
            throwError(!comment, `Comment with id ${id} not found`)
            throwError(comment.get('user') !== authUser.id, `Unauthorized! You can only delete comments by yourself.`)
            
            return comment.destroy({transaction: t})
              .then(comment => true)
              .catch(comment => false)
          })
      }).catch(handleError)
    })

  }
}