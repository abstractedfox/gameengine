// Operations on array buffers or other things that are shaped like matricies
import { tileResolution } from "./platform.js";
import {PixelBuffer} from "./library.js";

/**
 * Generate a tile map, as a new PixelBuffer, using pixelBufferSource as the tile, with unitsX tiles in the X direction and unitsY tiles in the Y direction.
 * @param {PixelBuffer} source - The PixelBuffer to use.
 * @param {number} unitsX - The number of tiles in the X direction.
 * @param {number} unitsY - The number of tiles in the Y direction.
 * @returns {PixelBuffer} tiles - A PixelBuffer of tiles.
 */
function generateTileMap(source, unitsX, unitsY) {
    const tileWidth = tileResolution;
    const tileHeight = tileResolution;
    const resultWidth = unitsX * tileWidth;
    const resultHeight = unitsY * tileHeight;

    const result = new PixelBuffer(resultWidth, resultHeight, new Array(resultWidth * resultHeight).fill(0));

    for (let i = 0; i < unitsX; i++) {
        for (let j = 0; j < unitsY; j++) {
            const offsetX = i * tileWidth;
            const offsetY = j * tileHeight;

            for (let y = 0; y < tileHeight; y++) {
                const srcRowStart = y * tileWidth;
                const destRowStart = (offsetY + y) * resultWidth + offsetX;

                for (let x = 0; x < tileWidth; x++) {
                    result.buffer[destRowStart + x] = source.buffer[srcRowStart + x];
                }
            }
        }
    }

    return result;
}

/**
 * Return a smaller section of a matrix
 * @param {Array} matrix - The source matrix.
 * @param {number} matrixW - The width of the matrix.
 * @param {number} matrixH - The height of the matrix.
 * @param {number} sectionX - The x position of the section.
 * @param {number} sectionY - The y position of the section.
 * @param {number} sectionW - The width of the section.
 * @param {number} sectionH - The height of the section.
 * @returns {PixelBuffer | null} section - A PixelBuffer with the slice. Null if out of bounds.
 */
function matrixSection(matrix, matrixW, matrixH, sectionX, sectionY, sectionW, sectionH) {
    if(sectionX + sectionW > matrixW || sectionY + sectionH > matrixH || sectionX < 0 || sectionY < 0) {
        console.log("Section is out of bounds");
        return null;
    }

    const section = new PixelBuffer(sectionW, sectionH, new Array(sectionW * sectionH).fill(0));

    for(let i = 0; i < sectionW; i++){
        for(let j = 0; j < sectionH; j++){
            section.buffer[i + j * sectionW] = matrix[sectionX + i + (sectionY + j) * matrixW];
        }
    }

    return section;
}

/**
 * Write the contents of matrix into another matrix.
 * @param {PixelBuffer} source - The source matrix.
 * @param {PixelBuffer} dest - The destination matrix.
 * @param {number} posX - The x position within dest which will contain the x = 0 index of source.
 * @param {number} posY - The y position within dest which will contain the y = 0 index of source.
 * @param {string} pixelMode - The mode to use for the pixel operation.
 * @param {string} overflowMode - The mode to use for the overflow operation.
 * valid pixelModes as of right now:
 *  "overwrite": completely replace the old values with the new values
 * valid overflowModes as of right now:
 *  "cutoff": if the source PixelBuffer would overflow the bounds of this PixelBuffer's dimensions, discard the out of bounds values
 */
function writeIntoPixelBuffer(source, dest, posX, posY, pixelMode, overflowMode) {
    if(source === dest) {
        console.log("Source and destination are the same");
        return;
    }

    // Only handles square matrices, we need a way to get the width and height of a pixel buffer.
    const sourceSize = Math.sqrt(source.buffer.length);
    const destSize = Math.sqrt(dest.buffer.length);

    for (let y = 0; y < sourceSize; y++) {
        for (let x = 0; x < sourceSize; x++) {
            let destX = posX + x;
            let destY = posY + y;

            if (overflowMode === "cutoff" && (destX < 0 || destX >= destSize || destY < 0 || destY >= destSize)) {
                continue;
            }

            if (destX < 0 || destY < 0 || destX >= destSize || destY >= destSize) {
                continue;
            }

            const destIndex = destY * destSize + destX;
            const sourceIndex = y * sourceSize + x;

            if (pixelMode === "overwrite") {
                dest.buffer[destIndex] = source.buffer[sourceIndex];
            }
        }
    }
}