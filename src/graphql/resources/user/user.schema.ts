const userTypes = `
  # Definição de tipos de User.
  type User {
    id: ID!
    name: String!
    email: String!
    photo: String
    posts(first: Int, offset: Int): [Post!]!
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
`

const userQueries = `
  # Permite paginação slice. 
  users(first: Int, offset: Int): [ User! ]!
  user(id: ID!): User
`

const userMutations = `
  createUser(input: UserCreateInput!): User
  updateUser(id: ID!, input: UserUpdateInput!): User
  updateUserPasswd(id: ID!, input: UserUpdatePasswdInput!): Boolean
  deleteUser(id: ID!): Boolean
`

export {
  userTypes,
  userQueries,
  userMutations
}