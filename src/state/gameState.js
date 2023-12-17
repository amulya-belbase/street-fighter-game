import { StreetFighterGame } from "../StreetFighterGame.js";
import { FighterId } from "../constants/fighter.js";
import { createDefaultFighterState } from "./fighterState.js";

let array = [];     

// gets the selected characters from selection menu, creates fighter state and returns the value
export function getCharactersArray(characters){
    array = [];
    for (let i = 0; i<characters.length; i++){
        const { player, playerName } = characters[i];
        let characterName = playerName.toUpperCase();
        if(player === 1 && Object.keys(FighterId).includes(characterName)){
            array.push(characterName);
            console.log(`Player One is: ${characterName}`)
        }else if(player === 1 && !Object.keys(FighterId).includes(characterName)){
            array.push('RYU');
            console.log(`Player ${characterName} doesn't exist so PLayer One will be Ryu`)
        }
        else if(player === 2 && Object.keys(FighterId).includes(characterName)){
            array.push(characterName);
            console.log(`Player Two is: ${characterName}`)
        }else if(player === 2 && !Object.keys(FighterId).includes(characterName)){
            array.push('KEN');
            console.log(`Player ${characterName} doesn't exist so Player Two will be Ken`)
        }
    }

    const gameState = {
         fighters:[
             createDefaultFighterState(FighterId[array[0]]),
             createDefaultFighterState(FighterId[array[1]]),
         ],
     };
    return gameState;    
}


