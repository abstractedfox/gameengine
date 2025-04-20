//generic class containing a pixel array or other such bitmap graphic and its dimensions

import { writeIntoPixelBuffer } from './matrix.js';

//Generic names for object types for the 'objectType' parameter of GameObject.onCollide, to be defined/used as needed by the implementation
export const collisionObjects = {
    FLOOR: "floor",
    CEILING: "ceiling",
    PLATFORM: "platform",
    WALL: "wall",
    SIDE_TOP: "side_top",
    SIDE_BOTTOM: "side_bottom",
    SIDE_LEFT: "side_left",
    SIDE_RIGHT: "side_right",
    BODY: "body",
    HEAD: "head",
    HAND: "hand",
    FOOT: "foot",
    TAIL: "tail",
    WING: "wing",
    PLAYER: "player",
    ENEMY: "enemy",
    PROJECTILE: "projectile",
    COLLECTIBLE: "collectible",
    GAP: "gap",
}

//A class to hold any bitmap object
export class PixelBuffer {
    //where x and y are the dimensions, and 'buffer' is an array of values
    constructor(x, y, buffer) {
        this.x = x;
        this.y = y;
        this.buffer = buffer;
    }
}

//A framework for nearly any game object
export class GameObject {
    constructor(xPos, yPos) {
        this.graphic = null; //optional PixelBuffer object
        this.animation = null; //optional Animation object

        this.xPos = xPos;
        this.yPos = yPos;

        this.viewportX = xPos; //Optional parameter to contain this object's position relative to a containing viewport
        this.viewportY = yPos;

        this.ID = null; //optional ID parameter

        this.onDestroy = () => {}; //optional behavior for when the object is destroyed

        this.colliders = [];
    
        this.isAlive = true; //flag to mark this object as ready to be disposed. Implementations should consider this flag to indicate whether to process the object(if true) and whether to remove it from enclosing collections (if false)
    }

    update(dt) {
        //To be called on every frame, filled in by the implementation
    }

    destroy() {
        this.onDestroy();
    }

    /**
     *  @param {string} objectType - The collider that was hit.
     *  @param params - Optional paramters related to the collision.
     */
    onCollide(objectType, params = {}) {
        //To be overridden in the implmentation
    }
}

/**
 * A collider is a rectangular area that can be used to detect collisions between objects
 *
 * @param {string} id - The id of the collider. Use the collisionObjects object to define what this collider is for.
 * @param {number} offsetX - The x offset of the collider from the parent object
 * @param {number} offsetY - The y offset of the collider from the parent object
 * @param {number} w - The width of the collider
 * @param {number} h - The height of the collider
 */
export class Collider {
    //offsets relative to the parent object
    constructor(id) {
        this.id = id;
        this.offsetX = 0;
        this.offsetY = 0;
        this.w = 0;
        this.h = 0;
    }
}

//container class for a collection of objects to be called on every frame (in other words, this is what actually calls those 'update' functions in every GameObject)

//[Kira]Potential issue : We may want to move object collision out of here, it may not be guaranteed that the programmer will always want collisions done implicitly, but also there is a likely issue where, since collisions are being done in the middle of object updates, they may register a collision between an object that has updated and an object that has not yet updated, ie object2 may still be in its position from the previous frame when on this frame it should really be somewhere else.
    //(I'm also not sure if we want to break on collision, since it may be desirable to register multiple different colliders at once, ie perhaps an object has a physics effect but has a 2nd collider meant to trigger some other event)
export class ObjectManager {
    constructor() {
        this.objects = [];
    }

    push(object) {
        this.objects.push(object);
    }

    destroy(index) {
        this.objects[index].destroy();
        this.objects.splice(index, 1);
    }

    update(dt) {
        for (let object1Index = 0; object1Index < this.objects.length; object1Index++) { // Obj1
            const obj1 = this.objects[object1Index];
            if(!obj1.colliders || obj1.colliders.length === 0) {
                obj1.update(dt);
                continue;
            }

            for (let object2Index = object1Index + 1; object2Index < this.objects.length; object2Index++) { // Obj2
                const obj2 = this.objects[object2Index];
                if(!obj2.colliders || obj2.colliders.length === 0) continue;
                let collisionDetected = false;

                for (let collider1 of obj1.colliders) { // Obj1 colliders
                    for (let collider2 of obj2.colliders) { // Obj2 colliders
                        if (isColliding(obj1, collider1, obj2, collider2)) {
                            obj1.onCollide(collider2.id, {
                                prevState: JSON.parse(JSON.stringify(obj1)),
                                collidedWith: JSON.parse(JSON.stringify(obj2)),
                            });
                            obj2.onCollide(collider1.id, {
                                prevState: JSON.parse(JSON.stringify(obj2)),
                                collidedWith: JSON.parse(JSON.stringify(obj1)),
                            });
                            collisionDetected = true;
                            break;
                        }
                    }
                    if (collisionDetected) break;
                }
            }
            this.objects[object1Index].update(dt);
        }
    }

}

/**
 * Basic AABB collision.
 * @param {GameObject} object1
 * @param {Collider} collider1
 * @param {GameObject} object2
 * @param {Collider} collider2
 */
export function isColliding(object1, collider1, object2, collider2) {
    return (
        (object1.xPos + collider1.offsetX) < (object2.xPos + collider2.offsetX + collider2.w) &&
        (object1.xPos + collider1.offsetX + collider1.w) > (object2.xPos + collider2.offsetX) &&
        (object1.yPos + collider1.offsetY) < (object2.yPos + collider2.offsetY + collider2.h) &&
        (object1.yPos + collider1.offsetY + collider1.h) > (object2.yPos + collider2.offsetY)
    );
}

/**
 * Casts a ray to check for a collision.
 * @param {{x: number, y: number}} origin - Position where the ray starts.
 * @param {{x: number, y: number}} direction - Direction of the array.
 * @param {number} maxDistance - Distance of collision check.
 * @param {GameObject} object - Object the ray is originating from.
 * @param {GameObject[]} objects - Objects to check. Defaults to all the objects in the sequence.
 */
export function castRay(origin, direction, maxDistance, object, objects) {
    let closestHit = null;
    const rayEndX = origin.x + direction.x * maxDistance;
    const rayEndY = origin.y + direction.y * maxDistance;
    const ray = {x: origin.x, y: origin.y, x2: rayEndX, y2: rayEndY};

    for (let obj of objects) {
        if(obj === object) continue; // Don't check collisions with the object itself
        for (let collider of obj.colliders) {
            const hit = isRayColliding(ray, obj, collider);
            if (hit) {
                const dx = hit.x - origin.x;
                const dy = hit.y - origin.y;
                const distSquared = dx * dx + dy * dy;
                if (distSquared < maxDistance * maxDistance) {
                    const dist = Math.sqrt(distSquared);
                    closestHit = {
                        hit: true,
                        object: obj,
                        collider: collider,
                        point: hit,
                        distance: dist
                    };
                    if (dist === maxDistance) return closestHit;
                }
            }
        }
    }

    return closestHit || {hit: false};
}

/**
 * Checks if a ray is colliding with a collider. Has a very small offset.
 * Uses a form of AABB to check.
 * @param {{x: number, y: number, x2: number, y2: number}} ray - The ray bounds to check.
 * @param {GameObject} object - The object checked.
 * @param {Collider} collider - The collider checked.
 */
export function isRayColliding(ray, object, collider) {
    const realPos = {
        x: object.xPos + collider.offsetX,
        y: object.yPos + collider.offsetY
    };

    const minX = realPos.x;
    const maxX = realPos.x + collider.w;
    const minY = realPos.y;
    const maxY = realPos.y + collider.h;

    const rayDirX = ray.x2 - ray.x;
    const rayDirY = ray.y2 - ray.y;

    const invDirX = rayDirX !== 0 ? 1 / rayDirX : 0;
    const invDirY = rayDirY !== 0 ? 1 / rayDirY : 0;

    const t1 = (minX - ray.x) * invDirX;
    const t2 = (maxX - ray.x) * invDirX;
    const t3 = (minY - ray.y) * invDirY;
    const t4 = (maxY - ray.y) * invDirY;

    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    const OFFSET = 0.0001;
    if (tmax >= -OFFSET && tmin <= 1 + OFFSET) {
        const hitX = ray.x + rayDirX * tmin;
        const hitY = ray.y + rayDirY * tmin;
        if (hitX >= minX && hitX <= maxX &&
            hitY >= minY && hitY <= maxY) {
            return {
                x: hitX,
                y: hitY
            };
        }
    }

    return false;
}

//A relationship of GameObjects, or in other words, a virtual viewport keeping track of where things are relative to each other
//This does NOT track z-position (ie layering), to do that use multiple scenes and render them in the order desired. The priority of overlapping objects is thus undefined
export class Scene {
    constructor() {
        this.GameObjects = [];
        this.originX = 0;
        this.originY = 0;
    }

    //update all tracked GameObjects' viewport positions according to the origin point of this scene
    update() {
        for (let i = 0; i < this.GameObjects.length; i++) {
            this.GameObjects[i].viewportX -= this.originX;
            this.GameObjects[i].viewportY -= this.originY;
        }
    }
}

//Timer class. Calls a user-supplied callback every 'interval' amount of time 
export class Timer {
    //Interval == time in milliseconds
    //countByCalls == instead of counting time, count the sheer number of calls to the update function (useful if you're counting specific occurrences of something, or literal frame updates)
    constructor(interval, callback = () => {}, countByCalls = false){
        this.interval = interval;
        this.elapsed = 0;
        this.countByCalls = countByCalls;
        this.callback = callback;
    }

    update(dt){
        if (this.countByCalls){
            this.elapsed++; 
        }
        else{
            this.elapsed += dt;
        }

        if (this.elapsed >= this.interval){
            this.elapsed = 0
            this.signal = true;
            this.callback();
        }
    }
}
