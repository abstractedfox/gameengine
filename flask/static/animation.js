//animation.js
//Implementation for bitmap animations

//Usage:
//Call update(dt) on every frame as normal. Call getCurrentFrame() to get the appropriate frame for the time elapsed
class Animation{
    constructor(fps=30, loop = true){
        this.frames = []; //an array of PixelBuffers
        this.fps = fps;
        this.currentFrame = 0;
        this.timeElapsed = 0;
    }

    update(dt){
        this.timeElapsed = (this.timeElapsed + dt) % (this.frames.length * 1/fps);
    }

    getCurrentFrame(){
        return frames[Math.floor((this.frames.length * 1/fps) / this.timeElapsed)];
    }
}
