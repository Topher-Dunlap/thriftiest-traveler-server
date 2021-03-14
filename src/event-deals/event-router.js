const express = require('express');
const eventService = require('./event-service');
const timeout = require('connect-timeout');
const eventRouter = express.Router();

// let extractedEventData = [{test: "test"}];
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
            .catch(error => console.log("/location finder catch", error.data));
    })

eventRouter
    .route('/deals')
    .post((req, res) => {
        let filteredEvents = req.body;
        new Promise((resolve, reject) => {
            let idx = 0;
            filteredEvents.forEach(eventInstance => {
                eventService.flightPrices(eventInstance.eventLocationId, userAirport)
                    .then(eventInstance => {
                        if (eventInstance.data.Quotes.length > 0) {
                            Object.assign(filteredEvents[idx],
                                {price: eventInstance.data.Quotes[0].MinPrice},
                                {departure: eventInstance.data.Quotes[0].OutboundLeg},
                                {carriersName: eventInstance.data.Carriers[0].Name},
                            )
                            eventService.flightPricesConditional(idx, filteredEvents, resolve);
                            idx++;
                        } else {
                            eventService.flightPricesConditional(idx, filteredEvents, resolve);
                            idx++;
                        }
                    })
                    .catch(error => console.log("/deals error catch", error.data));
            })
        })
            .then(response => {
                console.log("last filteredEvents: ", filteredEvents)
                res.json(filteredEvents.filter(obj => obj.price !== undefined))
            })
            .catch(error => console.log("/deals error catch", error.data));
    })

eventRouter
    .route('/userAirport')
    .get(timeout ('6s'), (req, res) => {
        let userCity = req.query.userCity;
        eventService.userAirportLocation(userCity)
            .then(locationResponse => {
                userAirport = locationResponse.data.Places[0].PlaceId;
            })
            .catch(error => console.log("/userAirport error catch: ", error.response.data, error.config.url));
    })

module.exports = eventRouter