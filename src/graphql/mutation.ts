import { userMutations } from './resources/user/user.schema'
import { postMutations } from './resources/post/post.schema'
import { commentMutation } from './resources/comment/comment.schema'
import { tokenMutations } from './resources/token/token.schema'

const Mutation = `
  type Mutation {
    ${commentMutation}
    ${postMutations}
    ${tokenMutations}
    ${userMutations}
  }
`

export {
  Mutation
}