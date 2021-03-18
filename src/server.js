const knex = require('knex');
const pg = require('pg');
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

pg.defaults.ssl = process.env.NODE_ENV === 'production';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL,
  },
});

app.set('db', db);

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));

module.exports = { app };
