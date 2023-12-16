import { animateWelcomeScreen } from "./opening.js";
import { playSound, stopSound } from "./engine/soundHandler.js";
import { selectionMenu } from "./selectionMenu.js";

let bgm = document.querySelector('audio#background-music');


export function startGame(){
  window.addEventListener("load", function () {
    playSound(bgm);
    animateWelcomeScreen();
    window.addEventListener('click', function (){
      stopSound(bgm);
    selectionMenu();
  }, {once: true});
});
}
startGame();


