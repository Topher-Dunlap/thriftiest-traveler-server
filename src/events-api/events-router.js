const express = require('express');
// const eventService = require('./event-service');
const timeout = require('connect-timeout');
const eventRouter = express.Router();

eventRouter
    .route('/')
    .get(timeout("6s"), (req, res) => {
        res.send("event router connected")

    })


module.exports = eventRouter