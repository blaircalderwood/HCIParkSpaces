var context, mainCanvas;
var parkingArray = [];
var carPark = {};
var carParkName = "Central Car Park";

CarPark = function(name, maxFloors, freeSpaces, totalSpaces, parkingArray, spacesWide, spacesHigh){

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

//Create a new parking space and set it's availability to free
ParkingSpace = function(x, y, width, height){

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    spaceFree('green', this,parkingArray.length);
    return this;

};

window.onload = function () {

    //TO DO: fix this - not best way of doing it
    if($(location).attr('href').indexOf("#parkingPage") != -1)showMapsPage();

    //Show the map of free spaces
    $("#parkingPage").on('pageshow', showMapsPage);

};

//Show the map of free spaces
function showMapsPage() {

    setUpCanvas();

    getAjax("getCarPark?name=" + carParkName, successCarPark);

}

function setUpCanvas() {

    var uiContent = $('.ui-content');

    //Set up the canvas size to fit the screen
    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() -
        $(".ui-footer").outerHeight() - uiContent.outerHeight() + uiContent.height();
    uiContent.height(content);

    var domCanvas = document.getElementById('mainCanvas');
    mainCanvas = $('#mainCanvas');
    domCanvas.width = $(window).width();
    domCanvas.height = content * 0.95;
    context = mainCanvas[0].getContext('2d');

}

//Create a row of six parking spaces
function createSpacesRow(x) {

    for (var i = 0; i < 6; i++) {
        parkingArray.push(new ParkingSpace(x, (mainCanvas.height() / 5) * i, mainCanvas.width() / 5, mainCanvas.height() / 5));
    }

    var road_arrow = new Image();
    road_arrow.src = 'http://thumbs.dreamstime.com/t/arrow-road-pointing-straight-ahead-painted-white-traffic-sign-tarred-copyspace-32419741.jpg';
    var road_arrow2 = new Image();
    road_arrow2.src = "images/arrow.jpg";

    if (x  == 0) {
    road_arrow.onload = function () {

            context.drawImage(road_arrow, x + mainCanvas.width() / 5, 0, mainCanvas.width() / 5, 800);}
        }
    else {

        road_arrow2.onload = function () {
            context.drawImage(road_arrow2, x + mainCanvas.width() / 5, 0, mainCanvas.width() / 5, 800);
        }
    }
}

function successCarPark(data){

    if(data == "Not Found"){
        networkError();
    }
    else {

        data = JSON.parse(data);

        var maxFloors = data.parkingArray.length;
        var freeSpaces = 0;
        var totalSpaces = 0;

        for (var i = 0; i < maxFloors; i++) {
            for (var j = 0; j < data.parkingArray[i].length; j++) {
                totalSpaces++;
                if (data.parkingArray[i][j] == 0) {
                    freeSpaces++;
                }
            }
        }

        carPark = new CarPark(data.name, maxFloors, freeSpaces, totalSpaces, data.parkingArray, data.spacesWide, data.spacesHigh);

        carPark.show();
    }

}

CarPark.prototype.show = function(){

    for(var i = 0; i <= 4; i += 2){
        createSpacesRow((mainCanvas.width() / 5) * i)
    }

    //Find out which spaces are currently taken
    this.displaySpaces();

    //Set functions to change floor
    mainCanvas.on("swipeleft", this.floorUp);
    mainCanvas.on("swiperight", this.floorDown);

};

//View parking spaces on the floor below
CarPark.prototype.floorDown = function(){

    if(this.currentFloor > 0) {
        this.currentFloor--;
        this.displaySpaces();
    }

};

//View parking spaces on the floor above
CarPark.prototype.floorUp = function(maxFloor){

    if(this.currentFloor < this.maxFloors) {
        this.currentFloor++;
        this.displaySpaces();
    }

};

CarPark.prototype.displaySpaces = function(){

    if(this !== {}){

        //TO DO: Change current floor to this.currentFloor
        document.getElementById("floorText").innerText = ("Floor " + this.currentFloor);

        localStorage.setItem('parkingArray', this);

        for (var i = 0; i < this.parkingArray[this.currentFloor].length; i++) {
            if (this.parkingArray[this.currentFloor][i] == 0) {
                spaceFree('green', parkingArray[i],i);
            }
            else {
                spaceFree('red', parkingArray[i],i);

            }
        }

    }
    else{
        networkError();
    }
};

function networkError(){
    alert("Car park could not be found. Please check your network settings and try again.");
}

function getAjax(urlEnd, successFunction){

    $.ajax({
        type: "GET",
        url: "https://parking-spaces-blaircalderwood.c9.io/" + urlEnd,
        async: "true",
        contentType: "application/json",
        dataType: 'jsonp',
        success: successFunction || function () {
            console.log("Received data");
        }
    });

}

//Change the colour of a space to indicate whether it is free (green) or taken (red)
    function spaceFree(colour, space, index) {

        context.fillStyle = colour;
        context.strokeStyle = 'white';
        context.strokeWidth = 5;
        context.fillRect(space.x, space.y, space.width, space.height);
        context.strokeRect(space.x, space.y, space.width, space.height);
        context.strokeText(index+1, space.x + (space.width / 2), space.y + (space.height / 2));
    }

