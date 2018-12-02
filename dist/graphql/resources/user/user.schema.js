"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userTypes = `
  # Definição de tipos de User.
  type User {
    id: ID!
    name: String!
    email: String!
    photo: String
    createdAt: String!
    updateAt: String!
  }

  input UserCreateInput {
    name: String!
    email: String!
    passwd: String!
  }

  input UserUpdateInput {
    name: String!
    email: String!
    photo: String
  }

  input UserUpdatePasswdInput {
    passwd: String!
  }
`;
exports.userTypes = userTypes;
const userQueries = `
  # Permite paginação slice. 
  users(first: Int, offset: Int): [ User! ]!
  user(id: ID!): User
`;
exports.userQueries = userQueries;
const userMutations = `
  createUser(input: UserCreateInput!): User
  updateUser(id: ID!, input: UserUpdateInput!): User
  updateUserPasswd(id: ID!, input: UserUpdatePasswdInput!): Boolean
  deleteUser(id: ID!): Boolean
`;
exports.userMutations = userMutations;
