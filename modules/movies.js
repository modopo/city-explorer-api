'use strict'

const axios = require('axios');

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

function getMovies(req, res, next) {
  let params = {
    api_key: process.env.THEMOVIEDB_API_KEY,
    language: 'en-US',
    query: req.query.search,
    page: 1,
    include_adult: false,
  }

  let url = "https://api.themoviedb.org/3/search/movie";

  axios.get(url, { params })
    .then(movieData => movieData.data.results.map(movie => new Movie(movie)))
    .then(dataToSend => res.send(dataToSend))
    .catch(err => console.error(err));
}

module.exports = getMovies;