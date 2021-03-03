const express = require('express');
const eventService = require('./event-service');
const timeout = require('connect-timeout');
const eventRouter = express.Router();

let extractedEventData = [];

eventRouter
    .route('/')
    .get( (req, res) => {
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
                        location: [eventData.location[1], eventData.location[0]], ///values in location array need to be swapped for skyscanner GET
                        placeId: '',
                    }
                    eventService.eventLocation(eventObj.location)
                        .then(response => {
                            eventObj.placeId = response.data.Places[0].PlaceId
                        })

                        .catch(error => {
                        //     res.status(404)
                        //     return res.send({error: "unable to get event locations"})
                            console.dir(error)
                        })
                    extractedEventData.push(eventObj)

                });

                res.send(extractedEventData)
            })
            .catch(error => {
                // res.status(404)
                // return res.send({error: "unable to get events"})
                console.dir(error)
            })
    })

// eventRouter
//     .route('/eventLocation')
//     .get(timeout("6s"), (req, res) => {
//         console.dir("eventLocation GET", extractedEventData)
//         extractedEventData.map(eventInstance =>
//             ///extractedEventData **possible put it in a function**
//             eventService.eventLocation(eventInstance.location)
//                 .then(response => {
//                     console.log("response data: ", response.data)
//                     eventInstance.placeId = response.data.Places.PlaceId
//
//                 })
//                 .catch(error => res.status(404).send({error: "unable to get event locations"}))
//         )
//     })


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