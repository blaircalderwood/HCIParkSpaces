var context, mainCanvas;
var parkingArray = [];
var carPark = {};
var carParkName = "Central Car Park";

window.onload = function () {

    //TO DO: fix this - not best way of doing it
    if ($(location).attr('href').indexOf("#parkingPage") != -1)showMapsPage();

    //Show the map of free spaces
    $("#parkingPage").on('pageshow', showMapsPage);

};

//Show the map of free spaces
function showMapsPage() {

    setUpCanvas();
    getCarPark(carParkName);

}

function getCarPark() {
    if (carPark == {} || carPark.name != carParkName) {
        getAjax("getCarPark?name=" + carParkName, successCarPark);
    }
    else if(mainCanvas){
        carPark.show();
    }
    else{
        carPark.displayFreeSpaces();
    }
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

    if (x == 0) {
        road_arrow.onload = function () {

            context.drawImage(road_arrow, x + mainCanvas.width() / 5, 0, mainCanvas.width() / 5, 800);
        }
    }
    else {

        road_arrow2.onload = function () {
            context.drawImage(road_arrow2, x + mainCanvas.width() / 5, 0, mainCanvas.width() / 5, 800);
        }
    }
}

function successCarPark(data) {

    if (data == "Not Found") {
        networkError();
    }
    else {

        data = JSON.parse(data);

        var maxFloors = data.parkingArray.length - 1;
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

        if (mainCanvas) carPark.show();
        else carPark.displayFreeSpaces();
    }

}

function networkError() {
    alert("Car park could not be found. Please check your network settings and try again.");
}

function getAjax(urlEnd, successFunction) {

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

