'use strict';

const express = require('express');
const cors = require('cors');
const data = require('./data/weather.json');

require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

//Forecast class to contain weather data
class Forecast {
  constructor(ForecastObject) {
    this.date = ForecastObject.datetime;
    this.description = ForecastObject.weather.description
  }
}

//Routes 
app.get('/weather', (req, res, next) => {
  try {
    let cityReq = req.query.searchQuery;

    let city = data.find(cityData => {
      return cityData.city_name === cityReq;
    })

    let weatherData = city.data.map(info => {
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

// Listening
app.listen(PORT, () => {
  console.log(`Listening...port ${PORT}`);
})