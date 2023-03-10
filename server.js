'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const weather = require('./modules/weather.js');
const movie = require('./modules/movies.js')
const app = express();
app.use(cors());

app.get('/weather', weatherHandler);

app.get('/movies', movieHandler);

app.get('*', (req, res) => {
  res.send('The resource requested does not exist');
})

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
})

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));

function weatherHandler(request, response) {
  const { lat, lon } = request.query;

  weather(lat, lon)
  .then(forecast => response.send(forecast).status(200))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong!')
  });
}

function movieHandler(request, response) {
  const search = request.query.search;

  movie(search)
  .then(movies => response.send(movies).status(200))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong!')
  });
}