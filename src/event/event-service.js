const axios = require('axios')
const apiToken = process.env.PREDICT_API_TOKEN;

const eventService = {

    predictAPICall() {
        const config = {
            method: 'get',
            url: `https://api.predicthq.com/v1/events?category=terror&limit=5&relevance=start_around&sort=start`,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
        };
        return axios(config)
    },

    eventLocationLatLong(input) {
        //working url example **DELETE** https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?id=47.260326,-1.577128-latlong
        const config = {
            method: 'get',
            url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?id=${input[0]},${input[1]}-latlong`,
            headers: {
                'x-rapidapi-key': '7d903548abmsh4e854e4b7bab61fp1a3ebcjsnf378b623ea95',
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'useQueryString': 'true'
            },
        }
        return axios(config)
    },

    userAirportLocation(input) {
        //working url example **DELETE** https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?id=47.260326,-1.577128-latlong
        const config = {
            method: 'get',
            url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${input}`,
            headers: {
                'x-rapidapi-key': '7d903548abmsh4e854e4b7bab61fp1a3ebcjsnf378b623ea95',
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'useQueryString': 'true'
            },
        }
        return axios(config)
    },

    flightPrices(eventLocation, userLocationData) {
        //working url example **DELETE** https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/SFO-sky/JFK-sky/2021-04-01?sort=-price&limit=1
        const config = {
            method: 'get',
            url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${userLocationData}/${eventLocation}/anytime?sort=-price&limit=1`,
            headers: {
                'x-rapidapi-key': '7d903548abmsh4e854e4b7bab61fp1a3ebcjsnf378b623ea95',
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'useQueryString': 'true'
            },
        };
        return axios(config)
    },

    flightPricesConditional(idx, array, promiseResolve) {
        if (idx === array.length - 1) {
            array = array.filter(obj => !!obj.price);
            return promiseResolve();
        }
    },

}

module.exports = eventService;