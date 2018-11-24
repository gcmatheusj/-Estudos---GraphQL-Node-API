"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
//Array de users mockado.
const users = [
    {
        id: 1,
        name: 'Jon',
        email: 'jon@email.com'
    },
    {
        id: 2,
        name: 'Dany',
        email: 'dany@email.com'
    }
];
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    allUser: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }
`;
const resolvers = {
    Query: {
        allUser: () => users
    },
    Mutation: {
        createUser: (parent, args) => {
            const newUser = Object.assign({ id: users.length + 1 }, args);
            users.push(newUser);
            return newUser;
        }
    },
};
exports.default = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers });
