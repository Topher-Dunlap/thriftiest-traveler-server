const express = require('express');
const eventService = require('./event-service');
const timeout = require('connect-timeout');
const eventRouter = express.Router();

let extractedEventData = [];

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
                eventsArray.forEach(eventData => {
                    let eventObj = {
                        title: eventData.title,
                        category: eventData.category,
                        country: eventData.country,
                        description: eventData.description,
                        brand_safe: eventData.brand_safe,
                        location: eventData.location,
                        placeId: '',
                    }
                    extractedEventData.push(eventObj)
                });
                console.log("extractedEventData pre promise.all: ", extractedEventData)
                Promise.all([extractedEventData])
                    .then((extractedEventArray) => {
                        // console.log("promise.all extractedEventArray: ", extractedEventArray.location)
                            extractedEventArray.map(eventObj =>
                            // console.log("eventObj.location: ", eventObj.location),
                            eventService.eventLocation(eventObj.location)
                                .then(response => {
                                    console.log("response.data: ", response.data.Places[0].PlaceId)
                                    eventObj.placeId = response.data.Places[0].PlaceId
                                })
                                .catch(error => {
                                    console.dir(error)
                                })
                        )
                        console.log("appended res obj: ", extractedEventArray)
                    });
            })
            .catch(error => {
                console.dir(error)
            })
        res.send(extractedEventData)
    })

eventRouter
    .route('/deals')
    .get(timeout("6s"), (req, res) => {
        ///set user location
        const userLocationData = {
            location: req.query.userlocation
        }

        extractedEventData.map((eventInstance, idx) =>
            eventService.flightPrices(extractedEventData, userLocationData)
                .then(function (eventInstance) {

                    let price = eventInstance.data.Quotes.MinPrice;
                    let direct = eventInstance.data.Quotes.Direct;
                    let departureDate = eventInstance.data.Quotes.OutboundLeg.DepartureDate;
                    let carriersName = eventInstance.data.Carriers.Name;
                    let places = eventInstance.data.Places;

                    Object.assign(extractedEventData[idx],
                        {price: price},
                        {direct: direct},
                        {departureDate: departureDate},
                        {carriersName: carriersName},
                        {places: places},
                    )
                })
                .catch(function (error) {
                    res.status(404).send({error: "unable to get event locations"});
                })
        )
        res.send(extractedEventData)
    })


module.exports = eventRouter