const express = require('express');
const eventService = require('./event-service');
const timeout = require('connect-timeout');
const eventRouter = express.Router();

let extractedEventData = [{test: "test"}];
let userLocation = {
    location: "MSPA-sky"
};

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
                        category: eventData.category,
                        country: eventData.country,
                        description: eventData.description,
                        brand_safe: eventData.brand_safe,
                        location: [eventData.location[1], eventData.location[0]],
                        eventLocationId: '',
                    }
                    extractedEventData.push(eventObj)
                });
                return extractedEventData
            })
            .then(newExtractedEventData => {
                newExtractedEventData.map((eventObj, idx) => {
                    eventService.eventLocation(eventObj.location)
                        .then(response => {
                            eventObj.eventLocationId = response.data.Places[0].PlaceId
                            if (idx === newExtractedEventData.length - 1) {
                                res.json(extractedEventData.filter(obj => obj.eventLocationId !== "this destination has no airports nearby"))
                            }
                        })
                        .catch(error => {
                            eventObj.eventLocationId = "this destination has no airports nearby"
                            if (idx === newExtractedEventData.length - 1) {
                                res.json(extractedEventData.filter(obj => obj.eventLocationId !== "this destination has no airports nearby"))
                            }
                        })
                })
            })
            .catch(error => {
                console.log("error catch: ", error)
            })
    })

eventRouter
    .route('/userLocation')
    .get((req, res) => {
        let userLocation = req.params.query;
        eventService.eventLocation(userLocation)
            .then(res => userLocationData.location = res.data.Places[0].PlaceId)
            .catch(error => {
                console.log("error catch: ", error.response.data)
            })
    })

eventRouter
    .route('/deals')
    .get(timeout("6s"), (req, res) => {

        let filteredEvents = extractedEventData.filter(obj => obj.eventLocationId !== "this destination has no airports nearby");

        new Promise((resolve, reject) => {
            filteredEvents.map((eventInstance, idx) => {
                eventService.flightPrices(eventInstance.eventLocationId, userLocation)
                    .then(eventInstance => {
                        Object.assign(filteredEvents[idx],
                            {price: eventInstance.data.Quotes[0].MinPrice},
                            {direct: eventInstance.data.Quotes[0].Direct},
                            {departure: eventInstance.data.Quotes[0].OutboundLeg},
                            {carriersName: eventInstance.data.Carriers[0].Name},
                        )
                        if (idx === filteredEvents.length - 1) {
                            // console.log("filteredEvents before: ", filteredEvents)
                            filteredEvents = filteredEvents.filter(obj => !!obj.price);
                            // console.log("filteredEvents: ", filteredEvents)
                            resolve()
                        }
                    })
                    .catch(error => console.log(error.response))
            })
        })
            .then(response => res.json(filteredEvents))
    })

module.exports = eventRouter