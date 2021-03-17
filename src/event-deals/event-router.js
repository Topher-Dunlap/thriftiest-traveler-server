const express = require('express');
const eventService = require('./event-service');
const timeout = require('connect-timeout');
const eventRouter = express.Router();


let userAirport = '';

eventRouter
    .route('/')
    .get((req, res) => {
        const extractedEventData = []
        eventService.predictAPICall()
            .then(response => {
                ///make initial event-deals data
                const eventResString = (JSON.stringify(response.data));
                const eventResParse = (JSON.parse(eventResString));
                ///data coming back as JSO already so may not need to do stringify and parse
                let eventsArray = eventResParse.results
                eventsArray.forEach(eventData => {
                    let eventObj = {
                        title: eventData.title,
                        description: eventData.description,
                        brand_safe: eventData.brand_safe,
                        location: [eventData.location[1], eventData.location[0]],
                        eventLocationId: '',
                        placeName: 'City Unavailable',
                        countryName: 'Country Unavailable',
                        price: undefined,
                        carrier: 'Carrier unavailable',
                        departure: {DepartureDate: 'date n/a'}
                    }
                    extractedEventData.push(eventObj);
                });
                return extractedEventData;
            })
            .then(newExtractedEventData => {
                eventService.locationFinder(newExtractedEventData, res)
            })
            .catch(error => {
                console.log("events error data: ", error)
                res.status(400).send({error: "Something went wrong loading events please reload the page"});
            });
    })

eventRouter
    .route('/deals')
    .post(timeout('10s'), (req, res) => {
        let filteredEvent = req.body;
        if (filteredEvent[0].eventLocationId !== '') {
            eventService.flightPrices(filteredEvent[0].eventLocationId, userAirport)
                .then(eventInstance => {
                    if (eventInstance.data.Quotes.length > 0) {
                        Object.assign(filteredEvent[0],
                            {price: eventInstance.data.Quotes[0].MinPrice},
                            {departure: eventInstance.data.Quotes[0].OutboundLeg},
                            {carriersName: eventInstance.data.Carriers[0].Name},
                        )
                        console.log(filteredEvent)
                        res.json(filteredEvent)
                    } else {
                        res.json("no price")
                    }
                })
                .catch(error => res.send(error.data));
        } else {
            res.send("no deal")
        }
    })

eventRouter
    .route('/userAirport')
    .get(timeout('6s'), (req, res) => {
        let userCity = req.query.userCity;
        eventService.userAirportLocation(userCity)
            .then(locationResponse => {
                userAirport = locationResponse.data.Places[0].PlaceId;
                res.send(userAirport)
            })
            .catch(error => {
                res.status(400).send({error: "Something went wrong loading the users airport"});
            })
    })

module.exports = eventRouter