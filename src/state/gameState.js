import { StreetFighterGame } from "../StreetFighterGame.js";
import { FighterId } from "../constants/fighter.js";
import { createDefaultFighterState } from "./fighterState.js";

let array = [];     // declare player classes and then do these shits
let characterOne = 'KEN';
let characterTwo = 'RYU';
// console.log(array);

export function getCharactersArray(characters){
    for (let i = 0; i<characters.length; i++){
        const { player, playerName } = characters[i];
        let characterName = playerName.toUpperCase();
        if(player === 1 && Object.keys(FighterId).includes(characterName)){
            array.push(characterName);
            // playerOne = characterName;
            console.log(`Player One is: ${characterName}`)
        }else if(player === 1 && !Object.keys(FighterId).includes(characterName)){
            array.push('RYU');
            console.log(`Player ${characterName} doesn't exist so PLayerOne will be Ryu`)
        }
        else if(player === 2 && Object.keys(FighterId).includes(characterName)){
            array.push(characterName);
            // playerTwo = characterName;
            console.log(`Player Two is: ${characterName}`)
        }else if(player === 2 && !Object.keys(FighterId).includes(characterName)){
            array.push('KEN');
            console.log(`Player ${characterName} doesn't exist so PlayerTwo will be Ken`)
        }
    }
    characterOne = array[0];
    characterTwo = array[1];

}

    
   export const gameState = {
        fighters:[
            createDefaultFighterState(FighterId[characterOne]),
            createDefaultFighterState(FighterId[characterTwo]),
        ],
    }
