import { setFrameRateLimit, p_x } from '../platform.js';
import { drawRect, drawEllipse, drawRhombus, drawTriangle, drawLine, drawPolygon } from '../shape.js';
import { drawText } from '../text.js';

let demo = 0;
let baseFrame = 0;
let currentFrame = 0;
export async function programStart() {
    console.log("Program Main Start");
    setFrameRateLimit(0);
    setFrameRateLimit(30);
    setInterval(() => {
        demo++;
        if (demo > 2) demo = 0;
        baseFrame = currentFrame;
    }, 5000);
}

let ballDemo_Y = 50;
let ballDemo_velocityY = 0;
const ballDemo_gravity = 0.5;
const ballDemo_bounceFactor = 0.7;
const ballDemo_floorY = 150;
const ballDemo_ballRadius = 10;
const ballDemo_minBounceVelocity = 10;

export async function programUpdate(deltaT, frameNumber) {
    currentFrame = frameNumber;
    let frame = frameNumber - baseFrame;
    //drawText(`Demo ${demo}`, 0, 0, 0, 0, 15, 12);
    if (demo == 0) {
        drawText(`RCBC CS Club's Microplatform`.substring(0, Math.floor(frame / 2)), 30, 25, 200, 0, 15, 25);
        // add a logo here?
    } else if (demo == 1) {
        const centerX = Math.floor(p_x / 2);
        ballDemo_velocityY += ballDemo_gravity;
        ballDemo_Y += ballDemo_velocityY;
        let squishFactor = 1.0;

        if (ballDemo_Y + ballDemo_ballRadius > ballDemo_floorY) {
            ballDemo_Y = ballDemo_floorY - ballDemo_ballRadius;
            ballDemo_velocityY *= -ballDemo_bounceFactor;

            if (Math.abs(ballDemo_velocityY) < ballDemo_minBounceVelocity) {
                ballDemo_velocityY = -ballDemo_minBounceVelocity;
            }

            squishFactor = 1.5;
        } else if (ballDemo_velocityY < 0) {
            squishFactor = 0.7;
        }

        const width = ballDemo_ballRadius * 2 * squishFactor;
        const height = ballDemo_ballRadius * 2 / squishFactor;

        drawEllipse(centerX, Math.floor(ballDemo_Y), width, height, 15);
    } else if (demo == 2) {
        drawRect(25, 25, 50, 50, Math.round(frame / 7.5));
        drawEllipse(125, 50, 50, 50, Math.round(frame / 7.5));
        drawRhombus(175, 25, 50, 50, Math.round(frame / 7.5));
        drawTriangle(25, 100, 50, 50, Math.round(frame / 7.5));
        drawLine(125, 100, 125, 150, Math.round(frame / 7.5));
        drawPolygon([{ x: 175, y: 100 }, { x: 175, y: 150 }, { x: 225, y: 150 }, { x: 225, y: 100 }], Math.round(frame / 7.5));
    }
}

export async function programEnd() {

}
