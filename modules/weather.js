'use strict';

const axios = require('axios');
let cache = require('./cache.js');
require('dotenv').config();

async function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHERBIT_API_KEY}&lat=${latitude}&lon=${longitude}&days=5`;
  const timeToCache = 1000 * 60 * 60 * 24 * 5;
  
  let dataToSend;

  
  if (cache[key] && (Date.now() - cache[key].timestamp < timeToCache)) {
    console.log('From weather cache');
    dataToSend = cache[key].data;
  } else {
    console.log('Into weather cache');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(url)
    .then(response => parseWeather(response.data));
    dataToSend = cache[key].data
  }
  
  return dataToSend;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.date = day.datetime;
    this.forecast = day.weather.description;
    this.high = day.high_temp;
    this.low = day.low_temp;
  }
}

module.exports = getWeather;