import { getContext } from "../utils/context.js";

const gameOver = new Image();
gameOver.src = "../../images/misc.png";

let context = getContext();

export function finalBanner(name){
    console.log(name);
    context.clearRect(0,0,context.canvas.width, context.canvas.height);
    context.drawImage(gameOver, 369,73,110,14, 0,0, context.canvas.width, context.canvas.height);
    
}   