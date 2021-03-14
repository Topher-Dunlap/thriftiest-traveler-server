const SavedFlightService = {
    getAllSavedFlights(knex, user_id) {
        return knex
            .select('*')
            .from('saved_flights')
            .where('traveler_user', user_id)
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

    deleteSavedFlight(knex, user_id, saved_id) {
        return knex('saved_flights')
        .where({ saved_id })
        .delete()
    },
}

module.exports = SavedFlightService