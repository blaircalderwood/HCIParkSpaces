CarPark = function (name, maxFloors, freeSpaces, totalSpaces, parkingArray, spacesWide) {

    this.name = name;
    this.maxFloors = maxFloors;
    this.freeSpaces = freeSpaces;
    this.totalSpaces = totalSpaces;
    this.parkingArray = parkingArray;
    this.spacesWide = spacesWide;
    this.spacesHigh = this.parkingArray[0].length / spacesWide;
    this.currentFloor = 0;

    return this;

};

CarPark.prototype.displayFreeSpaces = function () {

    document.getElementById("availSpacesPopup").innerText = "Available spaces: " +
        this.freeSpaces + "/" + this.totalSpaces;
    carParkName = carPark.name;

};

CarPark.prototype.show = function () {

    //Find how many roads are needed i.e. follow spaces - road - spaces pattern
    var spacesWithRoads = this.spacesWide + (this.spacesWide - 1);

    for (var i = 0; i < spacesWithRoads; i += 2) {
        this.createSpacesRow((mainCanvas.width() / spacesWithRoads) * i, spacesWithRoads);
        this.putRoad((mainCanvas.width() / spacesWithRoads) * i, spacesWithRoads);
    }

    //Find out which spaces are currently taken
    this.displaySpaces();

    //Set functions to change floor
    mainCanvas.on("swipeleft", this.floorUp);
    mainCanvas.on("swiperight", this.floorDown);

};

//Create a row of six parking spaces
CarPark.prototype.createSpacesRow = function (x, spacesWithRoads) {

    for (var i = 0; i < this.spacesHigh; i++) {
        parkingArray.push(new ParkingSpace(x, (mainCanvas.height() / this.spacesHigh) * i,
            mainCanvas.width() / spacesWithRoads, mainCanvas.height() / this.spacesHigh));
    }

};

CarPark.prototype.putRoad = function (x, spacesWithRoads) {

    var road_arrow = new Image();
    road_arrow.src = 'http://thumbs.dreamstime.com/t/arrow-road-pointing-straight-ahead-painted-white-traffic-sign-tarred-copyspace-32419741.jpg';
    var road_arrow2 = new Image();
    road_arrow2.src = "images/arrow.jpg";

    if (x == 0) {
        road_arrow.onload = function () {

            context.drawImage(road_arrow, x + mainCanvas.width() / spacesWithRoads, 0,
                mainCanvas.width() / spacesWithRoads, 800);
        }
    }
    else {

        road_arrow2.onload = function () {
            context.drawImage(road_arrow2, x + mainCanvas.width() / spacesWithRoads, 0,
                mainCanvas.width() / spacesWithRoads, 800);
        }
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