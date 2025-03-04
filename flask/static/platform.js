/*
Off the cuff code organization:
p_ is for 'platform', these are functions that affect something internal to the simulation (such as its resolution)
h_ is for 'html', these are functions that affect the implementation (such as the literal pixel size of something as seen by the browser)

due to javascript's fun & exciting scoping, should probably try to avoid names that the framework user might use in their code
*/

console.log("This file is in a temporary location!");
console.log("RCBC Computer Science Club Microplatform");

let canvasID = "viewport" //id of the html element

let h_x = 1000;
let h_y = 1000;

let p_x = null;
let p_y = null;

//let pixelWidth = h_x / p_x;
//let pixelHeight = h_y / p_y;
let pixelWidth = null;
let pixelHeight = null;

let viewbuffer = Array(p_x * p_y);

let p_background = "black";

stockPalettes = {"bw": ["#000000", "#111111", "#222222", "#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF"]};

class Palette{
    constructor(palette = null){
        if (palette != null){
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
function p_setResolution(x, y){
    p_x = x;
    p_y = y;
    pixelWidth = h_x / p_x;
    pixelHeight = h_y / p_y;
    viewbuffer = Array(p_x * p_y)
}

function h_setCanvasDimensions(){
    context.canvas.width = h_x;
    context.canvas.height = h_y;

    //boilerplate
    context.canvas.style.background = p_background;
    context.stroke();
}

function initCanvas(){
    p_setResolution(256, 256);
    h_setCanvasDimensions();
}

//draw the buffer onto the canvas
function p_draw(){
    context.canvas.style.background = p_background; 
    for (let i = 0; i < viewbuffer.length; i++){
        if (viewbuffer[i] == undefined){
            continue; 
        }
        context.fillStyle = p_palette.colors[viewbuffer[i]];
        context.fillRect((i % p_x) * pixelWidth, Math.floor(i/p_y) * pixelHeight, pixelWidth, pixelHeight); 
    }
}

function boilerplateMain(deltaT){
    viewbuffer[0] = 10;
    viewbuffer[255] = 10;
    viewbuffer[256] = 6;
    viewbuffer[viewbuffer.length - 1] = 10;
    
    for (let i = 0; i < viewbuffer.length; i++){
        if (i % 2 == 0 && Math.floor(i/p_y) % 2 == 0){
            viewbuffer[i] = 6;
        }
    }
}

function start(gameMain){
    //to do: function here that accepts gameMain as a callback and bootstraps the requestAnimationFrame loop (i think this can be how we instantiate whatever main the framework user actually writes)
}

function step(deltaT){
    //boilerplateMain(deltaT);

    p_draw();
    
    //requestAnimationFrame(step);
}
