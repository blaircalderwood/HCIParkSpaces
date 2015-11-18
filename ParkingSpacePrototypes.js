//Create a new parking space and set it's availability to free
ParkingSpace = function (x, y, width, height) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.spaceFree('green', parkingArray.length);
    return this;

};

//Change the colour of a space to indicate whether it is free (green) or taken (red)
ParkingSpace.prototype.spaceFree = function(colour, index) {

    context.fillStyle = colour;
    context.strokeStyle = 'white';
    context.strokeWidth = 5;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.strokeText(index, this.x + (this.width / 2), this.y + (this.height / 2));

};