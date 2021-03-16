CREATE TABLE IF NOT EXISTS saved_flights (
    id integer primary key generated always as identity,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    place_name TEXT NOT NULL,
    country_name TEXT NOT NULL,
    price TEXT NOT NULL,
    carrier TEXT NOT NULL,
    departure TEXT NOT NULL,
    traveler_user INTEGER REFERENCES traveler_users(id)
);
