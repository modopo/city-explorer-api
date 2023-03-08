'use strict';

const axios = require('axios');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

//Forecast class to contain weather data
class Forecast {
  constructor(ForecastObject) {
    this.date = ForecastObject.datetime;
    this.description = ForecastObject.weather.description;
    this.high = ForecastObject.high_temp;
    this.low = ForecastObject.low_temp
  }
}

//Routes
app.get('/', (req, res) => {
  res.status(200).send('Alive!');
});

app.get('/weather', async (req, res, next) => {
  try {
    let coord = [req.query.lat, req.query.lon];
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&lat=${coord[0]}&lon=${coord[1]}&days=5`

    let forecast = await axios(url);

    console.log(forecast.data.data);

    let weatherData = forecast.data.data.map(info => {
      return new Forecast(info);
    });

    res.send(weatherData);

  } catch (error) {
    next(error);
  }
});

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