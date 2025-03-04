console.log("Program Main Start");

count = 0;
function programMain(deltaT){
    for (i = 0; i < viewbuffer.length; i++){
        viewbuffer[i] = 0;
    }

    viewbuffer[count] = 15;
    count++;
    if (count > viewbuffer.length){
        count = 0;
    }
}
