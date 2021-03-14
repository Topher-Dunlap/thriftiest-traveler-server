CREATE TABLE traveler_users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);

