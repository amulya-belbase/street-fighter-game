import { animateWelcomeScreen } from "./opening.js";
import { playSound, stopSound } from "./engine/soundHandler.js";
import { selectionMenu } from "./selectionMenu.js";

const for_letters = document.querySelector('img[alt="misc"]');
const welcome_logo = document.querySelector('img[alt="welcome_logo"]');
let bgm = document.querySelector("audio#background-music");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// welcome banner, click eventlistener for audio play
function welcome() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(welcome_logo, 16, 21, 288, 126, 40, 20, 288, 126);
  ctx.drawImage(for_letters, 369, 8, 110, 14, 135, 180, 110, 14);
  window.addEventListener("click", startGame);
}


// starts the opening sequence
function startGame() {
  playSound(bgm);
  animateWelcomeScreen();
  window.addEventListener("click", toStarGame);
  window.removeEventListener("click", startGame);
}

// starts the player selection menu, and destroys the event listener
function toStarGame() {
  stopSound(bgm);
  selectionMenu();
  window.removeEventListener("click", toStarGame);
}

welcome();
