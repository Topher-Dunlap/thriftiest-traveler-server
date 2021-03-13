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

    deleteSavedFlight(knex, user_id, id) {
        return knex('saved_flights')
        .where({ id })
        .delete()
    },

}

module.exports = SavedFlightService