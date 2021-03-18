const express = require('express');

const savedFlightRouter = express.Router();
const xss = require('xss');
const logger = require('../logger');

const bodyParser = express.json();
const SavedFlightService = require('./save-service');

const serializeFlight = (flight) => ({
  id: flight.id,
  price: xss(flight.price),
  title: xss(flight.title),
  carrier: xss(flight.carrier),
  departure: xss(flight.departure),
  place_name: xss(flight.place_name),
  description: xss(flight.description),
  country_name: xss(flight.country_name),
});

savedFlightRouter
  .route('/')
  .get((req, res, next) => {
    SavedFlightService.getAllSavedFlights(
      req.app.get('db'),
      req.headers.user_id,
    )
      .then((savedFlights) => {
        res.json(savedFlights.map(serializeFlight));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    /// Validate that values exist exist
    for (const field of ['title', 'place_name', 'description', 'country_name', 'price', 'carrier', 'departure', 'traveler_user']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).json({
          error: { message: `'${field}' is required` },
        });
      }
    }

    const newFlight = {
      title,
      place_name,
      description,
      country_name,
      price,
      carrier,
      departure,
      traveler_user,
    } = req.body;
    const db = req.app.get('db');

    SavedFlightService.insertFlight(db, newFlight)
      .then((flight) => {
        logger.info(`Flight with id ${flight.id} created.`);
        res
          .status(201)
          .location(`/${flight.id}`)
          .json(serializeFlight(flight));
      })
      .catch((error) => {
        res.status(404).send({ error: 'Account does not exist' });
      });
  });

savedFlightRouter
  .route('/:id')
  .delete((req, res) => {
    const { id } = req.params;
    const { user_id } = req.headers;
    const db = req.app.get('db');

    /// Remove Flight
    SavedFlightService.deleteSavedFlight(db, user_id, id)
      .then((response) => {
        logger.info(`Flight with id ${id} deleted.`);
        res.status(204).json(response.data);
      });
  });

module.exports = savedFlightRouter;
