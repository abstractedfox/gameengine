import { viewbuffer, p_x, p_y } from './platform.js';

const characterCache = [];
let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=\|;:',<.>/?[{]}";

/**
 * Generates the cache. Must be ran for text to work.
 */
export function generateText() {
    characters += '"';
    for (let char of characters) {
        characterCache[char] = generateCharacterBitmap(char);
    }
}

/**
 * Generates a character on a canvas object and turns it into a bitmap.
 * Creates a new canvas with a character, reads the image data, and converts into bitmap.
 * @param {string} char - The character being converted.
 */
function generateCharacterBitmap(char) {
    // TODO: Allow other fonts to be parsed. This function could also be optimized.
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const size = 24;
    context.font = `${size}px Arial`;
    context.textBaseline = "top";

    const metrics = context.measureText(char);
    const width = Math.ceil(
        metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
    ) || Math.ceil(metrics.width);

    canvas.width = width;
    canvas.height = size;

    context.font = `${size}px Arial`;
    context.textBaseline = "top";
    context.fillStyle = "Black";

    const x = metrics.actualBoundingBoxLeft || 0;

    context.fillText(char, x, 0);

    const data = context.getImageData(0, 0, width, size);
    const pixels = data.data;
    const binaryMatrix = [];

    for (let y = 0; y < size; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const alpha = pixels[index + 3];
            row.push(alpha > 128 ? 1 : 0);
        }
        binaryMatrix.push(row);
    }

    return binaryMatrix;
}

/**
 * Draws text on the screen.
 * @param {string} text - What the text will say.
 * @param {number} x - The x coordinate of the text.
 * @param {number} y - The y coordinate of the text.
 * @param {number} color - The color of the text.
 * @param {number} w - The width of the text bounds. 0 is auto.
 * @param {number} h - The height of the text bounds. 0 is auto.
 * @param {number} fontSize - The font size in pixels for the text.
 * @param {Array} buffer - Viewbuffer it's drawn to.
 */
export function drawText(text, x, y, w, h, color, fontSize, buffer = viewbuffer) {
    if (buffer == null) {
        buffer = viewbuffer;
    }

    let currentX = x;
    let lineY = 0;

    const words = text.split(" ");
    words.forEach((word, wordIndex) => {
        let wordWidth = 0;
        word.split("").forEach(char => {
            if (!characterCache[char]) return;
            const bitmap = characterCache[char];
            const bitmapHeight = bitmap.length;
            const bitmapWidth = bitmap[0].length;
            const scaledWidth = Math.ceil((fontSize * bitmapWidth) / bitmapHeight);
            wordWidth += scaledWidth + Math.ceil(fontSize / 8);
        });

        if (w !== 0 && currentX + wordWidth >= x + w && currentX > x) { // Text wrap
            currentX = x;
            lineY++;
        }

        word.split("").forEach(char => {
            if (!characterCache[char]) return;

            const bitmap = characterCache[char];
            const bitmapHeight = bitmap.length;
            const bitmapWidth = bitmap[0].length;
            const scaledWidth = Math.ceil((fontSize * bitmapWidth) / bitmapHeight);

            if (h !== 0 && (lineY + 1) * fontSize > h) { // Text cutoff
                return;
            }

            for (let row = 0; row < fontSize; row++) {
                for (let col = 0; col < scaledWidth; col++) {
                    const bitmapRow = Math.floor(row * bitmapHeight / fontSize);
                    const bitmapCol = Math.floor(col * bitmapWidth / scaledWidth);

                    if (bitmapRow < bitmapHeight && bitmapCol < bitmapWidth &&
                        bitmap[bitmapRow][bitmapCol] === 1) {
                        const pixelX = currentX + col;
                        const pixelY = y + row + (lineY * fontSize);
                        const bufferIndex = pixelX + pixelY * p_x;
                        if (bufferIndex >= 0 && bufferIndex < buffer.length) {
                            buffer[bufferIndex] = color;
                        }
                    }
                }
            }

            currentX += scaledWidth + Math.ceil(fontSize / 8);
        });

        if (wordIndex < words.length - 1) {
            currentX += Math.ceil(fontSize / 2);
        }
    });
}