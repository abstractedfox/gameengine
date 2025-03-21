console.log("Program Main Start");

function programStart() {
    p_setFrameRateLimit(0);
    p_setFrameRateLimit(30);
}

let ballY = 50;
let velocityY = 0;
const gravity = 0.5;
const bounceFactor = 0.7;
const floorY = 150;
const ballRadius = 10;
const minBounceVelocity = 10;

function programUpdate(deltaT) {
    viewbuffer = Array(p_x * p_y);
    //viewbuffer.fill(0);

    const centerX = Math.floor(p_x / 2);
    velocityY += gravity;
    ballY += velocityY;
    let squishFactor = 1.0;

    if (ballY + ballRadius > floorY) {
        ballY = floorY - ballRadius;
        velocityY *= -bounceFactor;

        if (Math.abs(velocityY) < minBounceVelocity) {
            velocityY = -minBounceVelocity;
        }

        squishFactor = 1.5;
    } else if (velocityY < 0) {
        squishFactor = 0.7;
    }

    const width = ballRadius * 2 * squishFactor;
    const height = ballRadius * 2 / squishFactor;

    drawEllipse(centerX, Math.floor(ballY), width, height, 15);
}

function programEnd() {

}
