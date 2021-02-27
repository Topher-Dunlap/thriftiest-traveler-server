const express = require('express');
const { PORT } = require('./config')
const app = express();

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));

module.exports = {app};