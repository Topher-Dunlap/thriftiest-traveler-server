
# Thriftiest-Traveler API Docs

## Open Endpoints
Open endpoints require no Authentication.

* [Login](login.md) : `POST /account/auth/login/`
* [Create Account](create.md) : `POST /account/create/`

## Endpoints that require Authentication
Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### Deals and Events
Each endpoint manipulates or displays information from third part APIs that will be 
attributed to the User signed in:

* [Events](events.md) : `GET /events/`
* [Deals](deals.md) : `GET /events/deals`
* [User Airport](userAirport.md) : `GET /events/userAirport`

### Saved
Each endpoint is related to the users saved flight deals.
* [Saved GET](savedGet.md) : `GET /events/saved/`
* [Saved POST](savedPost.md) : `POST /events/saved/`
* [Saved DELETE](savedDelete.md) : `DELETE /events/saved/`

## Built With
* Node.js
* Express
* Express Router
* Postgres
* SQL
* Knex
* Postgrator
* Jest
* JWT
* Service Objects
* Morgan


## Features
* Express Router
* Unit and Integration testing
* JWT authentication
* Multiple REST API calls


## Authors
* **Topher Dunlap** - ** - Design, server development/testing, styling, deployment and iteration.

