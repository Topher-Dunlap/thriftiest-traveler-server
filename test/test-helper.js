const bcrypt = require('bcryptjs')

function makeUsersArray() {
    return [
        {
            id: 1,
            email: 'test-user-1',
            first_name: 'Test user 1',
            last_name: 'TU1',
            password: 'password',
        },
        {
            id: 2,
            email: 'test-user-2',
            first_name: 'Test user 2',
            last_name: 'TU2',
            password: 'password',
        },
        {
            id: 3,
            email: 'test-user-3',
            first_name: 'Test user 3',
            last_name: 'TU3',
            password: 'password',
        },
        {
            id: 4,
            email: 'test-user-4',
            first_name: 'Test user 4',
            last_name: 'TU4',
            password: 'password',
        },
    ]
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('traveler_users').insert(preppedUsers)
        .then(() => // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('traveler_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function makeLoginFixtures() {
    const testUsers = makeUsersArray()
    return {testUsers}
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(`TRUNCATE traveler_users`)
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE traveler_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('traveler_users_id_seq', 0)`),
                ])
            )
    )
}

module.exports = {
    makeLoginFixtures,
    seedUsers,
    cleanTables,
}
