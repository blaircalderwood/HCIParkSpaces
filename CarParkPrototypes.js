CarPark = function (name, maxFloors, freeSpaces, totalSpaces, parkingArray, spacesWide, spacesHigh) {

    this.name = name;
    this.maxFloors = maxFloors;
    this.freeSpaces = freeSpaces;
    this.totalSpaces = totalSpaces;
    this.parkingArray = parkingArray;
    this.spacesWide = spacesWide;
    this.spacesHigh = spacesHigh;
    this.currentFloor = 0;

    return this;

};

CarPark.prototype.displayFreeSpaces = function () {

    document.getElementById("availSpacesPopup").innerText = "Available spaces: " +
        this.freeSpaces + "/" + this.totalSpaces;
    carParkName = carPark.name;

};

CarPark.prototype.show = function () {

    for (var i = 0; i <= 4; i += 2) {
        createSpacesRow((mainCanvas.width() / 5) * i)
    }

    //Find out which spaces are currently taken
    this.displaySpaces();

    //Set functions to change floor
    mainCanvas.on("swipeleft", this.floorUp);
    mainCanvas.on("swiperight", this.floorDown);

};

//View parking spaces on the floor below
CarPark.prototype.floorDown = function () {

    if (this.currentFloor > 0) {
        this.currentFloor--;
        this.displaySpaces();
    }

};

//View parking spaces on the floor above
CarPark.prototype.floorUp = function (maxFloor) {

    if (this.currentFloor < this.maxFloors) {
        this.currentFloor++;
        this.displaySpaces();
    }

};

CarPark.prototype.displaySpaces = function () {

    if (this !== {}) {

        //TO DO: Change current floor to this.currentFloor
        document.getElementById("floorText").innerText = ("Floor " + this.currentFloor);

        localStorage.setItem('parkingArray', this);

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