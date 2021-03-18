
# Thriftiest-Traveler API Docs

## Open Endpoints
Open endpoints require no Authentication.

* [Login](login.md) : `POST /account/auth/login/`
* [Create Account](create.md) : `POST /account/create/`

### Deals and Events
Each endpoint manipulates or displays information from third part APIs that will be
attributed to the User signed in:

* [Events](events.md) : `GET /events/`
* [Deals](deals.md) : `GET /events/deals`

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
* ESLint


## Features
* Express Router
* Unit and Integration testing
* JWT authentication
* Multiple REST API calls


## Authors
* **Topher Dunlap** - ** - Design, server development/testing, styling, deployment and iteration.

