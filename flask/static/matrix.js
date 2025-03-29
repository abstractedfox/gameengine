//Operations on array buffers or other things that are shaped like matricies

//Return a smaller section of a matrix
//matrix, matrix_x, matrix_y: source matrix & its dimensions
//section_x, section_y, section_w, section_h: the origin point & dimensions of the section to be returned
//Return: a PixelBuffer with the slice 
function matrixSection(matrix, matrix_x, matrix_y, section_x, section_y, section_w, section_h){
    //do this
    return new PixelBuffer(0, 0, []);
}

//Write the contents of matrixDest into matrixSource 
//posX: x position within matrixDest which will contain the x=0 index of matrixSource 
//posY: y position within matrixDest which will contain the y=0 index of matrixSource 
//valid pixelModes as of right now:
    //"overwrite": completely replace the old values with the new values
//valid overflowModes as of right now:
    //"cutoff": if the source PixelBuffer would overflow the bounds of this PixelBuffer's dimensions, discard the out of bounds values
function writeIntoPixelBuffer(matrixSource, matrixDest, posX, posY, pixelMode, overflowMode){
    return new PixelBuffer(0, 0, []);
    
}

//generate a tile map, as a new PixelBuffer, using pixelBufferSource as the tile, with unitsX tiles in the X direction and unitsY tiles in the Y direction
//returns a PixelBuffer
function generateTileMap(pixelBufferSource, unitsX, unitsY){
    return new PixelBuffer(0, 0, []);
}
