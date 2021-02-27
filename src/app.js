require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const eventRouter = require('./events/events-router')

///instantiating express
const app = express()

///LOGGING WITH MORGAN
const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';
app.use(morgan(morganOption))
app.use(helmet())

//CORS POLICY
const {CLIENT_ORIGIN} = require('./config');
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

///Router Modules
app.use('/events', eventRouter)

app.get('/', (req, res) => {
    console.log("inside get")
    res.send("Hello, world!")
})

 app.use(function errorHandler(error, req, res, next) {
     let response
     if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
     } else {
         console.error(error)
         response = { message: error.message, error }
     }
     res.status(500).json(response)
 })

module.exports = app