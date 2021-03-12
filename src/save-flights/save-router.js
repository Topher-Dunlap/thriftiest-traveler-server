const express = require('express');
const savedFlightRouter = express.Router();
const {v4: uuid} = require('uuid');
const logger = require('../logger');
const bodyParser = express.json();
const {savedFlights} = require('../store');
const SavedFlightService = require('./save-service');
const xss = require('xss');

const serializeFlight = flight => ({
    id: flight.id,
    price: xss(flight.price),
    title: xss(flight.title),
    carrier: xss(flight.carrier),
    departure: xss(flight.departure),
    place_name: xss(flight.place_name),
    description: xss(flight.description),
    country_name: xss(flight.country_name),
})

savedFlightRouter
    .route('/')
    .get((req, res, next) => {
        console.log("req: ", req.headers)
        SavedFlightService.getAllSavedFlights(
            req.app.get('db'),
            req.headers.user_id
        )
            .then(savedFlights => {
                res.json(savedFlights.map(serializeFlight))
                console.log(savedFlights)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        /// Validate that values exist exist
        for (const field of ['title', 'place_name', 'description', 'country_name', 'price', 'carrier', 'departure']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res.status(400).json({
                    error: {message: `'${field}' is required`}
                })
            }
        }

        const newFlight = {title, place_name, description, country_name, price, carrier, departure} = req.body;

        SavedFlightService.insertFlight(
            req.app.get('db'),
            newFlight
        )
            .then(flight => {
                logger.info(`Bookmark with id ${flight.id} created.`)
                res
                    .status(201)
                    .location(`/${flight.id}`)
                    .json(serializeFlight(flight))
            })
            .catch(next)
    })

savedFlightRouter
    .route('/:id')
    .delete((req, res) => {
        const {id} = req.params;
        const savedFlightIndex = savedFlights.findIndex(c => c.id == id);

        if (savedFlightIndex === -1) {
            logger.error(`Flight with id ${id} not found.`);
            return res
                .status(404)
                .send('Not Found');
        }
        /// Remove Flight
        savedFlights.splice(savedFlightIndex, 1);
        logger.info(`Flight with id ${id} deleted.`)

        res
            .status(204)
            .end();

    })

// .all((req, res, next) => {
//     SavedFlightService.getById(
//         req.app.get('db'),
//         req.params.savedFlight_id
//     ).then(savedFlight => {
//         if (!savedFlight) {
//             return res.status(404).json({
//                 error: {message: `Flight doesn't exist`}
//             })
//         }
//         res.savedFlight = savedFlight // save the article for the next middleware
//         next() // don't forget to call next so the next middleware happens!
//     }).catch(next)
// })

module.exports = savedFlightRouter