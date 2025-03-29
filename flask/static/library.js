//generic class containing a pixel array or other such bitmap graphic and its dimensions
class PixelBuffer{
    //where x and y are the dimensions, and 'buffer' is an array of values
    constructor(x, y, buffer){
        this.x = x;
        this.y = y;
        this.buffer = buffer;
    }

}

//A framework for nearly any game object
class GameObject{
    constructor(xPos, yPos){
        this.graphic = null; //optional PixelBuffer object
        this.xPos = xPos;
        this.yPos = yPos;

        this.viewportX = xPos; //Optional parameter to contain this object's position relative to a containing viewport
        this.viewportY = yPos;

        this.ID = null; //optional ID parameter

        this.onDestroy = () => {}; //optional behavior for when the object is destroyed
    }

    update(dt){
        //To be called on every frame, filled in by the implementation
    }

    destroy(){
        this.onDestroy();
    }
}

//container class for a collection of objects to be called on every frame (in other words, this is what actually calls those 'update' functions in every GameObject)
class ObjectManager{
    constructor(){
        this.objects = [];
    }

    push(object){
        this.objects.push(object);
    }

    destroy(index){
        this.objects[index].destroy();
        this.objects.splice(index,1);
    }

    update(dt){
        for (let i = 0; i < this.objects.length; i++){
            this.objects[i].update(dt);
        }
    }
}

//A relationship of GameObjects, or in other words, a virtual viewport keeping track of where things are relative to each other
//This does NOT track z-position (ie layering), to do that use multiple scenes and render them in the order desired. The priority of overlapping objects is thus undefined
class Scene{
    //Note: Once matrix operations are ready, the matrixSection() function will be used to get the 'viewable' section of a given scene
    constructor(){
        this.GameObjects = [];
        this.originX = 0;
        this.originY = 0;
    }

    //update all tracked GameObjects' viewport positions according to the origin point of this scene
    update(){
        for (let i = 0; i < this.GameObjects.length; i++){
            this.GameObjects[i].viewportX -= this.originX;
            this.GameObjects[i].viewportY -= this.originY;
        }
    }
}
