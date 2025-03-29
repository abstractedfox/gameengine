/*
Off the cuff code organization:
p_ is for 'platform', these are functions that affect something internal to the simulation (such as its resolution)
h_ is for 'html', these are functions that affect the implementation (such as the literal pixel size of something as seen by the browser)

due to javascript's fun & exciting scoping, should probably try to avoid names that the framework user might use in their code
*/

console.log("This file is in a temporary location!");
console.log("RCBC Computer Science Club Microplatform");

let canvasID = "viewport" //id of the html element

let Inputs = []; // an array of pressed inputs

let currentMousePos = [0, 0];

let h_x = 1000;
let h_y = 1000;

let p_x = null;
let p_y = null;

let pixelWidth = null;
let pixelHeight = null;

let viewbuffer = Array(p_x * p_y);

let lastDrawTime = 0;
let frameRateLimit = 60;

let p_background = "black";

let platformDebug = false;

stockPalettes = { "bw": ["#000000", "#111111", "#222222", "#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF"] };

class Palette {
    constructor(palette = null) {
        if (palette != null) {
            console.log("we here");
            this.colors = palette;
            return;
        }

        this.colors = Array(16);
    }
}

let canvas = document.getElementById(canvasID);
let context = canvas.getContext("2d");
let p_palette = new Palette(stockPalettes["bw"]);

//Set the inner resolution. this reinitializes the view buffer!
function p_setResolution(x, y) {
    p_x = x;
    p_y = y;
    pixelWidth = h_x / p_x;
    pixelHeight = h_y / p_y;
    viewbuffer = Array(p_x * p_y)
}

function h_setCanvasDimensions() {
    context.canvas.width = h_x;
    context.canvas.height = h_y;

    //context.canvas.style.background = p_background;
    context.stroke();
}

function initCanvas() {
    p_setResolution(256, 256);
    h_setCanvasDimensions();
}

frameTime = 0;
//draw the buffer onto the canvas
function p_draw() {
    context.canvas.style.background = p_background;
    context.fillStyle = p_background;
    context.fillRect(0, 0, h_x, h_y);
    for (let i = 0; i < viewbuffer.length; i++) {
        if (viewbuffer[i] === undefined) {
            continue;
        }
        context.fillStyle = p_palette.colors[viewbuffer[i]];
        context.fillRect((i % p_x) * pixelWidth, Math.floor(i / p_y) * pixelHeight, pixelWidth, pixelHeight);
    }

    if (platformDebug) {
        context.font = "20px Arial";
        context.fillStyle = "#ff0000";
        context.fillText("frame time: " + (performance.now() - frameTime), 50,20);
        frameTime = performance.now();
    }

}

function boilerplateMain(deltaT) {
    viewbuffer[0] = 10;
    viewbuffer[255] = 10;
    viewbuffer[256] = 6;
    viewbuffer[viewbuffer.length - 1] = 10;

    for (let i = 0; i < viewbuffer.length; i++) {
        if (i % 2 === 0 && Math.floor(i / p_y) % 2 === 0) {
            viewbuffer[i] = 6;
        }
    }
}

function step(deltaT) {
    p_draw();
}

function shouldRenderFrame(timestamp) {
    if (frameRateLimit <= 0) return true;
    const frameTime = 1000 / frameRateLimit;
    if (timestamp - lastDrawTime >= frameTime) {
        lastDrawTime = timestamp;
        return true;
    }
    return false;
}

function p_setFrameRateLimit(fps) {
    frameRateLimit = fps;
}

function p_setDebugMode(debug = true) {
    platformDebug = debug;
}

function getInputs(){
    /*p1:
     *  direction: wasd
     *  primary: f
     *  secondary: g
     *p2:
     *  direction: arrow keys
     *  primary: right alt
     *  secondary: right ctrl
     *not player specific:
     *  spacebar
     *  mouse button 1 and 2
     */
    return Inputs;
}


function getMousePosViewport(){
    return currentMousePos;
}

// event listeners to handle input
// possibly only listen to events on the canvas?
document.addEventListener('keydown', function(event) {
    switch (event.code) {
        case 'KeyW':
            if (Inputs.includes("p1-up")) break;
            Inputs.push("p1-up");
            break;
        case 'KeyA':
            if (Inputs.includes("p1-left")) break;
            Inputs.push("p1-left");
            break;
        case 'KeyS':
            if (Inputs.includes("p1-down")) break;
            Inputs.push("p1-down");
            break;
        case 'KeyD':
            if (Inputs.includes("p1-right")) break;
            Inputs.push("p1-right");
            break;
        case 'KeyQ':
            if (Inputs.includes("p1-primary")) break;
            Inputs.push("p1-primary");
            break;
        case 'KeyE':
            if (Inputs.includes("p1-secondary")) break;
            Inputs.push("p1-secondary");
            break;
        case 'ArrowUp':
            if (Inputs.includes("p2-up")) break;
            Inputs.push("p2-up");
            break;
        case 'ArrowLeft':
            if (Inputs.includes("p2-left")) break;
            Inputs.push("p2-left");
            break;
        case 'ArrowDown':
            if (Inputs.includes("p2-down")) break;
            Inputs.push("p2-down");
            break;
        case 'ArrowRight':
            if (Inputs.includes("p2-right")) break;
            Inputs.push("p2-right");
            break;
        case 'AltRight':
            if (Inputs.includes("p2-primary")) break;
            Inputs.push("p2-primary");
            break;
        case 'ControlRight':
            if (Inputs.includes("p2-secondary")) break;
            Inputs.push("p2-secondary");
            break;
        default:
            break;
    }
});
document.addEventListener('keyup', function(event) {
    switch (event.code) {
        case 'KeyW':
            Inputs.splice(Inputs.indexOf("p1-up"), 1);
            break;
        case 'KeyA':
            Inputs.splice(Inputs.indexOf("p1-left"), 1);
            break;
        case 'KeyS':
            Inputs.splice(Inputs.indexOf("p1-down"), 1);
            break;
        case 'KeyD':
            Inputs.splice(Inputs.indexOf("p1-right"), 1);
            break;
        case 'KeyQ':
            Inputs.splice(Inputs.indexOf("p1-primary"), 1);
            break;
        case 'KeyE':
            Inputs.splice(Inputs.indexOf("p1-secondary"), 1);
            break;
        case 'ArrowUp':
            Inputs.splice(Inputs.indexOf("p2-up"), 1);
            break;
        case 'ArrowLeft':
            Inputs.splice(Inputs.indexOf("p2-left"), 1);
            break;
        case 'ArrowDown':
            Inputs.splice(Inputs.indexOf("p2-down"), 1);
            break;
        case 'ArrowRight':
            Inputs.splice(Inputs.indexOf("p2-right"), 1);
            break;
        case 'AltRight':
            Inputs.splice(Inputs.indexOf("p2-primary"), 1);
            break;
        case 'ControlRight':
            Inputs.splice(Inputs.indexOf("p2-secondary"), 1);
            break;
        default:
            break;
    }
});
document.addEventListener('mousedown', function(event) {
    switch (event.button) {
        case 0:
            if (Inputs.includes("mouse-left")) break;
            Inputs.push("mouse-left");
            break;
        case 1:
            if (Inputs.includes("mouse-middle")) break;
            Inputs.push("mouse-middle");
            break;
        case 2:
            if (Inputs.includes("mouse-right")) break;
            Inputs.push("mouse-right");
            break;
        default:
            break;
    }
});
document.addEventListener('mouseup', function(event) {
    switch (event.button) {
        case 0:
            Inputs.splice(Inputs.indexOf("mouse-left"), 1);
            break;
        case 1:
            Inputs.splice(Inputs.indexOf("mouse-middle"), 1);
            break;
        case 2:
            Inputs.splice(Inputs.indexOf("mouse-right"), 1);
            break;
        default:
            break;
    }
});
canvas.addEventListener('mousemove', function(event) {
    // make sure the pixelWidth and pixelHeight are defined
    if (pixelWidth && pixelHeight) currentMousePos = [Math.round(event.offsetX / pixelWidth), Math.round(event.offsetY / pixelHeight)];
});
