const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const dbConfig = require('./config/dbConfig');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', transactionRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});

module.exports = app;