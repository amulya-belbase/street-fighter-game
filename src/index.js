import { StreetFighterGame } from "./StreetFighterGame.js";
import { animateWelcomeScreen } from "./opening.js";
import { playSound, stopSound } from "./engine/soundHandler.js";

let bgm = document.querySelector('audio#background-music');


export function startGame(){
  // playSound(bgm);
window.addEventListener("load", function () {
  window.addEventListener('click', function (){
    stopSound(bgm);
    // toStart();
    new StreetFighterGame().start();
  }, {once: true});
});
}
startGame();

// export function toStart(){
// }
