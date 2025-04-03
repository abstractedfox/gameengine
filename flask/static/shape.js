import { viewbuffer, p_x, p_y } from './platform.js';

/**
 * Draws a rectangle on the screen
 * @param {number} x - The x coordinate of the rectangle
 * @param {number} y - The y coordinate of the rectangle
 * @param {number} w - The width of the rectangle
 * @param {number} h - The height of the rectangle
 * @param {number} color - The color of the rectangle
 * @param {Array} buffer - Viewbuffer it's drawn to.
*/
export function drawRect(x, y, w, h, color, buffer = viewbuffer) {
    if (buffer == null) {
        buffer = viewbuffer;
    }

    const startX = Math.max(0, x);
    const startY = Math.max(0, y);
    const endX = Math.min(x + w, p_x);
    const endY = Math.min(y + h, p_y);

    for (let i = startX; i < endX; i++) {
        for (let j = startY; j < endY; j++) {
            buffer[i + j * p_x] = color;
        }
    }
}

/**
* Draws an ellipse on the screen. The center of the ellipse is at (x, y).
* @param {number} x - The x coordinate of the ellipse
* @param {number} y - The y coordinate of the ellipse
* @param {number} w - The width of the ellipse
* @param {number} h - The height of the ellipse
* @param {number} color - The color of the ellipse
* @param {Array} buffer - Viewbuffer it's drawn to.
*/
export function drawEllipse(x, y, w, h, color, buffer = viewbuffer) {
    if (buffer == null) {
        buffer = viewbuffer;
    }

    const a = Math.floor(w / 2);
    const b = Math.floor(h / 2);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const dx = i - a;
            const dy = j - b;

            if ((dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1) {
                const px = x + dx;
                const py = y + dy;

                if (px >= 0 && px < p_x && py >= 0 && py < p_y) {
                    buffer[px + py * p_x] = color;
                }
            }
        }
    }
}

/**
 * @param {number} x - The x coordinate of the rhombus
 * @param {number} y - The y coordinate of the rhombus
 * @param {number} w - The width of the rhombus
 * @param {number} h - The height of the rhombus
 * @param {number} color - The color of the rhombus
 * @param {Array} buffer - Viewbuffer it's drawn to.
 */
export function drawRhombus(x, y, w, h, color, buffer = viewbuffer) {
    if (buffer == null) {
        buffer = viewbuffer;
    }

    const centerX = w / 2;
    const centerY = h / 2;

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const dx = Math.abs(i - centerX) / centerX;
            const dy = Math.abs(j - centerY) / centerY;

            if (dx + dy <= 1) {
                buffer[x + i + (y + j) * p_x] = color;
            }
        }
    }
}

/**
 * Draws a triangle on the screen. Uses the barycentric method.
 * @param {number} x - The x coordinate of the triangle
 * @param {number} y - The y coordinate of the triangle
 * @param {number} w - The width of the triangle
 * @param {number} h - The height of the triangle
 * @param {number} color - The color of the triangle
 * @param {Array} buffer - Viewbuffer it's drawn to.
 */
export function drawTriangle(x, y, w, h, color, buffer = viewbuffer) {
    if (buffer == null) {
        buffer = viewbuffer;
    }

    const x1 = x + w / 2;
    const y1 = y;
    const x2 = x;
    const y2 = y + h;
    const x3 = x + w;
    const y3 = y + h;

    const minX = Math.max(Math.min(x1, Math.min(x2, x3)), 0);
    const maxX = Math.min(Math.max(x1, Math.max(x2, x3)), p_x - 1);
    const minY = Math.max(Math.min(y1, Math.min(y2, y3)), 0);
    const maxY = Math.min(Math.max(y1, Math.max(y2, y3)), p_y - 1);

    function isPointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
        const denominator = ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
        if (denominator === 0) return false;

        const a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denominator;
        const b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denominator;
        const c = 1 - a - b;

        return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1;
    }

    for (let px = minX; px <= maxX; px++) {
        for (let py = minY; py <= maxY; py++) {
            if (isPointInTriangle(px, py, x1, y1, x2, y2, x3, y3)) {
                buffer[px + py * p_x] = color;
            }
        }
    }
}

/**
 * Draws a line on the screen
 * @param {number} x1 - The x coordinate of the start of the line
 * @param {number} y1 - The y coordinate of the start of the line
 * @param {number} x2 - The x coordinate of the end of the line
 * @param {number} y2 - The y coordinate of the end of the line
 * @param {Array} buffer - Viewbuffer it's drawn to.
 */
export function drawLine(x1, y1, x2, y2, color, buffer = viewbuffer) {
    if (buffer == null) {
        buffer = viewbuffer;
    }

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        if (x1 >= 0 && x1 < p_x && y1 >= 0 && y1 < p_y) {
            buffer[x1 + y1 * p_x] = color;
        }

        if (x1 === x2 && y1 === y2) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }
}

/**
 * Draws a polygon on the screen
 * @param {Array} points - The points of the polygon
 * @param {number} color - The color of the polygon
 * @param {Array} buffer - Viewbuffer it's drawn to.
 */
export function drawPolygon(points, color, buffer = viewbuffer) {
    if (buffer == null) {
        buffer = viewbuffer;
    }

    if (points.length < 3) return;

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        drawLine(p1.x, p1.y, p2.x, p2.y, color, buffer);
    }
}