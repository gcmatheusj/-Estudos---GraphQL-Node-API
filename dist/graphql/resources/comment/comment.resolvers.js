"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentResolvers = {
    //Resolvers não triviais.
    Comment: {
        user: (comment, args, { db }, info) => {
            return db.User
                .findById(comment.get('user'));
        },
        post: (comment, args, { db }, info) => {
            return db.Post
                .findById(comment.get('post'));
        },
    },
    Query: {
        commentsByPost: (parent, { postId, first = 10, offset = 0 }, { db }, info) => {
            return db.Comment
                .findAll({
                where: { post: postId },
                limit: first,
                offset: offset
            });
        }
    },
    Mutation: {
        createComment: (parent, args, context, info) => {
        },
        updateComment: (parent, args, context, info) => {
        },
        deleteComment: (parent, args, context, info) => {
        }
    }
};
