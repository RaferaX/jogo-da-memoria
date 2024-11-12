const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');
const rankingContainer = document.querySelector('.ranking'); 
const characters = [
  'bulbasaur',
  'ivysaur',
  'venusaur',
  'charmander',
  'charmeleon',
  'charizard',
  'squirtle',
  'wartortle',
  'blastoise',
  'caterpie',
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let firstCard = '';
let secondCard = '';

const saveTime = (playerName, timeInSeconds) => {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

  ranking.push({ name: playerName, time: timeInSeconds });
  ranking.sort((a, b) => a.time - b.time);

  if (ranking.length > 5) ranking.pop();

  localStorage.setItem('ranking', JSON.stringify(ranking));
};

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
  const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const displayRanking = () => {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  rankingContainer.innerHTML = '<h2>Ranking</h2>';

  ranking.forEach((entry, index) => {
    rankingContainer.innerHTML += `<p>${index + 1}. ${entry.name}: ${formatTime(entry.time)}</p>`;
  });
};


const resetRanking = () => {
  localStorage.removeItem('ranking'); 
  displayRanking(); 
  alert('Ranking resetado com sucesso!');
};

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === 20) {
    clearInterval(this.loop);

    const playerName = spanPlayer.innerHTML;
    const [minutes, seconds] = timer.innerHTML.split(':').map(Number);
    const timeInSeconds = minutes * 60 + seconds;

    saveTime(playerName, timeInSeconds);

    alert(`Parabéns, ${playerName}! Seu tempo foi de: ${timer.innerHTML}`);
    displayRanking();
  }
};

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';
    }, 500);
  }
};

const revealCard = ({ target }) => {
  if (target.parentNode.className.includes('reveal-card')) return;

  if (firstCard === '') {
    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;
  } else if (secondCard === '') {
    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;
    checkCards();
  }
};

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);
  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
};

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
};

const startTimer = () => {
  let seconds = 0;
  let minutes = 0;

  this.loop = setInterval(() => {
    seconds++;

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }

    timer.innerHTML = formatTime(minutes * 60 + seconds);
  }, 1000);
};


window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  startTimer();
  loadGame();
  displayRanking();
};
