


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const welcome_screen = document.querySelector('img[alt="welcome_screen"]');
const welcome_logo = document.querySelector('img[alt="welcome_logo"]');
// fighters array from sprite
const FIGHTERS= [
    [800, 10, 264, 94],
    [792, 116, 280, 132],
];
let timeoutId;

// frameindex to loop from 0
let frameIndex = 0;
let delay = 1000/10; // Delay in milliseconds between frames
let cameraY = 0;
export function animateWelcomeScreen() {
    if (frameIndex < FIGHTERS.length) {
        const [x, y, width, height] = FIGHTERS[frameIndex];     // destructuring fighters array
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    building();
    background();
    ctx.drawImage(welcome_screen,x,y,width,height,60,canvas.height - height,width,height);      // drawing fighter image
    frameIndex++;       // increasing the frameindex (from 0 to 1, from 1 to 2 and so on)

  }else{
    building(cameraY);
    background(cameraY);
    animatetwo(cameraY);
    animateone(cameraY);
    setTimeout(cameraTimer, 1000);  // vertical scroll pace controller
}
timeoutId = setTimeout(animateWelcomeScreen, delay);        // calling the function with settimeout
// delay determines the animation speed
}

function cameraTimer(){
    if(cameraY > 270) {
        ctx.drawImage(welcome_logo,16,21,288,126,122,50,145,60);
        clearTimeout(timeoutId);
        return;
    };
    return cameraY += 20;
}

function animateone(cameraY=0){
    let y_cord = cameraY;
    ctx.drawImage(welcome_screen,851,256,220,86,60,canvas.height - 86+y_cord,220,86);
}
function animatetwo(cameraY=0){
    let y_cord = cameraY;
    ctx.drawImage(welcome_screen,794,368,110,144,10,canvas.height - 144+y_cord,110,144); 
}
function background(cameraY = 0){
    let y_cord = cameraY;
    ctx.drawImage(welcome_screen, 8, 441, 384, 79, 1, canvas.height - 80+y_cord, 384, 79);
}
function building(cameraY=0){
    let y_cord = cameraY;
    ctx.drawImage(welcome_screen, 8, 8, 384, 384, 0, 0, 384, 384);
    ctx.drawImage(welcome_screen, 399, 295-y_cord, 385, 512, 0, 0, 385, 512);
}
