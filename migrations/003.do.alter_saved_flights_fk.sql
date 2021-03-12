ALTER TABLE saved_flights
    ADD COLUMN
        traveler_user INTEGER REFERENCES saved_flights(id)
        ON DELETE SET NULL;