# Deals

Using response data from the events endpoint query this end point makes a request to the 
rapid api to return flight data.

**URL** : `/event/deals/`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Query String Example**

* The base URL for this server is: `https://powerful-ravine-42099.herokuapp.com`.
* The Express Router path is: `/event`.
* The required base query for the Yelp API is `/deals/`.
* Additional query params are optional and for this app include `term` and `offset`.

```json
{
"https://agile-inlet-69276.herokuapp.com/api/searchForm/search?location=Minneapolis&term=&limit=50&offset=800"
}
```
**Filter Examples**

To narrow results or to request more specific data there are filter parameters that can be
included in you search. The parameter `term` indicates what type of business you're looking for.
The parameter `offset` refers to the number of results that are returned in addition to the base number of 25.

```json
{
  "term": "bar",
  "offset": 100
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
"data": "Array(3)",
"0": {"id": "I4mAWCZV5iNL1Rk9fuK9Rg", "alias": "the-pourhouse-minneapolis", "name": "The Pourhouse", "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/UNEnrPTE7w3zREkQwMeR6Q/o.jpg", "is_closed": "false"}
"1": {"id": "PlzHZwoKTKQ4yKSHbmw54A", "alias": "lucky-cricket-saint-louis-park", "name": "Lucky Cricket", "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/NJIpa8-Cp_KKoJs-hEl_FA/o.jpg", "is_closed": "false"}
"2": {"id": "ki0OAKTRUPu"
}
```

## Error Response

**Condition** : If city/area doesn't exist or if other search errors occur.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "error": "Something went wrong. Please try again or pick a different region."
}
```

## Notes

* If there are not enough results return for the first query then another will be made automatically
  made depending on the results available for the current region.
* If no filter is selected for the search query the API will make a general query for surrounding businesses.
