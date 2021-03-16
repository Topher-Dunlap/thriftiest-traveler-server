const knex = require('knex')
const app = require('../src/app')
const helpers = require('../test/test-helper')
const bcrypt = require('bcryptjs')

describe('Users Endpoints', function () {
    let db;

    const {testUsers} = helpers.makeLoginFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /account/create`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )

            const requiredFields = ['first_name', 'last_name', 'password', 'email']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                    email: 'test@email',
                    password: 'test password',
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/account/create')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })

                it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                    const userShortPassword = {
                        first_name: 'test first_name',
                        password: '1234567',
                        last_name: 'test last_name',
                        email: 'test@email',
                    }
                    return supertest(app)
                        .post('/account/create')
                        .send(userShortPassword)
                        .expect(400, {error: `Password must be longer than 8 characters`})
                })

                it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                    const userLongPassword = {
                        first_name: 'test first_name',
                        password: '*'.repeat(73),
                        last_name: 'test last_name',
                        email: 'test@email',
                    }
                    // console.log(userLongPassword)
                    // console.log(userLongPassword.password.length)
                    return supertest(app)
                        .post('/account/create')
                        .send(userLongPassword)
                        .expect(400, {error: `Password must be less than 72 characters`})
                })

                it(`responds 400 error when password starts with spaces`, () => {
                    const userPasswordStartsSpaces = {
                        first_name: 'test first_name',
                        last_name: 'test last_name',
                        password: ' 1Aa!2Bb@',
                        email: 'test@email',
                    }
                    return supertest(app)
                        .post('/account/create')
                        .send(userPasswordStartsSpaces)
                        .expect(400, {error: `Password must not start or end with empty spaces`})
                })

                it(`responds 400 error when password ends with spaces`, () => {
                    const userPasswordEndsSpaces = {
                        first_name: 'test first_name',
                        password: '1Aa!2Bb@ ',
                        last_name: 'test last_name',
                        email: 'test@email',
                    }
                    return supertest(app)
                        .post('/account/create')
                        .send(userPasswordEndsSpaces)
                        .expect(400, {error: `Password must not start or end with empty spaces`})
                })

                it(`responds 400 error when password isn't complex enough`, () => {
                    const userPasswordNotComplex = {
                        first_name: 'test first_name',
                        password: '11AAaabb',
                        last_name: 'test last_name',
                        email: 'test@email',
                    }
                    return supertest(app)
                        .post('/account/create')
                        .send(userPasswordNotComplex)
                        .expect(400, {error: `Password must contain 1 upper case, lower case, number and special character`})
                })

                it(`responds 400 'Email name already taken' when user_name isn't unique`, () => {
                    const duplicateUser = {
                        first_name: 'test first_name',
                        password: '11AAaa!!',
                        last_name: 'test last_name',
                        email: testUser.email,
                    }
                    return supertest(app)
                        .post('/account/create')
                        .send(duplicateUser)
                        .expect(400, {error: `Email already taken`})
                })
            })
        })
    })
    context(`Happy path`, () => {
        it(`responds 201, serialized user, storing bcryped password`, () => {
            const newUser = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                email: 'test email',
                password: '11AAaa!!',
            }
            return supertest(app)
                .post('/account/create')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.eql({ success: 'User Account Created.' })
                })
                .expect(res =>
                    db
                        .from('traveler_users')
                        .select('*')
                        .where({id: res.body.id})
                        .first()
                        .then(row => {
                            expect(row.first_name).to.eql(newUser.first_name)
                            expect(row.last_name).to.eql(newUser.last_name)
                            expect(row.email).to.eql(newUser.email)
                            const expectedDate = new Date().toLocaleString('en', {timeZone: 'UTC'})
                            const actualDate = new Date(row.date_created).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)

                            return bcrypt.compare(newUser.password, row.password)
                        })
                        .then(compareMatch => {
                            expect(compareMatch).to.be.true
                        })
                )
        })
    })
})