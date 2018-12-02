"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commentTypes = `
    type Comment {
        id: ID!
        comment: String!
        user: User!
        post: Post!
        createdAt: String!
        updateAt: String!
    }

    input CommentInput {
        comment: String!
        post: Int!
        user: Int!
    }
`;
exports.commentTypes = commentTypes;
const commentQueries = `
    commentsByPost(post: ID!, first: Int, offset: Int): [Comment!]!
`;
exports.commentQueries = commentQueries;
const commentMutation = `
    createComment(input: CommentInput!): Comment
    updateComment(id: ID!, input: CommentInput!): Comment
    deleteComment(id: ID!): Boolean
`;
exports.commentMutation = commentMutation;
