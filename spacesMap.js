var context, mainCanvas;
var parkingArray = [];
var currentFloor = 0;
var totalSpaces = 0;

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

    getTotalFreeSpaces();
    $("#parkingPage").on('pageshow', showMapsPage);

};

function showMapsPage() {

    setUpCanvas();
    //Create 3 rows of parking spaces
    createSpacesRow(0);
    createSpacesRow((mainCanvas.width() / 5) * 2);
    createSpacesRow((mainCanvas.width() / 5) * 4);

    getSpaces();

}

function setUpCanvas() {

    //Set up the canvas size to fit the screen
    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() -
        $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
    $('.ui-content').height(content);

    var domCanvas = document.getElementById('mainCanvas');
    mainCanvas = $('#mainCanvas');
    domCanvas.width = $(window).width();
    domCanvas.height = content * 0.95;
    context = mainCanvas[0].getContext('2d');

    /*context.translate(mainCanvas.width / 2, mainCanvas.height / 2);
    context.rotate(180);
    //draw image to canvas here
    context.rotate(-180);
    context.translate(-(mainCanvas.width / 2))*/


    //Set up the swipe left and right functions to change floor
    mainCanvas.on("swipeleft", floorUp);
    mainCanvas.on("swiperight", floorDown);

}

//Create a row of six parking spaces
function createSpacesRow(x){

    for(var i = 0; i < 6; i ++) {
        parkingArray.push(new ParkingSpace(x, (mainCanvas.height() / 5) * i, mainCanvas.width() / 5, mainCanvas.height() / 5));
    }

        var road_arrow = new Image();
        road_arrow.src = 'http://thumbs.dreamstime.com/t/arrow-road-pointing-straight-ahead-painted-white-traffic-sign-tarred-copyspace-32419741.jpg';
        road_arrow.onload = function () {
            context.drawImage(road_arrow, x+mainCanvas.width() / 5, 0,  mainCanvas.width() / 5, 800);
    }
}

//View parking spaces on the floor below
function floorDown(){

    if(currentFloor > 0) {
        currentFloor--;
        getSpaces();
    }

}

//View parking spaces on the floor above
function floorUp(maxFloor){

    if(currentFloor < maxFloor) {
        currentFloor++;
        getSpaces();
    }

}

function getTotalFreeSpaces(){
    getAjax("getTotalFreeSpaces", totalSpacesSuccess);
}

function totalSpacesSuccess(data){
    data = JSON.parse(data);
    $("#availSpacesPopup").text("Available spaces: " + data.freeSpaces + "/" + data.totalSpaces);
    console.log("Available spaces: " + data.freeSpaces + "/" + data.totalSpaces);
}

function getSpaces(){
    getAjax("getSpaces?floor=" + currentFloor, successParkingData);
}

function getMaxFloors(){
    getAjax("getMaxFloors", function(data){return data});
}

function getAjax(urlEnd, successFunction){

    $.ajax({
        type: "GET",
        url: "https://parking-spaces-blaircalderwood.c9.io/" + urlEnd,
        async: "true",
        contentType: "application/json",
        dataType: 'jsonp',
        success: successFunction || function () {
            console.log("Recieved data");
        }
    });

}

function successParkingData(data) {

    document.getElementById("floorText").innerText = ("Floor " + currentFloor);

    data = JSON.parse(data);

    console.log(data);
    for (var i = 0; i < data.length; i++) {
        if (data[i] == 0) {
            spaceFree('green', parkingArray[i],i);
        }
        else {
            spaceFree('red', parkingArray[i],i);


        }
    }

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

    function testPost(colour, spaceIndex) {

        getAjax("putSpace?floor=2&spaceIndex=" + spaceIndex + "&availability=" + (colour == 'red' ? 1 : 0), successTestPost);

    }

    function successTestPost(data) {
        console.log(data);
        getSpaces();
    }


