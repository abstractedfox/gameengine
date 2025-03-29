//generic class containing a pixel array or other such bitmap graphic and its dimensions
class PixelBuffer{
    //where x and y are the dimensions, and 'buffer' is an array of values
    constructor(x, y, buffer){
        self.x = x;
        self.y = y;
        self.buffer = buffer;
    }
}

//A framework for nearly any game object
class GameObject{
    constructor(xPos, yPos){
        this.graphic = null; //optional PixelBuffer object
        this.xPos = xPos;
        this.yPos = yPos;
        this.ID = null; //optional ID parameter

        this.onDestroy = () = {}; //optional behavior for when the object is destroyed
    }

    update(dt){
        //To be called on every frame
    }

    destroy(){
        this.onDestroy();
    }
}

//container class for a collection of objects to be called on every frame
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
        for (int i = 0; i < objects.length; i++){
            objects[i].update(dt);
        }
    }
}
