// DOM SELECT
const formStart = document.querySelectorAll(".form__start--Player-input");
const btnSubmitFormStart = document.querySelector(".submit__form--start");
const btnCloseModal = document.querySelector(".btn-understand");
const modal = document.querySelector(".modal");
const modalHeader = document.querySelector(".modal-header");
const modalInfo = document.querySelector(".modal-info");
const modalBtn = document.querySelector(".btn-understand");
const modalText = document.querySelector(".small-text");
const overlay = document.querySelector(".overlay");
const attackersInsert = document.querySelector(".attackers");
const defendersInsert = document.querySelector(".defenders");
const formStartDoe = document.querySelectorAll(".row-doe");

// ANNOUCE VAR
let players = [];
console.log(
  playerList
    ? "Connected to the database successfully."
    : "Falied to connect with Database"
);

// function()
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const getPlayer = function () {
  formStart.forEach(function (cur, i) {
    if (cur.value === "") {
      // filter out undefined
      console.log("undefined");
    } else {
      players.push(cur.value);
    }
  });

  // Check if there's even number of players
  if (players.length % 2 !== 0) {
    console.error(`This team is impossible`);
    // notEven();
    notEven();
    return false;
  } else {
    return true;
  }
};

const randomizer = function (array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  console.log("Retruned Array");
  return array;
};

const removeInput = function () {
  formStart.forEach((cur) => {
    cur.value = "";
  });
};

const checkScore = function (arr) {
  const calc = [];
  const playerPerteam = arr.length / 2;
  console.log(playerPerteam);
  arr.forEach(function (cur, i) {
    calc.push(playerList[cur]);
    console.log(calc);
  });

  if (calc.reduce((acc, cur) => acc + cur) % 2 === 0) {
    console.log("Hello");
  } else {
    return "impossible";
  }

  const attackers = calc.slice(0, playerPerteam);
  const defenders = calc.slice(playerPerteam);
  console.log(`Attackers : ${attackers}`);
  console.log(`Defenders : ${defenders}`);
  const attackerScore = attackers.reduce((acc, cur) => acc + cur);
  const defenderScore = defenders.reduce((acc, cur) => acc + cur);
  console.log(attackerScore, defenderScore);
  if (attackerScore === defenderScore) {
    return [attackers, defenders];
  } else {
    return false;
  }
};

const display = function (player, score) {
  const flattedScore = score.flat();
  const playerPerTeam = player.length / 2;
  console.log(flattedScore);
  player.forEach(function (cur, i) {
    const html = `<div class="${
      i >= playerPerTeam ? "attackers" : "defenders"
    }__row ${i >= playerPerTeam ? "attackers" : "defenders"}__row--add">
    <div class="${
      i >= playerPerTeam ? "attackers" : "defenders"
    }--playerName">${cur}</div>
    <div class="${
      i >= playerPerTeam ? "attackers" : "defenders"
    }__row--playerPoints">${flattedScore[i]}</div>
    </div>`;
    if (i >= playerPerTeam) {
      attackersInsert.insertAdjacentHTML("beforeend", html);
    } else {
      defendersInsert.insertAdjacentHTML("beforeend", html);
    }
  });
};

const cancel = function () {
  openModal();
  modalHeader.textContent = `There seems to be an error`;
  modalInfo.innerHTML = `1. Number of players inputted are not even. <br>2. It's impossible. <br>3. We have tried over 200 combinations`;
  modalBtn.textContent = `Close`;
  modalText.textContent = ``;
  players = [];
};

const notEven = function () {
  openModal();
  modalHeader.textContent = `Odd amount of players`;
  modalInfo.innerHTML = `System13 can only randomize if the number of players are <b>Even</b>`;
  modalBtn.textContent = `Close`;
  modalText.textContent = ``;
  players = [];
};

const main = function () {
  let a = false;
  let i = 0;
  let mixed = randomizer(players);
  if (checkScore(mixed) === "impossible") {
    cancel();
    return false;
  }
  while (a === false || i <= 200) {
    console.log("Ttest");
    mixed = randomizer(players);
    a = checkScore(mixed);
    i++;
  }
  display(mixed, a);
  players = [];
};

// Events
formStart.forEach(function (cur, i) {
  const playerNo = `player ${i + 1}`;
  cur.placeholder = playerNo[0].toUpperCase() + playerNo.slice(1);
});

let active = true;

btnSubmitFormStart.addEventListener("click", function (e) {
  e.preventDefault();

  if (active) {
    formStartDoe.forEach((cur) => cur.remove());
    active = false;
    getPlayer() ? main() : cancel();
    removeInput();
  } else {
    cancel();
  }
});

btnCloseModal.addEventListener("click", closeModal);

// FIXME: Make the random button clickable for 1 time
