require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const eventRouter = require('./event-deals/event-router')
const accountRouter = require('./account/account-router')
const savedFlightRouter = require('./save-flights/save-router')


///instantiating express
const app = express()

///LOGGING WITH MORGAN
const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

//CORS POLICY
// const {CLIENT_ORIGIN} = require('./config');
// app.use(
//     cors({
//         origin: CLIENT_ORIGIN
//     })
// );

///Router Modules
app.use('/event-deals', eventRouter)
app.use('/account', accountRouter)
app.use('/save', savedFlightRouter)

app.get('/', (req, res) => {
    res.send("Hello, world!")
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    } else {
        response = error
    }
    res.status(500).json(response)
})

module.exports = app