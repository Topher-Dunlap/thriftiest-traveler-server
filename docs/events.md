# Events

Get a number of events from the Predicthq endpoint. The query amount and API key are set 
in the server request and cannot be altered from this endpoint.

**URL** : `/event/`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Query String Example**

* The base URL for this server is: `https://powerful-ravine-42099.herokuapp.com`.
* The Express Router path is: `/event`.
* The required base query for the event path is `/`.

```json
{
"https://powerful-ravine-42099.herokuapp.com/event/"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
[
  {
    "title": "Shooting in Springfield, United States",
    "description": "A car crashed into the Kum & Go store, after which an armed suspect entered the store and started shooting customers and employees.\n\nWhen officers reached the scene, the suspect shot and killed an officer and injured another one.\n\n3 civilians were also killed in the shooting, while 1 other was critically injured.\n\nThe suspect deceased from an apparent self-inflicted gunshot wound.",
    "brand_safe": false,
    "location": [
      37.210329,
      -93.236762
    ],
    "eventLocationId": "",
    "placeName": "City Unavailable",
    "countryName": "Country Unavailable",
    "carrier": "Carrier unavailable",
    "departure": {
      "DepartureDate": "date n/a"
    }
  },
  {
    "title": "Bombing in Yala, Thailand",
    "description": "While officials were having a meeting on COVID-19, 2 men on a motorcycle tossed a grenade over the fence of the Southern Border Province Administration office in Yala, to draw people to the spot. Then they remotely detonated a car bomb.\n\nOn Saturday, a Facebook account that posts news about the Deep South conflict as well as videos and statements purportedly produced by the Barisan Revolusi Nasional, or BRN, appeared to reference the military operation and warn of an upcoming insurgent attack.\n\nAt least 25 people have been injured in the attack.",
    "brand_safe": false,
    "location": [
      6.529526,
      101.279318
    ],
    "eventLocationId": "NAWT-sky",
    "placeName": "Narathiwat",
    "countryName": "Thailand",
    "carrier": "Carrier unavailable",
    "departure": {
      "DepartureDate": "date n/a"
    }
  }
]
```

## Error Response

**Condition** : If API unable to query the predictHQ API.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "error": "Something went wrong. Please try again or pick a different region."
}
```


