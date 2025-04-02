/*
Off the cuff code organization:
p_ is for 'platform', these are functions that affect something internal to the simulation (such as its resolution)
h_ is for 'html', these are functions that affect the implementation (such as the literal pixel size of something as seen by the browser)

due to javascript's fun & exciting scoping, should probably try to avoid names that the framework user might use in their code
*/

import { programStart, programUpdate, programEnd } from './program/main.js';
import { generateText } from './text.js';

console.log("This file is in a temporary location!");
console.log("RCBC Computer Science Club Microplatform");

let canvasID = "viewport" // id of the html element

let Inputs = []; // an array of pressed inputs

let currentMousePos = [0, 0];

// use 256x256 as a default
export let p_x = 256;
export let p_y = 256;

export let viewbuffer = Array(p_x * p_y);

let lastDrawTime = 0;
let frameRateLimit = 60;

let frameCount = 0;

let p_background = "black";

let platformDebug = false;

export let tileResolution = 16;

let audioContext = new AudioContext();

const stockPalettes = { "bw": ["#000000", "#111111", "#222222", "#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF"] };

class Palette {
    constructor(palette = null) {
        if (palette != null) {
            this.colors = palette;
            return;
        }

        this.colors = Array(16);
    }
}

let canvas = document.getElementById(canvasID);
let context = canvas.getContext("2d");
let p_palette = new Palette(stockPalettes["bw"]);

let frameTime = 0;
// draw the buffer onto the canvas
function draw() {
    context.canvas.style.background = p_background;
    context.fillStyle = p_background;
    context.fillRect(0, 0, p_x, p_y);
    for (let i = 0; i < viewbuffer.length; i++) {
        if (viewbuffer[i] === undefined) {
            continue;
        }
        context.fillStyle = p_palette.colors[viewbuffer[i]];
        context.fillRect((i % p_x), Math.floor(i / p_y), 1, 1);
    }

    if (platformDebug) {
        context.font = "15px Arial";
        context.fillStyle = "#ff0000";
        context.fillText("frame time: " + Math.round((performance.now() - frameTime)) + "ms", 50, 20);
        frameTime = performance.now();
    }

}

function mainLoop(timestamp) {
    let deltaT = timestamp - lastDrawTime;
        
    if (((timestamp - lastDrawTime) >= (1000 / frameRateLimit)) || frameRateLimit <= 0) { // frame rate limit, 0 = unlimited
        lastDrawTime = timestamp;
        viewbuffer = Array(p_x * p_y); // clear viewbuffer
        programUpdate(deltaT, frameCount++);
        draw();
    }

    requestAnimationFrame(mainLoop); // this will max out at the refresh rate of the screen
}

// exported functions
/**
 * Setup the platform
 * @returns {void}
*/
export async function setup() {
    setResolution(256, 256);
    generateText();
    
    var audioTag = document.getElementById("audioContainer");
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        //if (this.readystate == 4 && this.status == 200){
        if (this.status == 200){
            console.log("Receiving audio")
            let audio = req.responseText;
            for (let i = 0; i < audio.length; i++){
                //note: this is coming in correctly but as a string, parse it & finish doing this -kk
                console.log("Loading audio " + audio[i]);
            }
        }
        else{
            console.log(this.readystate + " fuck " + this.status);
        }
    }
    req.open("GET", "/audio", false);
    req.send();
    
    programStart();
}

/**
 * Start the main loop
 * @returns {void}
*/
export function startMainLoop() {
    mainLoop(performance.now());
}

// Set the inner resolution. this reinitializes the view buffer!
/**
 * Set the platform resolution. Currently only 1:1 aspect ratio is supported
 * @param {number} x - The width of the platform
 * @param {number} y - The height of the platform
 * @returns {[number, number]} The new resolution
*/
export function setResolution(x, y) {
    p_x = x;
    p_y = y;
    viewbuffer = Array(p_x * p_y);
    context.canvas.width = p_x;
    context.canvas.height = p_y;
    context.stroke();
    return [p_x, p_y];
}

/**
 * Set the frame rate limit. 0 = unlimited
 * @param {number} fps - The frame rate limit
 * @returns {number} The new frame rate limit
*/
export function setFrameRateLimit(fps) {
    frameRateLimit = fps;
    return frameRateLimit;
}

/**
 * Set platform debug mode on or off. Currently only gives frame render time statistics
 * @param {boolean} debug - Whether or not to enable debug mode
 * @returns {boolean} Whether debug mode is on
*/
export function setDebugMode(debug = true) {
    platformDebug = debug;
    return platformDebug;
}

// Just threw in something generic
/**
 * Set the tile resolution
 * @returns {number} The current tile resolution
*/
export function setTileResolution(res) {
    tileResolution = res;
    return tileResolution;
}

/**
 * Get the currently pressed inputs
 * @returns {string[]} The currently pressed inputs
*/
export function getInputs(){
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

/**
 * Get the current mouse position relative to the viewport
 * @returns {[number, number]} The current mouse position
*/
export function getMousePosViewport(){
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
    currentMousePos = [Math.round(event.offsetX / (canvas.offsetWidth / p_x)), Math.round(event.offsetY / (canvas.offsetHeight / p_y))];
});
