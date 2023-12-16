import { registerKeyboardEvent } from "./engine/InputHandler.js";
import { getContext } from "./utils/context.js";
import { BattleScene } from "./scenes/BattleScene.js";
import { HEALTH_MAX_HIT_POINTS } from "./constants/battle.js";
import { gameState } from "./selectionMenu.js";


const for_letters = document.querySelector('img[alt="misc"]');
const for_characters = document.querySelector('img[alt="character_selection"]');


export let canvas_window = false;
let array = [];
export class StreetFighterGame {
  context = getContext();
  frameTime = {
    previous: 0,
    secondsPassed: 0,
  };
  
  constructor() {
    this.scene = new BattleScene();
  }

  frame(time) {
    if (!canvas_window) {
      window.requestAnimationFrame(this.frame.bind(this));

      this.frameTime = {
        secondsPassed: (time - this.frameTime.previous) / 1000,
        previous: time,
      };
      this.scene.update(this.frameTime, this.context);
      this.scene.draw(this.context);
    } 
    else {
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
    }
  }

  start() {
    registerKeyboardEvent();
    window.requestAnimationFrame(this.frame.bind(this));
  }


  end(winnerName,loserName,thisInstance) {
    canvas_window = true;
    getWinner(this.context,winnerName);
    getLoser(this.context, loserName);
    resetGame(thisInstance);
  }
}

function resetGame(thisInstance){
  thisInstance.koFrame = 0;
  thisInstance.koAnimationTimer = 0;
  thisInstance.time = 99;
  for (let i = 0; i < gameState.fighters.length; i++) {
    gameState.fighters[i].score = 1;
    gameState.fighters[i].hitPoints = HEALTH_MAX_HIT_POINTS;
  }
  thisInstance.healthBars = [
    {
      timer: 0,
      hitPoints: HEALTH_MAX_HIT_POINTS,
    },
    {
      timer: 0,
      hitPoints: HEALTH_MAX_HIT_POINTS,
    },
  ];

}


function getWinner(context, winnerName) {
  const winner = winnerName.toLowerCase();
  switch (winner) {
    case "ryu":
      context.drawImage(for_characters, 131, 1, 128, 112, 10, 10, 128, 112);     // winner picture
      context.drawImage(for_letters, 16, 56, 28, 9,context.canvas.width/2 - 10, 66, 28, 9);      // winner name
      getLetters(context);    // for_characters words (WINS)
      return;
      
    case "ken":
      context.drawImage(for_characters, 131, 114, 128, 112, 10, 10, 128, 112);   
      context.drawImage(for_letters, 128, 56, 30, 9, context.canvas.width/2 - 10, 66, 28, 9);
      getLetters(context);
      return;

    case "sagat":
      context.drawImage(for_characters, 228,1092,128,103, 10, 10, 128, 112);   
      context.drawImage(for_letters, 216,72,47,9, context.canvas.width/2 - 20, 66, 47, 9);
      getLetters(context);
      return;

    case "guile":
    context.drawImage(for_characters, 131,642,128,112, 10, 10, 128, 112);   
    context.drawImage(for_letters, 88,72,42,9, context.canvas.width/2 - 15, 66, 42, 9);
    getLetters(context);
    return;
    }
}

function getLoser(context, loserName) {
  const loser = loserName.toLowerCase();
  switch (loser) {
    case "ryu":
      context.drawImage(for_characters, 260, 1, 128, 112, context.canvas.width - 122, 10, 128, 112);   // loser picture
      return;

    case "ken":
      context.drawImage(for_characters, 260, 114, 128, 112, context.canvas.width - 122, 10, 128, 112);
      return;

    case "sagat":
      context.drawImage(for_characters, 357,1092,128,103, context.canvas.width - 122, 10, 128, 112);
      return;
    
    case "guile":
      context.drawImage(for_characters, 587,642,108,112, context.canvas.width - 122, 10, 108, 112);
      return;
    }
  }
    
    function getLetters(context){
      context.drawImage(for_letters, 101, 125, 10, 10, context.canvas.width/2 - 15, 80, 10, 10);      // W
      context.drawImage(for_letters, 125, 113, 9, 10, context.canvas.width/2 - 5, 80, 9, 10);         // I
      context.drawImage(for_letters, 185, 113, 11, 10, context.canvas.width/2 + 4, 80, 11, 10);       // N
      context.drawImage(for_letters, 53, 125, 10, 10, context.canvas.width/2 + 15, 80, 10, 10);       // S
      
      // CONTINUE? PRESS START
      context.drawImage(for_letters, 386, 41, 93, 14, context.canvas.width/2 - 100, 200, 93, 14);
      context.drawImage(for_letters, 369, 8, 110, 14, context.canvas.width/2, 200, 110, 14);
      
      // YOU
      context.drawImage(for_letters, 125, 125, 10, 10, 40, 140, 40, 40);
      context.drawImage(for_letters, 197, 113, 10, 10, 80, 140, 40, 40);
      context.drawImage(for_letters, 77, 125, 10, 10, 120, 140, 40, 40);
      
      //SUCK
      context.drawImage(for_letters, 53, 125, 10, 10, 170, 140, 40, 40);
      context.drawImage(for_letters, 77, 125, 10, 10, 210, 140, 40, 40);
      context.drawImage(for_letters, 53, 113, 10, 10, 250, 140, 40, 40);
      context.drawImage(for_letters, 149, 113, 10, 10, 290, 140, 40, 40);
      context.drawImage(for_letters, 22,89,3,10, 335, 140, 10, 40);
    }
    
    // RESTARTS THE GAME 
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    canvas_window = false;
    const newI = new StreetFighterGame();
    newI.start();
  }
});