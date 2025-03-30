//Sequence: An object that has its own 'init' function, tracks its own objects, and passes 'update' calls through to everything it contains.
//A sequence is, in effect, a 'level', a pause menu, or any other disparate state that we may want the game to be in

//Sequence may be extended to add implementation-specific functionality, but its core functions should not be altered
class Sequence{
    constructor(){
        this.gameObjects = [];
        this.scenes = [];

        this.onStart = () => {}; //Optional user-supplied function
        this.onEnd = () = {};//Optional user-supplied function
    }

    start(){
        this.onStart();
    }

    end(){
        this.onEnd();
    }

    update(dt){
        for (let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].update(dt);
        }
        
        for (let i = 0; i < this.scenes.length; i++){
            this.scenes[i].update();
        }
    }
}

//A class for containing sequences and deciding which one to advance on each frame
//Uses a stack, and always advances the sequence at the top of the stack
class SequenceDispatcher(){
    constructor(){
        this.sequences = [];
    }

    update(dt){
        this.sequences.at(-1)();
    }

    push(sequence){
        this.sequences.push(sequence);
    }

    //Also returns the sequence at the top of the stack
    pop(){
        return this.sequences.pop();
    }
}

