/**Create a new car park object for later manipulation
 *
 * @param name - The name of the car park (used to retrieve data from the server)
 * @param maxFloors - The amount of floors in the car park
 * @param freeSpaces - The amount of spaces in the car park that are currently free
 * @param totalSpaces - The total amount of spaces in the car park (free or taken)
 * @param parkingArray - The array of 1s and 0s that indicate which spaces are free
 * @param spacesWide - The width of the car park in spaces (follows the pattern space - road - space)
 * @param currentFloor - The floor that the user is currently looking at a map of
 * @returns {CarPark}
 * @constructor
 */
CarPark = function (name, maxFloors, freeSpaces, totalSpaces, parkingArray, spacesWide, currentFloor) {

    this.name = name;
    this.maxFloors = maxFloors;
    this.freeSpaces = freeSpaces;
    this.totalSpaces = totalSpaces;
    this.parkingArray = parkingArray;
    //Find how many roads are needed i.e. follow spaces - road - spaces pattern
    this.spacesWide = spacesWide + (spacesWide - 1);
    //The amount of spaces on the floor divided by the width of the car park in spaces will determine its height
    this.spacesHigh = this.parkingArray[0].length / spacesWide;
    this.currentFloor = currentFloor;

    return this;

};

/**Display the total amount of free spaces in textual form to the user on the main map page
 *
 */
CarPark.prototype.displayFreeSpaces = function () {

    document.getElementById("availSpacesPopup").innerText = "Available spaces: " +
        this.freeSpaces + "/" + this.totalSpaces;
    carParkName = carPark.name;

};

/**Display a car park map
 *
 */
CarPark.prototype.show = function () {

    //Display a row of spaces and then display a road next to it
    for (var i = 0; i < this.spacesWide; i += 2) {
        this.createSpacesRow((mainCanvas.width() / this.spacesWide) * i);
        this.putRoad(i);
    }

    //Find out which spaces are currently taken
    this.displaySpaces();

};

/**Create and display a new row of spaces
 *
 * @param x - The x coordinate of the row
 */
CarPark.prototype.createSpacesRow = function (x) {

    for (var i = 0; i < this.spacesHigh; i++) {
        parkingArray.push(new ParkingSpace(x, (mainCanvas.height() / this.spacesHigh) * i,
            mainCanvas.width() / this.spacesWide, mainCanvas.height() / this.spacesHigh));
    }

};

/**Draw a road with an arrow pointing in the direction in which the cars can move
 *
 * @param i - The index of the spaces row that this road will immediately proceed
 */
CarPark.prototype.putRoad = function (i) {

    var x = (mainCanvas.width() / this.spacesWide) * (i + 1);
    var spaceWidth = mainCanvas.width() / this.spacesWide;

    //Draw the arrow pointing upwards every second iteration and downwards every other iteration
        if (i % 4 === 0) {
            context.drawImage(road_arrow, x, 0, spaceWidth, mainCanvas.height());
        }

        else {

            var halfWidth = spaceWidth / 2;
            var halfHeight = mainCanvas.height() / 2;

            //Rotate the canvas 180 degrees to draw the image upside down
            context.translate(x + halfWidth, halfHeight);
            context.rotate(Math.PI);
            context.drawImage(road_arrow, -halfWidth, - halfHeight, spaceWidth, mainCanvas.height());
            context.rotate(-Math.PI);
            context.translate(-(x + halfWidth), -halfHeight);

        }

};

/** View parking spaces on the floor below
 *
 */
CarPark.prototype.floorDown = function () {

    if (this.currentFloor > 0) {
        this.currentFloor--;
        this.displaySpaces();
    }

};

/**View parking spaces on the floor above
 *
 */
CarPark.prototype.floorUp = function () {

    if (this.currentFloor < this.maxFloors) {
        this.currentFloor++;
        this.displaySpaces();
    }

};

/**Display a floor of parking spaces with each space in the relevant colour (green or red)
 *
 */
CarPark.prototype.displaySpaces = function () {

    //Tell the user what floor they are on
    document.getElementById("floorText").innerText = ("Floor " + this.currentFloor);

    //If the car park can be found
    if (this !== {}) {

        //Display green spaces for free spaces and red for taken
        for (var i = 0; i < this.parkingArray[this.currentFloor].length; i++) {
            if (this.parkingArray[this.currentFloor][i] == 0) {
                parkingArray[i].spaceFree('green', i);
            }
            else {
                parkingArray[i].spaceFree('red', i);
            }
        }

    }
    else {
        networkError();
    }

};