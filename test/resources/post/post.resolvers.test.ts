import * as jwt from 'jsonwebtoken'

import { db, chai, expect, handleError, app } from "../../test-utils"
import { UserInstance } from "../../../src/models/UserModel"
import { JWT_SECRET } from '../../../src/utils/utils'
import { PostInstance } from '../../../src/models/PostModels';

describe('Post', () => {
    let token: string
    let userId: number
    let postId: number

    //Hook do Mocha que sempre vai executar antes de cada bloco IT.
    beforeEach(() => {
        return db.Comment.destroy({ where: {} })
            .then((rows: number) => db.Post.destroy({ where: {} }))
            .then((rows: number) => db.User.destroy({ where: {} }))
            .then((rows: number) => db.User.create(
                {
                    name: 'Luiza',
                    email: 'luiza@email.com',
                    passwd: '123456'
                },
            )).then((user: UserInstance) => {
                userId = user.get('id')
                
                const payload = { sub: userId }
                token = jwt.sign(payload, JWT_SECRET)

                return db.Post.bulkCreate([
                    {
                        title: 'First post',
                        content: 'First post',
                        author: userId,
                        photo: 'some_photo'
                    },
                    {
                        title: 'Second post',
                        content: 'Second post',
                        author: userId,
                        photo: 'some_photo'
                    },
                    {
                        title: 'Third post',
                        content: 'Third post',
                        author: userId,
                        photo: 'some_photo'
                    },
                ])
            }).then((posts: PostInstance[]) => {
                postId = posts[0].get('id')
            })
    })

    describe('Queries', () => {
        describe('application/json', () => {
            describe('posts', () => {
                it('should return a list of Posts', () => {
                    let body = {
                        query: `
                            query {
                                posts {
                                    title
                                    content
                                }
                            }
                        `
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const postsList = res.body.data.posts

                            expect(res.body.data).to.be.an('object')
                            expect(postsList).to.be.an('array').of.length(3)
                            expect(postsList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt', 'comments'])
                            expect(postsList[0]).to.have.keys(['title', 'content'])
                            expect(postsList[0].title).to.equal('First post')
                        }).catch(handleError)
                })
            })

            describe('post', () => {
                it('should return a single Post with your author', () => {
                    let body = {
                        query: `
                            query getPost($id: ID!) {
                                post(id: $id) {
                                    title
                                    author {
                                        name
                                        email
                                    }
                                    comments {
                                        comment
                                    }
                                }
                            }
                        `,
                        variables: {
                            id: postId
                        }
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const singlePost = res.body.data.post

                            expect(res.body.data).to.have.key('post')
                            expect(singlePost).to.be.an('object')
                            expect(singlePost).to.have.keys(['title', 'author', 'comments'])
                            expect(singlePost.title).to.equal('First post')
                            expect(singlePost.author).to.be.an('object').with.keys(['name', 'email'])
                            expect(singlePost.author).to.be.an('object').with.not.keys(['id', 'createdAt', 'updatedAt', 'posts'])
                        }).catch(handleError)
                })
            })
        })
    })
})