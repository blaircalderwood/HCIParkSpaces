/**Create a new parking space and set it's availability to free
 *
 * @param x - The x value of the space
 * @param y - The y value of the space
 * @param width - The width of the space
 * @param height - The height of the space
 * @returns {ParkingSpace}
 * @constructor
 */
ParkingSpace = function (x, y, width, height) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.spaceFree('green', parkingArray.length);
    return this;

};

/**Change the colour of a space to indicate whether it is free (green) or taken (red)
 *
 * @param colour - Set to "green" to indicate a free space or "red" to indicate a taken space
 * @param index - The index of the space in the parking array
 */
ParkingSpace.prototype.spaceFree = function(colour, index) {

    context.fillStyle = colour;
    context.strokeStyle = 'white';
    context.strokeWidth = 5;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.strokeText(index, this.x + (this.width / 2), this.y + (this.height / 2));

};