const axios = require('axios');

const apiToken = process.env.PREDICT_API_TOKEN;
const rapidToken = process.env.X_RAPIDAPI_KEY;

const eventService = {

  predictAPICall() {
    const config = {
      method: 'get',
      url: 'https://api.predicthq.com/v1/events?category=terror&limit=15&relevance=start_around&sort=start',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    };
    return axios(config);
  },

  eventLocationLatLong(input) {
    const config = {
      method: 'get',
      url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?id=${input[0]},${input[1]}-latlong`,
      headers: {
        'x-rapidapi-key': '7d903548abmsh4e854e4b7bab61fp1a3ebcjsnf378b623ea95',
        'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
        useQueryString: 'true',
      },
    };
    return axios(config);
  },

  userAirportLocation(input) {
    const config = {
      method: 'get',
      url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${input}`,
      headers: {
        'x-rapidapi-key': `${rapidToken}`,
        'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
        useQueryString: 'true',
      },
    };
    return axios(config);
  },

  flightPrices(eventLocation, userLocationData) {
    const config = {
      method: 'get',
      url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${userLocationData}/${eventLocation}/anytime?sort=-price&limit=1`,
      headers: {
        'x-rapidapi-key': `${rapidToken}`,
        'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
        useQueryString: 'true',
      },
    };
    return axios(config);
  },

  locationFinder(eventData, res) {
    let idx = 0;
    eventData.forEach((eventObj) => {
      eventService.eventLocationLatLong(eventObj.location)
        .then((response) => {
          eventObj.eventLocationId = response.data.Places[0].PlaceId;
          eventObj.placeName = response.data.Places[0].PlaceName;
          eventObj.countryName = response.data.Places[0].CountryName;
          idx++;
          if (idx === eventData.length - 1) {
            res.json(eventData.filter((obj) => obj.eventLocationId !== 'this destination has no airports nearby'));
          }
        })
        .catch((error) => {
          eventObj.eventLocationId = 'this destination has no airports nearby';
          idx++;
          if (idx === eventData.length - 1) {
            res.json(eventData.filter((obj) => obj.eventLocationId !== 'this destination has no airports nearby'));
          }
        });
    });
  },

};

module.exports = eventService;
