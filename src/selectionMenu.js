
import { StreetFighterGame } from "./StreetFighterGame.js";
import { getCharactersArray } from "./state/gameState.js";

const charSelectedOne = document.getElementById("char-selected-one");
const charSelectedTwo = document.getElementById("char-selected-two");
const squares = document.querySelectorAll(".squares");

// We need this to make thr grid move, to know where the selected square is at;
let positionOne = 0;
let positionTwo = 6;
// We need this to know if we are at the top or bottom of the selection grid
let playerOneTopOrBottom = "top";
let playerTwoTopOrBottom = "bottom";

// =================================================================================

const playerOne = document.createElement("img");
const playerTwo = document.createElement("img");

const targetOne = document.querySelector(".selectedNameOne");
const targetTwo = document.querySelector(".selectedNameTwo");
const playerOneName = document.createElement("img");
const playerTwoName = document.createElement("img");

const playerImageMap = {
  "ryu": "images/selection_images/ryu.png",
  "honda": "images/selection_images/honda.png",
  "blanka": "images/selection_images/blanka.png",
  "guile": "images/selection_images/guile.png",
  "balrog": "images/selection_images/balrog.png",
  "vega": "images/selection_images/vega.png",
  "ken": "images/selection_images/ken.png",
  "chunli": "images/selection_images/chunli.png",
  "zangief": "images/selection_images/zangief.png",
  "dhalsim": "images/selection_images/dhalsim.png",
  "sagat": "images/selection_images/sagat.png",
  "bison": "images/selection_images/bison.png",
};


// ==================================== FOR PLAYER ONE ================================

export function selectionMenu(){
    document.getElementById("container").style.display = "flex";
    dynamicChange();
    dynamicChangeTwo();
}



function dynamicChange() {
  new Audio("sounds/move-grid.mp3").play();
  
  playerOne.src = "images/selection_images/selected.png";
  playerOne.classList.add("selectedOne");
  squares[positionOne].appendChild(playerOne);
  
  let charSelectedOneString;
  charSelectedOneString = playerOne.previousSibling.id.replace("grid", "char");
  if(!charSelectedOneString){
    charSelectedOneString = 'char-ryu';
  }
  charSelectedOne.src = `images/selection_images/${charSelectedOneString}.png`;
  
  let name = playerOne.previousSibling.id.split("-")[1]; 
  if(!name){
    name = 'ryu';
  }
  playerOneName.src = playerImageMap[name];
  targetOne.appendChild(playerOneName);
}

let audioOne = null; 

document.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    
    if (!audioOne || audioOne.ended) { // If audio doesn't exist or has ended, play it
      audioOne = new Audio("sounds/selected_sf2.mp3");
      audioOne.play();

      audioOne.addEventListener('ended', () => { // Stop audio when it's finished playing
        audioOne.pause();
        audioOne.currentTime = 0;
      });
    }

    const playerObj= {
      player: 1,
      playerName: playerOne.previousSibling.id.split("-")[1], 
    };
    if(!playerObj.playerName){
      playerObj.playerName = 'ryu';
    }
    positionOne = null;
    confirmPlayer(playerObj);
  }
  if (event.code == "Numpad6") {
    if (positionOne == 5) {
      squares[positionOne].removeChild(document.querySelector(".selectedOne"));
      positionOne = 0;
      charSelectedOne.src = "images/selection_images/char-ryu.png";
      dynamicChange();
      return;
    }

    if (positionOne == 11) {
      squares[positionOne].removeChild(document.querySelector(".selectedOne"));
      positionOne = 6;
      charSelectedOne.src = "images/selection_images/char-ken.png";
      dynamicChange();
      return;
    }

    squares[positionOne].removeChild(document.querySelector(".selectedOne"));

    positionOne++;
    dynamicChange();
  }

  if (event.code == "Numpad4") {
    if (positionOne == 0) {
      squares[positionOne].removeChild(document.querySelector(".selectedOne"));
      positionOne = 5;
      charSelectedOne.src = "images/selection_images/char-vega.png";
      dynamicChange();
      return;
    }

    if (positionOne == 6) {
      squares[positionOne].removeChild(document.querySelector(".selectedOne"));
      positionOne = 11;
      charSelectedOne.src = "images/selection_images/char-bison.png";
      dynamicChange();
      return;
    }

    squares[positionOne].removeChild(document.querySelector(".selectedOne"));
    positionOne--;

    dynamicChange();
  }

  if (event.code == "Numpad8" || event.code == "Numpad2") {
    if (playerOneTopOrBottom == "top") {
      squares[positionOne].removeChild(document.querySelector(".selectedOne"));
      positionOne += 6;
      dynamicChange();
      playerOneTopOrBottom = "bottom";
      return;
    }
    if (playerOneTopOrBottom == "bottom") {
      squares[positionOne].removeChild(document.querySelector(".selectedOne"));
      positionOne -= 6;
      dynamicChange();
      playerOneTopOrBottom = "top";
      return;
    }
  }
});


// ===================================== FOR PLAYER TWO ===============================

function dynamicChangeTwo() {
  new Audio("sounds/move-grid.mp3").play();

  playerTwo.src = "images/selection_images/selected 2p.png";
  playerTwo.classList.add("selectedTwo");
  squares[positionTwo].appendChild(playerTwo);
  
  let charSelectedTwoString;
  charSelectedTwoString = playerTwo.previousSibling.id.replace("grid", "char");
  if(!charSelectedTwoString){
    charSelectedTwoString = 'char-ken';
  }
  charSelectedTwo.src = `images/selection_images/${charSelectedTwoString}.png`;
  
  let name = playerTwo.previousSibling.id.split("-")[1]; 
  if(!name){
    name = 'ken';
  }
  playerTwoName.src = playerImageMap[name];
  targetTwo.appendChild(playerTwoName);  
}

let audioTwo = null; 


document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    // playSound(selected_bgm);
    if (!audioTwo || audioTwo.ended) { 
      audioTwo = new Audio("sounds/selected_sf2.mp3");
      audioTwo.play();

      audioTwo.addEventListener('ended', () => { 
        audioTwo.pause();
        audioTwo.currentTime = 0;
      });
    }
    const playerObj= {
      player: 2,
      playerName: playerTwo.previousSibling.id.split("-")[1], 
    };
    if(!playerObj.playerName){
      playerObj.playerName = 'ken';
    }
    positionTwo = null;
    confirmPlayer(playerObj);
  }
  if (event.code == "KeyL") {
    if (positionTwo == 11) {
      squares[positionTwo].removeChild(document.querySelector(".selectedTwo"));
      positionTwo = 6;
      charSelectedTwo.src = "images/selection_images/char-ken.png";
      dynamicChangeTwo();
      return;
    }

    if (positionTwo == 5) {
      squares[positionTwo].removeChild(document.querySelector(".selectedTwo"));
      positionTwo = 0;
      charSelectedTwo.src = "images/selection_images/char-ryu.png";
      dynamicChangeTwo();
      return;
    }

    squares[positionTwo].removeChild(document.querySelector(".selectedTwo"));

    positionTwo++;
    dynamicChangeTwo();
  }

  if (event.code == "KeyJ") {
    if (positionTwo == 0) {
      squares[positionTwo].removeChild(document.querySelector(".selectedTwo"));
      positionTwo = 5;
      charSelectedTwo.src = "images/selection_images/char-vega.png";
      dynamicChangeTwo();
      return;
    }

    if (positionTwo == 6) {
      squares[positionTwo].removeChild(document.querySelector(".selectedTwo"));
      positionTwo = 11;
      charSelectedTwo.src = "images/selection_images/char-bison.png";
      dynamicChangeTwo();
      return;
    }

    squares[positionTwo].removeChild(document.querySelector(".selectedTwo"));
    positionTwo--;

    dynamicChangeTwo();
  }

  if (event.code == "KeyI" || event.code == "KeyK") {
    if (playerTwoTopOrBottom == "top") {
      squares[positionTwo].removeChild(document.querySelector(".selectedTwo"));
      positionTwo += 6;
      dynamicChangeTwo();
      playerTwoTopOrBottom = "bottom";
      return;
    }
    if (playerTwoTopOrBottom == "bottom") {
      squares[positionTwo].removeChild(document.querySelector(".selectedTwo"));
      positionTwo -= 6;
      dynamicChangeTwo();
      playerTwoTopOrBottom = "top";
      return;
    }
  }

});



// ============================ FOR PLAYERS ARRAY =============================

export let gameState;
const array = [];
function confirmPlayer(player) {
  while (array.length < 2 && !array.includes(player)) {
    array.push(player); 
    if (array.length === 2) {
      document.getElementById("container").style.display = "none";
      gameState = getCharactersArray(array);
      console.log(gameState);
      new StreetFighterGame().start();
    }
  }
}
