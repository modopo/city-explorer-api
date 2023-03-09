'use strict';

const getWeather = require('./modules/weather')
const getMovies = require('./modules/movies')
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
// app.use(cors());

const PORT = process.env.PORT || 3002;

//Routes
app.get('/', (req, res) => {
  res.status(200).send('Alive!');
});

//Forecast route
app.get('/weather', getWeather);

//Movies route
app.get('/movies', getMovies);

app.get('*', (req, res) => {
  res.send('The resource requested does not exist');
})

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
})

// Listening
app.listen(PORT, () => {
  console.log(`Listening...port ${PORT}`);
})
