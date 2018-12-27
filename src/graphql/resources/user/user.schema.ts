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
`

const userQueries = `
  # Permite paginação slice. 
  users(first: Int, offset: Int): [ User! ]!
  user(id: ID!): User
  currentUser: User
`

const userMutations = `
  createUser(input: UserCreateInput!): User
  updateUser(input: UserUpdateInput!): User
  updateUserPasswd(input: UserUpdatePasswdInput!): Boolean
  deleteUser: Boolean
`

export {
  userTypes,
  userQueries,
  userMutations
}