import './sass/main.scss';
import heroes from './heroes.json';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 500;

const searchHeroEl = document.querySelector('#search-hero');
const heroesListEl = document.querySelector('.heroes-list');
const heroCardEl = document.querySelector('.hero-card');
const opponentCardEl = document.querySelector('.opponent-card');
const searchOpponentBtn = document.querySelector('.search-opponent-btn');
const startBtn = document.querySelector('.start-btn');

searchHeroEl.addEventListener('input', debounce(onHeroSearch, DEBOUNCE_DELAY));
heroesListEl.addEventListener('click', onHeroClick);
searchOpponentBtn.addEventListener('click', onsearchOpponentBtnClick);
startBtn.addEventListener('click', onStartClick);

let query = '';
let heroId = '';
let opponentId = '';

function onHeroSearch(e) {
  query = e.target.value.trim().toLowerCase();
  reset();
  if (query.length === 0) {
    heroesListEl.innerHTML = '';
    return;
  }

  let heroesFiltered = heroesFilter(query);
  markupHeroes(heroesFiltered);
}

function reset() {
  heroCardEl.innerHTML = '';
  opponentCardEl.innerHTML = '';
  searchOpponentBtn.classList.add('hidden');
  startBtn.classList.add('hidden');
}

function heroesFilter(query) {
  const filteredHeroes = heroes.filter(hero => hero.name.toLowerCase().includes(query));
  return filteredHeroes;
}

function markupHeroes(heroes) {
  const markup = heroes
    .map(
      hero =>
        `
        <li data-id=${hero.id} class="heroes-item">
        <img src=${hero.images.sm} alt=${hero.name} class="hero-img"> 
        <div class="hero-descr">
        <h3 class="hero-header">${hero.name}</h3>
        <ul class="hero-stats-list">
        <li class="hero-stats-item">Життя: ${hero.powerstats.power * 10}</li>
        <li class="hero-stats-item">Витривалість: ${hero.powerstats.durability}</li>
        <li class="hero-stats-item">Сила удару: ${hero.powerstats.combat}</li>
        <ul>
        </div>
        </li>`,
    )
    .join('');
  heroesListEl.innerHTML = markup;
}

// markupHeroes(heroes.slice(0, 10));

function onHeroClick(e) {
  e.preventDefault();
  if (e.target.tagName !== 'IMG') return;
  heroCardEl.classList.remove('hidden');
  heroId = e.target.closest('li').dataset.id;
  heroesListEl.innerHTML = '';
  markupHeroCard(heroId);
}

function markupFunc(heroId) {
  const hero = heroes.find(hero => hero.id === +heroId);
  const markup = `<img src=${hero.images.sm} alt=${hero.name} class="hero-card-img" />
            <h3 class="hero-card-name">${hero.name}</h3>
            <ul class="hero-stats-list">
              <li class="hero-stats-item">Життя: ${hero.powerstats.power * 10}</li>
              <li class="hero-stats-item">Витривалість: ${hero.powerstats.durability}</li>
              <li class="hero-stats-item">Сила удару: ${hero.powerstats.combat}</li>
            <ul>
              <ul class="hero-stats-list">
                <li class="hero-stats-item">Стать: ${hero.appearance.gender}</li>
                <li class="hero-stats-item">Раса: ${hero.appearance.race}</li>
                <li class="hero-stats-item">Ріст: ${hero.appearance.height}</li>
                <li class="hero-stats-item">Вага: ${hero.appearance.weight}</li>
              </ul>
              `;
  return markup;
}

function markupHeroCard(heroId) {
  const markup = markupFunc(heroId);
  searchOpponentBtn.classList.remove('hidden');
  heroCardEl.innerHTML = markup;
}

function onsearchOpponentBtnClick() {
  opponentCardEl.classList.remove('hidden');
  changeOpponent();
}

function changeOpponent() {
  let i = 0;
  const intervalId = setInterval(() => {
    let id = randomNumber();
    i += 1;
    renderOpponent(id);

    if (i === 10) {
      clearInterval(intervalId);
      markupOpponentCard();
    }
  }, 200);
}

function randomNumber() {
  return Math.floor(Math.random() * heroes.length + 1);
}

function renderOpponent(id) {
  const hero = heroes.find(hero => hero.id === +id);
  if (!hero) return;
  const markup = `<img src=${hero.images.sm} alt=${hero.name} class="hero-card-img" />`;
  opponentCardEl.innerHTML = markup;
}

function markupOpponentCard() {
  opponentId = randomNumber();
  const markup = markupFunc(opponentId);
  opponentCardEl.innerHTML = markup;
  startBtn.classList.remove('hidden');
}

function onStartClick() {
  console.log(heroId);
  console.log(opponentId);
  searchHeroEl.setAttribute('disabled', 'disabled');
}

console.log(heroes[0]);
