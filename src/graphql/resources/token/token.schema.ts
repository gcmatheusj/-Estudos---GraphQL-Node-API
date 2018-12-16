const tokenTypes = `
    type Token {
        token: String!
    }
`

const tokenMutations = `
    createToken(email: String!, passwd: String!): Token
`

export {
    tokenTypes,
    tokenMutations
}