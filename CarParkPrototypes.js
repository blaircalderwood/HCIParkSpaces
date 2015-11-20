CarPark = function (name, maxFloors, freeSpaces, totalSpaces, parkingArray, spacesWide, currentFloor) {

    this.name = name;
    this.maxFloors = maxFloors;
    this.freeSpaces = freeSpaces;
    this.totalSpaces = totalSpaces;
    this.parkingArray = parkingArray;
    //Find how many roads are needed i.e. follow spaces - road - spaces pattern
    this.spacesWide = spacesWide + (spacesWide - 1);
    this.spacesHigh = this.parkingArray[0].length / spacesWide;
    this.currentFloor = currentFloor;

    return this;

};

CarPark.prototype.displayFreeSpaces = function () {

    document.getElementById("availSpacesPopup").innerText = "Available spaces: " +
        this.freeSpaces + "/" + this.totalSpaces;
    carParkName = carPark.name;

};

CarPark.prototype.show = function () {

    for (var i = 0; i < this.spacesWide; i += 2) {
        this.createSpacesRow((mainCanvas.width() / this.spacesWide) * i);
        this.putRoad(i);
    }

    //Find out which spaces are currently taken
    this.displaySpaces();

    //Set functions to change floor
    mainCanvas.on("swipeleft", this.floorUp);
    mainCanvas.on("swiperight", this.floorDown);

};

//Create a row of six parking spaces
CarPark.prototype.createSpacesRow = function (x) {

    for (var i = 0; i < this.spacesHigh; i++) {
        parkingArray.push(new ParkingSpace(x, (mainCanvas.height() / this.spacesHigh) * i,
            mainCanvas.width() / this.spacesWide, mainCanvas.height() / this.spacesHigh));
    }

};

CarPark.prototype.putRoad = function (i) {

    var x = (mainCanvas.width() / this.spacesWide) * (i + 1);
    var spaceWidth = mainCanvas.width() / this.spacesWide;

        if (i % 4 === 0) {

            context.drawImage(road_arrow, x, 0, spaceWidth, mainCanvas.height());
        }

        else {

            var halfWidth = spaceWidth / 2;
            var halfHeight = mainCanvas.height() / 2;

            context.translate(x + halfWidth, halfHeight);
            context.rotate(Math.PI);
            context.drawImage(road_arrow, -halfWidth, - halfHeight, spaceWidth, mainCanvas.height());
            context.rotate(-Math.PI);
            context.translate(-(x + halfWidth), -halfHeight);

        }

};


//View parking spaces on the floor below
CarPark.prototype.floorDown = function () {

    if (this.currentFloor > 0) {
        this.currentFloor--;
        this.displaySpaces();
    }

};

//View parking spaces on the floor above
CarPark.prototype.floorUp = function () {

    if (this.currentFloor < this.maxFloors) {
        this.currentFloor++;
        this.displaySpaces();
    }

};

CarPark.prototype.displaySpaces = function () {

    document.getElementById("floorText").innerText = ("Floor " + this.currentFloor);

    if (this !== {}) {

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