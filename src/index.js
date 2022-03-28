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
const fightStat = document.querySelector('.fight-stat');
const finalEl = document.querySelector('.final-wrap');
const startEl = document.querySelector('.start-wrap');

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
    startEl.classList.remove('hidden');
    heroesListEl.innerHTML = '';
    return;
  }
  if (query.length > 0) startEl.classList.add('hidden');
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
  searchHeroEl.value = '';
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
  headerEl.classList.add('hidden');

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
  fightBtnEl.classList.remove('hidden');
  fightStat.classList.remove('hidden');
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
  if (+refs.heroPower.textContent <= 0) {
    refs.heroPower.textContent = 0;
    markupFinal('Ти програв!');
  } else if (+refs.opponentPower.textContent <= 0) {
    refs.opponentPower.textContent = 0;
    markupFinal('Ти виграв!');
  }
}

let heroC = '';
let heroDur = '';
let opC = '';
let opDur = '';

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
      opDur = Math.floor(+opponentDurability.textContent * 0.1);
      opC = +opponentCombat.textContent / 5;
      opponentDurability.textContent = Math.floor(+opponentDurability.textContent - opDur);
      heroPower.textContent = Math.floor(+heroPower.textContent - opC);
      markupStat('Блок', opC, 0, 'Удар', 0, opDur);
      break;
    case 'block':
      markupStat('Блок', 0, 0, 'Блок', 0, 0);

      break;
    case 'evasion':
      opDur = Math.floor(+opponentDurability.textContent * 0.05);
      opponentDurability.textContent = Math.floor(+opponentDurability.textContent - opDur);
      markupStat('Блок', 0, 0, 'Ухилення', 0, opDur);

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
      opDur = Math.floor(+opponentDurability.textContent * 0.05);
      opC = +opponentCombat.textContent;
      opponentDurability.textContent = Math.floor(+opponentDurability.textContent - opDur);
      if (randomBoolean) {
        heroPower.textContent = Math.floor(+heroPower.textContent - opC);
      }

      markupStat('Ухилення', opC, 0, 'Удар', 0, opDur);

      break;
    case 'block':
      heroDur = Math.floor(+heroDurability.textContent * 0.05);
      heroDurability.textContent = Math.floor(+heroDurability.textContent - heroDur);
      markupStat('Ухилення', 0, heroDur, 'Блок', 0, 0);

      break;
    case 'evasion':
      opDur = Math.floor(+opponentDurability.textContent * 0.05);
      heroDur = Math.floor(+heroDurability.textContent * 0.05);

      opponentDurability.textContent = Math.floor(+opponentDurability.textContent - opDur);
      heroDurability.textContent = Math.floor(+heroDurability.textContent - heroDur);
      markupStat('Ухилення', 0, heroDur, 'Ухилення', 0, opDur);

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

function markupStat(heroAction, heroDem, heroDur, opAction, opDem, opDur) {
  const markupHero = `<li>${heroAction} | -${heroDem} | -${heroDur}</li>`;
  const markupOpponent = `<li>${opAction} | -${opDem} | -${opDur}</li>`;
  heroStat.insertAdjacentHTML('afterbegin', markupHero);
  opponentStat.insertAdjacentHTML('afterbegin', markupOpponent);
}

function markupFinal(result) {
  fightBtnEl.classList.add('hidden');
  fightStat.classList.add('hidden');
  finalEl.classList.remove('hidden');
  const markup = `<h2 class="final-header">${result}</h2> <button class='again-btn btn'>Грати знову</button>`;
  finalEl.innerHTML = markup;
  const againBtn = finalEl.querySelector('.again-btn');
  againBtn.addEventListener('click', onAgainClick);
}

function onAgainClick() {
  headerEl.classList.remove('hidden');
  startEl.classList.remove('hidden');
  heroCardEl.classList.add('hidden');
  opponentCardEl.classList.add('hidden');
  finalEl.classList.add('hidden');
  heroStat.innerHTML = '';
  opponentStat.innerHTML = '';
}
