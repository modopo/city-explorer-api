'use strict';

const axios = require('axios');

class Forecast {
  constructor(ForecastObject) {
    this.date = ForecastObject.datetime,
    this.description = ForecastObject.weather.description,
    this.high = ForecastObject.high_temp,
    this.low = ForecastObject.low_temp
  }
}

function getForecast (req, res, next) {

  let params = {
    key: process.env.WEATHERBIT_API_KEY,
    lat: req.query.lat,
    lon: req.query.lon,
    days: 5
  }

  let url = 'https://api.weatherbit.io/v2.0/forecast/daily';

  axios.get(url, { params })
    .then(forecast => forecast.data.data.map(info => new Forecast(info)))
    .then(dataToSend => res.send(dataToSend))
    .catch(err => console.error(err));
}

module.exports = getForecast;