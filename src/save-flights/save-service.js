const SavedFlightService = {
    getAllSavedFlights(knex, id) {
        return knex
            .select('*')
            .from('saved_flights')
            .where('traveler_user', id)
    },

    insertFlight(knex, newFlight) {
        return knex
            .insert(newFlight)
            .into('saved_flights')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('saved_flights')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteSavedFlight(knex, id) {return knex('saved_flights')
        .where({ id })
        .delete()
    },

}

module.exports = SavedFlightService