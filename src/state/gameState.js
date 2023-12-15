import { FighterId } from "../constants/fighter.js";
import { createDefaultFighterState } from "./fighterState.js";

let array = ['Ken', 'Guile'];     // declare player classes and then do these shits
const playerOne = array[0].toUpperCase()
const playerTwo = array[1].toUpperCase()
// Pass the selected values here;

export const gameState = {
    fighters:[
        createDefaultFighterState(FighterId[playerOne]),
        createDefaultFighterState(FighterId[playerTwo]),
    ],
}
