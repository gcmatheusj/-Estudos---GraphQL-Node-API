import { db, app, handleError, expect } from '../../test-utils'
import { UserInstance } from '../../../src/models/UserModel';

describe('User', () => {
    let userId: number

    //Hook do Mocha que sempre vai executar antes de cada bloco IT.
    beforeEach(() => {
        return db.Comment.destroy({ where: {} })
            .then((rows: number) => db.Post.destroy({ where: {} }))
            .then((rows: number) => db.User.destroy({ where: {} }))
            .then((rows: number) => db.User.bulkCreate([
                {
                    name: 'Matheus Castro',
                    email: 'goca1377@email.com',
                    passwd: '123456'
                },
                {
                    name: 'Ana Luiza',
                    email: 'analu@email.com',
                    passwd: '123456'
                },
                {
                    name: 'Meu amor',
                    email: 'teamo@email.com',
                    passwd: '123456'
                },
            ])).then((users: UserInstance[]) => {
                userId = users[0].get('id')
            })
    })

    describe('Queries', () => {
        describe('application/json', () => {
            describe('users', () => {
                it('should return a list of Users', () => {
                    let body = {
                        query: `
                            query {
                                users {
                                    name
                                    email
                                }
                            }
                        `
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const usersList = res.body.data.users

                            expect(res.body.data).to.be.an('object')
                            expect(usersList).to.be.an('array').of.length(1)
                            expect(usersList[0]).to.not.have.keys(['id', 'photo', 'createdAt', 'updatedAt', 'posts'])
                            expect(usersList[0]).to.have.keys(['name', 'email'])
                        }).catch(handleError)
                })

                it('should paginate a list of Users', () => {
                    let body = {
                        query: `
                            query getUsersList($first: Int, $offset: Int) {
                                users(first: $first, offset: $offset) {
                                    name
                                    email
                                    createdAt
                                }
                            }
                        `,
                        variables: {
                            first: 2,
                            offset: 1
                        }
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const usersList = res.body.data.users

                            expect(res.body.data).to.be.an('object')
                            expect(usersList).to.be.an('array').of.length(2)
                            expect(usersList[0]).to.not.have.keys(['id', 'photo', 'updatedAt', 'posts'])
                            expect(usersList[0]).to.have.keys(['name', 'email', 'createdAt'])
                        }).catch(handleError)
                })
            })

            describe('user', () => {
                it('should return a single User', () => {
                    let body = {
                        query: `
                            query getSingleUser($id: ID!) {
                                users(id: $id) {
                                    name
                                    email
                                }
                            }
                        `,
                        variables: {
                            id: userId
                        }
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const singleUser = res.body.data.user

                            expect(res.body.data).to.be.an('object')
                            expect(singleUser).to.be.an('object')
                            expect(singleUser).to.have.keys(['id', 'name', 'email', 'posts'])
                            expect(singleUser.name).to.equal('Matheus Castro')
                            expect(singleUser.email).to.equal('goca1377@gmail.com')
                        }).catch(handleError)
                })

                it('should return only \'name\' attribute', () => {
                    let body = {
                        query: `
                            query getSingleUser($id: ID!) {
                                users(id: $id) {
                                    name
                                }
                            }
                        `,
                        variables: {
                            id: userId
                        }
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const singleUser = res.body.data.user

                            expect(res.body.data).to.be.an('object')
                            expect(singleUser).to.be.an('object')
                            expect(singleUser).to.have.key('name')
                            expect(singleUser.name).to.equal('Matheus Castro')
                            expect(singleUser.email).to.be.undefined
                            expect(singleUser.posts).to.be.undefined
                            expect(singleUser.createdAt).to.be.undefined
                        }).catch(handleError)
                })

                it('should return an error if user not exists', () => {
                    let body = {
                        query: `
                            query getSingleUser($id: ID!) {
                                users(id: $id) {
                                    name
                                }
                            }
                        `,
                        variables: {
                            id: -1
                        }
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            expect(res.body.data.user).to.be.null
                            expect(res.body.errors).to.be.an('array')
                            expect(res.body).to.have.keys(['data', 'errors'])
                            expect(res.body.errors[0].message).to.equal('Error: User with id -1 not found!')
                            
                        }).catch(handleError)
                })
            })
        })
    })
})