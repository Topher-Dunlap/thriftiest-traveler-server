ALTER TABLE saved_flights
    ADD COLUMN
        traveler_user INTEGER REFERENCES traveler_users(user_id)
        ON DELETE SET NULL;