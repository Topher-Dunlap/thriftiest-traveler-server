ALTER TABLE saved_flights
    ADD COLUMN
        traveler_user INTEGER REFERENCES traveler_users(id)
        ON DELETE SET NULL;