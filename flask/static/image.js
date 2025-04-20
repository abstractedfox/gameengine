import { viewbuffer, p_x, p_y } from './platform.js';

export class Image {
    constructor(width = 0, height = 0, data = []) {
        this.width = width;
        this.height = height;
        this.data = data;
    }
}

function flipVertical(pixels, w, h) {
    // convert to 2d array, reverse, then flatten
    const arr = [];
    for (let i = 0; i < h; i++) {
        arr.push(pixels.slice(i * w, (i + 1) * w));
    }
    arr.reverse();
    return arr.flat();
}

function bytesToUint(bytes) {
    let view = new DataView(new ArrayBuffer(bytes.length));
    for (const index in bytes) view.setUint8(index, bytes[index]);
    if (bytes.length == 1) return view.getUint8(0);
    if (bytes.length == 2) return view.getUint16(0, true);
    if (bytes.length == 4) return view.getUint32(0, true);
    if (bytes.length == 8) return view.getBigUint64(0, true);
    throw new Error('Unsupported byte length');
}

export async function loadImage(imageURL) {
    const response = await fetch(imageURL);
    if (!response.ok) throw new Error(`Failed to load image: ${response.status} ${response.statusText}`);
    const byteArray = new Uint8Array(await response.arrayBuffer());
    // byteArray.subarray end is exclusive
    if (byteArray[0x00] == 0x42 && byteArray[0x01] == 0x4D) { // windows bmp format, "BM" in ascii
        if (bytesToUint(byteArray.subarray(0x0E, 0x11 + 1)) != 40) throw new Error('Unsupported image format'); // header size, should be 40 for windows bmp format
        if (bytesToUint(byteArray.subarray(0x1E, 0x21 + 1)) != 0) throw new Error('Image compression is not supported');
        const bpp = bytesToUint(byteArray.subarray(0x1C, 0x1D + 1)); // bits per pixel
        const dataStart = bytesToUint(byteArray.subarray(0x0A, 0x0D + 1));
        const dataLength = bytesToUint(byteArray.subarray(0x22, 0x25 + 1));
        const width = bytesToUint(byteArray.subarray(0x12, 0x15 + 1));
        const height = bytesToUint(byteArray.subarray(0x16, 0x19 + 1));
        const image = new Image(width, height, byteArray.subarray(dataStart, dataStart + dataLength + 1));
        if (bpp == 4) { // convert 4bpp to 8bpp
            const pixels = [];
            for (let byte of image.data) {
                pixels.push((byte >> 4) & 0x0F); // high
                pixels.push(byte & 0x0F); // low
            }
            image.data = pixels;
        } else if (bpp != 8) { // remove this? this is only used for more then 16 colors
            throw new Error('Unsupported image format. Only 4 and 8 bpp images are supported');
        }
        image.data = flipVertical(image.data, image.width, image.height); // bitmap goes from bottom to top, left to right so we need to flip it
        return image;
    } else {
        throw new Error('Unsupported image format');
    }
}

export function drawImage(image, x, y, buffer = viewbuffer) { // possibly add support for scaling, rotating and flipping
    // need to find a more efficient way to do this
    for (let i = 0; i < image.height; i++) {
        for (let j = 0; j < image.width; j++) {
            buffer[(x + j) + ((y + i) * p_x)] = image.data[(i * image.width) + j];
        }
    }
}
