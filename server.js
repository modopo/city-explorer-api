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
    this.date = ForecastObject.datetime,
    this.description = ForecastObject.weather.description,
    this.high = ForecastObject.high_temp,
    this.low = ForecastObject.low_temp
  }
}

class Movie {
  constructor(MovieObject) {
    this.title = MovieObject.original_title,
    this.overview = MovieObject.overview,
    this.average_votes = MovieObject.vote_average,
    this.total_votes = MovieObject.vote_count,
    this.image_url = MovieObject.poster_path,
    this.popularity = MovieObject.popularity,
    this.released_on = MovieObject.release_date

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

    let weatherData = forecast.data.data.map(info => {
      return new Forecast(info);
    });

    res.send(weatherData);

  } catch (error) {
    next(error);
  }
});

app.get('/movies', async (req, res, next) => {
  try {
    let city = req.query.search;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.THEMOVIEDB_API_KEY}&language=en-US&query=${city}&page=1&include_adult=false`;

    let movies = await axios(url);

    console.log(movies);

    let movieData = movies.data.results.map(movie => {
      return new Movie(movie);
    })

    res.send(movieData);
  
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