/*
Off the cuff code organization:
p_ is for 'platform', these are functions that affect something internal to the simulation (such as its resolution)
h_ is for 'html', these are functions that affect the implementation (such as the literal pixel size of something as seen by the browser)

due to javascript's fun & exciting scoping, should probably try to avoid names that the framework user might use in their code
*/

import { programStart, programUpdate, programEnd, audioImports } from './program/main.js';
import { generateText } from './text.js';

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

//Audio
let audioContext = new AudioContext();
let audioFiles = {}; //dict to contain filenames of audio files, and their decoded audio data
    //"literalFileName.mp3": AudioBuffer object (as obtained from decodeAudioData)
let audioNames = {}; //more friendly names as defined by the programmer for their audio files
    //"jump effect": "literalFileName.mp3"


const stockPalettes = { "bw": ["#000000", "#111111", "#222222", "#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF"] };

export class Palette {
    constructor(palette = null) {
        if (palette != null) {
            this.colors = palette;
            return;
        }

        this.colors = Array(16);
    }
}

export function setPalette(newPalette){
    p_palette = newPalette;
}

//note: we should probably just change this wholesale to always use an element of the palette as the background
export function setBackground(newBackground){
    p_background = newBackground;
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

async function mainLoop(timestamp) {
    let deltaT = timestamp - lastDrawTime;

    if (((timestamp - lastDrawTime) >= (1000 / frameRateLimit)) || frameRateLimit <= 0) { // frame rate limit, 0 = unlimited
        lastDrawTime = timestamp;
        viewbuffer = Array(p_x * p_y); // clear viewbuffer
        if (isAsyncFunction(programUpdate)) {
            await programUpdate(deltaT, frameCount++);
        } else {
            programUpdate(deltaT, frameCount++);
        }
        draw();
    }

    requestAnimationFrame(mainLoop); // this will max out at the refresh rate of the screen
}

function isAsyncFunction(fn) {
    return fn.constructor.name == 'AsyncFunction';
}

// exported functions
/**
 * Setup the platform
 * @returns {void}
*/
export async function setup() {
    setResolution(256, 256);
    generateText();
   
    console.log("Importing audio");
    for (let i = 0; i < Object.entries(audioImports).length; i++){
        let thisFile = Object.entries(audioImports)[i];
        await importAudioFile(thisFile[0], thisFile[1]);
    }
    console.log("Audio import complete");

    //unconditional sound-enable, for situations where in-game sound is desired regardless of whether the user has made an in-game input yet
    document.getElementById("soundToggle").onclick = () => playSound("");    

    if (isAsyncFunction(programStart)) {
        await programStart();
    } 
    else {
        programStart();
    }
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
export function getInputs() {
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
export function getMousePosViewport() {
    return currentMousePos;
}

//Import an audio file that exists in /static/program/ and decode it (places it in audioFiles and audioNames as is relevant to those dicts).
//On success, audio exists in audioFiles as an AudioBuffer object 
export async function importAudioFile(fileName, usefulName){
    let response = await fetch("/static/program/" + fileName);
    if (response.status != 200){
        console.log("Could not import " + fileName + " received status code " + response.status);
        return;
    }
    
    audioFiles[fileName] = await audioContext.decodeAudioData(await response.arrayBuffer());
    audioNames[usefulName] = fileName;
    console.log("Imported " + fileName + " as \"" + usefulName + "\"");
}

//Play an existing imported sound by passing the "usefulName" that was passed when the sound was imported
//Pass an empty string to play nothing (use this for dedicated audio-enables, ie an 'enable sound' button)
export function playSound(usefulName){
    let outputBuffer = audioContext.createBufferSource();
    if(usefulName != ""){
        outputBuffer.buffer = audioFiles[audioNames[usefulName]];
    }
    outputBuffer.connect(audioContext.destination);
    outputBuffer.start()
}

// event listeners to handle input
// possibly only listen to events on the canvas?
document.addEventListener('keydown', function (event) {
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
document.addEventListener('keyup', function (event) {
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
document.addEventListener('mousedown', function (event) {
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
document.addEventListener('mouseup', function (event) {
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
canvas.addEventListener('mousemove', function (event) {
    currentMousePos = [Math.round(event.offsetX / (canvas.offsetWidth / p_x)), Math.round(event.offsetY / (canvas.offsetHeight / p_y))];
});

export function overwriteViewbuffer(buffer){
    viewbuffer = buffer;
}
