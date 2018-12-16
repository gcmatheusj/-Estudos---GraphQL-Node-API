"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenTypes = `
    type Token {
        token: String!
    }
`;
exports.tokenTypes = tokenTypes;
const tokenMutations = `
    createToken(email: String!, passwd: String!): Token
`;
exports.tokenMutations = tokenMutations;
