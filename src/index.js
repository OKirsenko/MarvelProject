import axios from 'axios';
import './sass/main.scss';

const BASE_URL = 'https://akabab.github.io/superhero-api/api/all.json';

function fetchHeroes() {
  axios.get(BASE_URL).then(console.log);
}
fetchHeroes();
