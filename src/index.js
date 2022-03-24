import axios from 'axios';
import './sass/main.scss';
const BASE_URL =
  'https://gateway.marvel.com:443/v1/public/characters?apikey=8ccd59f9d0817709b56fd3bd6b25a9fc';

function fetchHeroes() {
  axios.get(BASE_URL).then(console.log);
}
fetchHeroes();
