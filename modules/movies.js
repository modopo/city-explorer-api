'use strict';

const axios = require('axios');
let cache = require('./cache.js');

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

async function getMovies(search) {
  const key = search;
  const timeToCache = 1000 * 60 * 60 * 24 * 365 * 5;
  
  let dataToSend;  
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.THEMOVIEDB_API_KEY}&query=${search}&language=en-US&include_adult=false&page=1`

  if (cache[key] && (Date.now() - cache[key].timestamp < timeToCache)) {
    console.log('From movie cache');
    dataToSend = cache[key].data;
  } else {
    console.log('Into movie cache');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(url)
    .then(response => parseMovie(response.data.results));
    dataToSend = cache[key].data
  }
  
  return dataToSend;
}

function parseMovie(movieData) {
  try {
    const movies = movieData.map(movie => {
      return new Movie(movie);
    });
    return Promise.resolve(movies);
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = getMovies;