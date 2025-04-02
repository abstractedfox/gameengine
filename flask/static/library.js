//generic class containing a pixel array or other such bitmap graphic and its dimensions

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
}

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
    }

    update(dt) {
        //To be called on every frame, filled in by the implementation
    }

    destroy() {
        this.onDestroy();
    }

    //note: 'objectType' has not been defined yet, but will be used to detect what an object has collided with
    // //params: optional dict holding paramters related to a particular collision
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
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update(dt);
        }
    }
}

//A relationship of GameObjects, or in other words, a virtual viewport keeping track of where things are relative to each other
//This does NOT track z-position (ie layering), to do that use multiple scenes and render them in the order desired. The priority of overlapping objects is thus undefined
export class Scene {
    //Note: Once matrix operations are ready, the matrixSection() function will be used to get the 'viewable' section of a given scene
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
