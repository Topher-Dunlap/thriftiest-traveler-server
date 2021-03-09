const { expect } = require('chai')
const supertest = require('supertest')
require('dotenv').config()

process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'


global.expect = expect
global.supertest = supertest