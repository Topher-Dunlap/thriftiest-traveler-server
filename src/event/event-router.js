const express = require('express');
const eventService = require('./event-service');
const timeout = require('connect-timeout');
const eventRouter = express.Router();

let extractedEventData = [{test: "test"}];
let userAirport = '';

eventRouter
    .route('/')
    .get((req, res) => {
        eventService.predictAPICall()
            .then(response => {
                ///make initial event data
                const eventResString = (JSON.stringify(response.data));
                const eventResParse = (JSON.parse(eventResString));
                ///data coming back as JSO already so may not need to do stringify and parse
                let eventsArray = eventResParse.results
                extractedEventData = []
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
                let idx = 0;
                newExtractedEventData.forEach(eventObj => {
                    eventService.eventLocationLatLong(eventObj.location)
                        .then(response => {
                            eventObj.eventLocationId = response.data.Places[0].PlaceId;
                            eventObj.placeName = response.data.Places[0].PlaceName;
                            eventObj.countryName = response.data.Places[0].CountryName;
                            idx++;
                            if (idx === newExtractedEventData.length - 1) {
                                res.json(extractedEventData.filter(obj => obj.eventLocationId !== "this destination has no airports nearby"));
                            }
                        })
                        .catch(error => {
                            eventObj.eventLocationId = "this destination has no airports nearby";
                            idx++;
                            if (idx === newExtractedEventData.length - 1) {
                                res.json(extractedEventData.filter(obj => obj.eventLocationId !== "this destination has no airports nearby"));
                            }
                        })
                })
            })
            .catch(error => {
                console.log("/ error catch: ", error);
            })
    })

eventRouter
    .route('/deals')
    .get((req, res) => {
        let filteredEvents = extractedEventData;
        new Promise((resolve, reject) => {
            let idx = 0;
            filteredEvents.forEach(eventInstance => {
                eventService.flightPrices(eventInstance.eventLocationId, userAirport)
                    .then(eventInstance => {
                        // console.log("eventInstance: ", idx, eventInstance.data)
                        if (eventInstance.data.Quotes.length > 0) {
                            // console.log("idx inside API call, IF: ", idx)
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
                    .catch(error => console.log("/deals error catch", error));
            })
        })
            .then(response => {
                console.log("last filteredEvents: ", filteredEvents)
                res.json(filteredEvents)
            })
    })

eventRouter
    .route('/userAirport')
    .get((req, res) => {
        let userCity = req.query.userCity;
        eventService.userAirportLocation(userCity)
            .then(locationResponse => {
                userAirport = locationResponse.data.Places[0].PlaceId;
            })
            .catch(error => console.log("/userAirport error catch: ", error.response.data, error.config.url));
    })

module.exports = eventRouter