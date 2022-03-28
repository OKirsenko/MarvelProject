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
const headerEl = document.querySelector('.header');
const fightBtnEl = document.querySelector('.fight-btn-wrap');
const heroStat = document.querySelector('.hero-stat-list');
const opponentStat = document.querySelector('.opponent-stat-list');

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
              <li class="hero-stats-item power" data-power=${
                hero.powerstats.power * 10
              }>Життя: <span class="power-span">${hero.powerstats.power * 10}</span></li>
              <li class="hero-stats-item durability" data-durability=${
                hero.powerstats.durability
              } >Витривалість: <span class="durability-span">${
    hero.powerstats.durability
  }</span></li>
              <li class="hero-stats-item combat" data-combar=${
                hero.powerstats.combat
              }>Сила удару: <span class="combat-span">${hero.powerstats.combat}</span></li>
            </ul>
              <ul class="hero-stats-list">
                <li class="hero-stats-item">Стать: ${hero.appearance.gender}</li>
                <li class="hero-stats-item">Раса: ${hero.appearance.race}</li>
                <li class="hero-stats-item">Ріст: ${hero.appearance.height[1]}</li>
                <li class="hero-stats-item">Вага: ${hero.appearance.weight[1]}</li>
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
  searchOpponentBtn.classList.add('hidden');
  startBtn.classList.add('hidden');
  headerEl.classList.add('hidden');
  fightBtnEl.classList.remove('hidden');
  // const x = heroCardEl.querySelector('.power');
  // console.log(x);
  // console.log(x.dataset.power);
  // const y = x.querySelector('span');
  // y.textContent = 'abv';
  fightFunc();
}

function fightFunc() {
  // const hitBtn = fightBtnEl.querySelector('.hit-btn');
  // const blockBtn = fightBtnEl.querySelector('.block-btn');
  // const evasionBtn = fightBtnEl.querySelector('.evasion-btn');
  // hitBtn.addEventListener('click', onHitClick);
  // blockBtn.addEventListener('click', onBlockClick);
  // evasionBtn.addEventListener('click', onEvasionClick);

  fightBtnEl.addEventListener('click', onFightClick);
}

function onFightClick(e) {
  const refs = {
    opponentAction: randomAction(),
    heroPower: heroCardEl.querySelector('.power-span'),
    heroDurability: heroCardEl.querySelector('.durability-span'),
    heroCombat: heroCardEl.querySelector('.combat-span'),
    opponentPower: opponentCardEl.querySelector('.power-span'),
    opponentDurability: opponentCardEl.querySelector('.durability-span'),
    opponentCombat: opponentCardEl.querySelector('.combat-span'),
    randomBoolean: Math.random() < 0.4,
  };

  switch (e.target.textContent) {
    case 'УДАР':
      onHitClick(refs);
      break;
    case 'БЛОК':
      onBlockClick(refs);
      break;
    case 'УХИЛЕННЯ':
      onEvasionClick(refs);
      break;

    default:
      break;
  }
}

function onHitClick(refs) {
  const {
    opponentAction,
    heroPower,
    heroDurability,
    heroCombat,
    opponentCombat,
    opponentPower,
    opponentDurability,
    randomBoolean,
  } = refs;
  let heroC = '';
  let heroDur = '';
  let opC = '';
  let opDur = '';

  switch (opponentAction) {
    case 'hit':
      opC = +opponentCombat.textContent / 2;
      heroC = +heroCombat.textContent / 2;
      heroPower.textContent = Math.floor(+heroPower.textContent - opC);
      opponentPower.textContent = Math.floor(+opponentPower.textContent - heroC);
      markupStat('Удар', opC, 0, 'Удар', heroC, 0);
      break;
    case 'block':
      heroDur = Math.floor(+heroDurability.textContent * 0.1);
      heroC = +heroCombat.textContent / 5;
      heroDurability.textContent = Math.floor(+heroDurability.textContent - heroDur);
      opponentPower.textContent = Math.floor(+opponentPower.textContent - heroC);
      markupStat('Удар', 0, heroDur, 'Блок', heroC, 0);
      break;
    case 'evasion':
      heroDur = Math.floor(+heroDurability.textContent * 0.05);
      heroC = +heroCombat.textContent;
      heroDurability.textContent = Math.floor(+heroDurability.textContent - heroDur);
      if (randomBoolean) opponentPower.textContent = Math.floor(+opponentPower.textContent - heroC);

      markupStat('Удар', 0, heroDur, 'Ухилення', heroC, 0);
      break;
    default:
      break;
  }
}

function onBlockClick(refs) {
  const {
    opponentAction,
    heroPower,
    heroDurability,
    heroCombat,
    opponentCombat,
    opponentPower,
    opponentDurability,
    randomBoolean,
  } = refs;
  switch (opponentAction) {
    case 'hit':
      opponentDurability.textContent = Math.floor(
        +opponentDurability.textContent - +opponentDurability.textContent * 0.1,
      );
      heroPower.textContent = Math.floor(+heroPower.textContent - +opponentCombat.textContent / 5);
      break;
    case 'block':
      break;
    case 'evasion':
      opponentDurability.textContent = Math.floor(
        +opponentDurability.textContent - +opponentDurability.textContent * 0.05,
      );
      break;

    default:
      break;
  }
}

function onEvasionClick(refs) {
  const {
    opponentAction,
    heroPower,
    heroDurability,
    heroCombat,
    opponentCombat,
    opponentPower,
    opponentDurability,
    randomBoolean,
  } = refs;
  switch (opponentAction) {
    case 'hit':
      opponentDurability.textContent = Math.floor(
        +opponentDurability.textContent - +opponentDurability.textContent * 0.05,
      );
      if (randomBoolean) {
        heroPower.textContent = Math.floor(+heroPower.textContent - +opponentCombat.textContent);
      }
      break;
    case 'block':
      break;
    case 'evasion':
      opponentDurability.textContent = Math.floor(
        +opponentDurability.textContent - +opponentDurability.textContent * 0.05,
      );
      heroDurability.textContent = Math.floor(
        +heroDurability.textContent - +heroDurability.textContent * 0.05,
      );
      break;

    default:
      break;
  }
}

function randomAction() {
  const actions = ['hit', 'block', 'evasion'];
  const i = Math.floor(Math.random() * actions.length);
  return actions[i];
}

console.log(heroes[0]);

function markupStat(heroAction, heroDem, heroDur, opAction, opDem, opDur) {
  console.log('i');
  const markupHero = `<li>${heroAction}| -${heroDem}| -${heroDur}</li>`;
  const markupOpponent = `<li>${opAction}| -${opDem}| -${opDur}</li>`;
  heroStat.insertAdjacentHTML('beforeend', markupHero);
  opponentStat.insertAdjacentHTML('beforeend', markupOpponent);
}
