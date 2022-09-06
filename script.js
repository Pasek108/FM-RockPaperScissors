"use strict";

const picks = ["paper", "scissors", "rock", "lizard", "spock"];
const counters = [
  [0, -1, 1, -1, 1],
  [1, 0, -1, 1, -1],
  [-1, 1, 0, 1, -1],
  [1, -1, -1, 0, 1],
  [-1, 1, 1, -1, 0],
];

/* ------------------------- score init ------------------------- */
if (localStorage.getItem("state") == null) {
  const state = {
    gamemode: "normal",
    normal: 0,
    bonus: 0,
  };

  localStorage.setItem("state", JSON.stringify(state));
}

/* ------------------------- game load ------------------------- */
const init_state = JSON.parse(localStorage.getItem("state"));
let gamemode = init_state.gamemode;
let score = init_state[gamemode];

const score_container = document.querySelector(".score .number");
score_container.innerText = score;

/* ------------------------- change game ------------------------- */
const change_game = document.querySelector(".change-game");
change_game.addEventListener("click", changeGame);

function changeGame() {
  document.body.classList.toggle("normal");
  document.body.classList.toggle("bonus");

  const state = JSON.parse(localStorage.getItem("state"));
  state.gamemode = document.body.className;
  state[gamemode] = score;

  localStorage.setItem("state", JSON.stringify(state));

  gamemode = document.body.className;
  score = state[gamemode];
  score_container.innerText = score;

  backToPickMenu();
}

/* ------------------------- rules ------------------------- */
const rules = document.querySelector(".rules-wrapper");

const rules_button = document.querySelector(".rules-button");
rules_button.addEventListener("click", toggleRules);

const close_rules = document.querySelector(".rules .close");
close_rules.addEventListener("click", toggleRules);

function toggleRules() {
  rules.classList.toggle("hidden");
}

/* ------------------------- game ------------------------- */
const pick_menu = document.querySelector(".pick-menu");
const pick_options = {
  normal: document.querySelectorAll(".pick-menu .normal .pick-option"),
  bonus: document.querySelectorAll(".pick-menu .bonus .pick-option"),
};

const result = document.querySelector(".result");
const player_pick = result.querySelector(".player-pick .pick");
const enemy_pick = result.querySelector(".enemy-pick .pick");

const verdict = result.querySelector(".verdict");
const verdict_text = verdict.querySelector(".text");
const play_again = verdict.querySelector(".play-again");

addPickListeners(pick_options.normal);
addPickListeners(pick_options.bonus);

function addPickListeners(pick_options) {
  for (let i = 0; i < pick_options.length; i++) {
    pick_options[i].addEventListener("click", () => {
      const pick_type = pick_options[i].classList[1];

      pick_menu.classList.add("hidden");
      player_pick.classList.add(pick_type);
      result.classList.remove("hidden");

      setTimeout(() => {
        const enemy = (Math.random() * pick_options.length) | 0;
        enemy_pick.classList.add(picks[enemy]);

        switch (counters[picks.indexOf(pick_type)][enemy]) {
          case -1:
            verdict_text.innerText = "YOU LOSE";
            enemy_pick.classList.add("win");
            break;
          case 0:
            verdict_text.innerText = "DRAW";
            break;
          case 1:
            verdict_text.innerText = "YOU WIN";
            player_pick.classList.add("win");
            break;
        }

        score += counters[picks.indexOf(pick_type)][enemy];
        score_container.innerText = score;

        const state = JSON.parse(localStorage.getItem("state"));
        state[gamemode] = score;

        localStorage.setItem("state", JSON.stringify(state));

        setTimeout(() => verdict.classList.remove("hidden"), 250);
      }, 500);
    });
  }
}

play_again.addEventListener("click", backToPickMenu);

function backToPickMenu() {
  player_pick.className = "pick";
  enemy_pick.className = "pick";
  pick_menu.classList.remove("hidden");
  result.classList.add("hidden");
  verdict.classList.add("hidden");
}

if (gamemode != "normal") changeGame();
