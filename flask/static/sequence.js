//Sequence: An object that has its own 'init' function, tracks its own objects, and passes 'update' calls through to everything it contains.
//A sequence is, in effect, a 'level', a pause menu, or any other disparate state that we may want the game to be in

import { ObjectManager } from './library.js';

//Sequence may be extended to add implementation-specific functionality, but its core functions should not be altered
export class Sequence {
    constructor(label = null) {
        this.objectManager = new ObjectManager();
        this.scenes = [];

        this.onStart = () => {}; //Optional user-supplied function
        this.onEnd = () => {};//Optional user-supplied function
        this.started = false;
        this.label = label; //Programmer convenience; it may be nice to be able to say what a sequence is for
    }

    start(){
        this.onStart();
    }

    end(){
        this.onEnd();
    }

    update(dt){
        if (!this.started){
            this.start();
        }

        this.objectManager.update(dt);

        for (let i = 0; i < this.scenes.length; i++){
            this.scenes[i].update();
        }
    }
}

//A class for containing sequences and deciding which one to advance on each frame
//Uses a stack, and always advances the sequence at the top of the stack
export class SequenceDispatcher {
    constructor() {
        this.sequences = [];
    }

    update(dt){
        this.sequences.at(-1).update(dt);
    }

    push(sequence, cancelInitCall = false){
        this.sequences.push(sequence);
        if (!cancelInitCall){
            this.sequences.at(-1).start();
        }
    }

    //Also returns the sequence at the top of the stack
    pop(cancelEndCall = false){
        if (!cancelEndCall){
            this.sequences.at(-1).end();
        }
        return this.sequences.pop();
    }
}

