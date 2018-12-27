"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userTypes = `
  # Definição de tipos de User.
  type User {
    id: ID!
    name: String!
    email: String!
    photo: String
    posts(first: Int, offset: Int): [Post!]!
    createdAt: String!
    updatedAt: String!
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
  currentUser: User
`;
exports.userQueries = userQueries;
const userMutations = `
  createUser(input: UserCreateInput!): User
  updateUser(input: UserUpdateInput!): User
  updateUserPasswd(input: UserUpdatePasswdInput!): Boolean
  deleteUser: Boolean
`;
exports.userMutations = userMutations;
