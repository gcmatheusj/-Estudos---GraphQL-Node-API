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

        describe('application/graphql', () => {
            describe('posts', () => {
                it('should return a list of Posts', () => {
                    let query = `
                            query {
                                posts {
                                    title
                                    content
                                }
                            }
                        `

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/graphql')
                        .send(query)
                        .then(res => {
                            const postsList = res.body.data.posts

                            expect(res.body.data).to.be.an('object')
                            expect(postsList).to.be.an('array').of.length(3)
                            expect(postsList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt', 'comments'])
                            expect(postsList[0]).to.have.keys(['title', 'content'])
                            expect(postsList[0].title).to.equal('First post')
                        }).catch(handleError)
                })

                it('should paginate a list of Posts', () => {
                    let query = `
                            query getPostsLists($first: Int, $offset: Int) {
                                posts(first: $first, offset: $offset) {
                                    title
                                    content
                                }
                            }
                        `

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/graphql')
                        .send(query)
                        .query({
                            variables: JSON.stringify({
                                first: 2,
                                offset: 1
                            })
                        })
                        .then(res => {
                            const postsList = res.body.data.posts

                            expect(res.body.data).to.be.an('object')
                            expect(postsList).to.be.an('array').with.length(2)
                            expect(postsList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt', 'comments'])
                            expect(postsList[0]).to.have.keys(['title', 'content'])
                            expect(postsList[0].title).to.equal('Second post')
                        }).catch(handleError)
                })
            })
        })
    })

    describe('Mutations', () => {
        describe('application/json', () => {
            describe('createPost', () => {
                it('should create a new Post', () => {
                    let body = {
                        query: `
                            mutation createNewPost($input: PostInput!) {
                                createPost(input: $input) {
                                    id
                                    title
                                    content
                                    author {
                                        id
                                        name
                                        email  
                                    }
                                }
                            }
                        `,
                        variables: {
                            input: {
                                title: 'Fourth post',
                                content: 'Fourth content',
                                photo: 'some_photo'
                            }
                        }
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {
                            const createPost = res.body.data.createPost

                            expect(createPost).to.be.an('object')
                            expect(createPost).to.have.keys(['id', 'title', 'content', 'author'])
                            expect(createPost.title).to.equal('Fourth post')
                            expect(createPost.content).to.equal('Fourth content')
                            expect(parseInt(createPost.author.id)).to.equal(userId)
                        }).catch(handleError)
                })
            })

            describe('updatePost', () => {
                it('should update an existing Post', () => {
                    let body = {
                        query: `
                            mutation updateExistingPost($id: ID!, $input: PostInput!) {
                                updatePost(id: $id, input: $input) {
                                    title
                                    content
                                    photo
                                }
                            }
                        `,
                        variables: {
                            id: postId,
                            input: {
                                title: 'Post changed',
                                content: 'Content changed',
                                photo: 'some_photo_2'
                            }
                        }
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {
                            const updatedPost = res.body.data.updatePost

                            expect(updatedPost).to.be.an('object')
                            expect(updatedPost).to.have.keys(['title', 'content', 'photo'])
                            expect(updatedPost.title).to.equal('Post changed')
                            expect(updatedPost.content).to.equal('Content changed')
                            expect(updatedPost.photo).to.equal('some_photo_2')
                        }).catch(handleError)
                })
            })

            describe('deletePost', () => {
                it('should delete an existing Post', () => {
                    let body = {
                        query: `
                            mutation deleteExistingPost($id: ID!) {
                                deletePost(id: $id) 
                            }
                        `,
                        variables: {
                            id: postId,
                        }
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {
                            expect(res.body.data).to.have.key('deletePost')
                            expect(res.body.data.deletePost).to.be.true
                        }).catch(handleError)
                })
            })
        })
    })

})