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
                return extractedEventData
            })
            .then(extractedEventData => {
                extractedEventData.map(async eventObj =>
                    await eventService.eventLocation(eventObj.location)
                        .then(response => {
                            eventObj.placeId = response.data.Places[0].PlaceId
                        })
                        .catch(error => {
                            eventObj.placeId = "this destination has no airports nearby"
                        })
                )
            })
            .catch(error => {
                console.log("error catch: ", error)
            })
        res.json(extractedEventData)
    })

eventRouter
    .route('/deals')
    .get(timeout("6s"), (req, res) => {
        ///set user location
        // const userLocationData = {
        //     location: req.query.userlocation
        // }


        ///set user location
        const userLocationData = {
            location: "minneapolis"
        };
        ///filter events of places with no airports
        extractedEventData.filter(obj => obj.placeId !== "this destination has no airports nearby");
        ///find flight information for event locations
        extractedEventData.map((eventInstance, idx) =>
            eventService.flightPrices(extractedEventData, userLocationData)
                .then(eventInstance => {
                    Object.assign(extractedEventData[idx],
                        {price: eventInstance.data.Quotes.MinPrice},
                        {direct: eventInstance.data.Quotes.Direct},
                        {departureDate: eventInstance.data.Quotes.OutboundLeg.DepartureDate},
                        {carriersName: eventInstance.data.Carriers.Name},
                        {places: eventInstance.data.Places},
                    )
                    console.log("eventInstance: ", extractedEventData[idx])
                })
                .catch(function (error) {
                    // res.status(404).send({error: "unable to get event locations"});
                    console.log(error)
                })
        )
        res.json(extractedEventData)
    })


module.exports = eventRouter