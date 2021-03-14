const express = require('express');
const savedFlightRouter = express.Router();
const logger = require('../logger');
const bodyParser = express.json();
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
        SavedFlightService.getAllSavedFlights(
            req.app.get('db'),
            req.headers.user_id
        )
            .then(savedFlights => {
                res.json(savedFlights.map(serializeFlight))
                console.log("save GET: ", savedFlights)
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

        const newFlight = {title, place_name, description, country_name, price, carrier, departure, traveler_user} = req.body;
        let db = req.app.get('db')
        console.log("pre-insert flight")
        console.log("newFlight: ", newFlight)
        // console.log("req.app.get('db'): ", req.app.get('db'))

        SavedFlightService.insertFlight(db, newFlight)
            .then(flight => {
                console.log("inside first .then", flight)
                logger.info(`Flight with id ${flight.id} created.`)
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
        let user_id = req.headers.user_id;
        let db = req.app.get('db')

        /// Remove Flight
        SavedFlightService.deleteSavedFlight(db, user_id, id)
            .then(response => {
                console.log(response.data)
                logger.info(`Flight with id ${id} deleted.`)
                res.status(204).json(response.data)

            })


    })

module.exports = savedFlightRouter