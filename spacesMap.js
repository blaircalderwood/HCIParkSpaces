var context, mainCanvas;
var parkingArray = [];
var carPark = {};
var carParkName;

window.onload = function () {

    //TO DO: fix this - not best way of doing it
    if ($(location).attr('href').indexOf("#parkingPage") != -1)showMapsPage();

    //Show the map of free spaces
    $("#parkingPage").on('pageshow', showMapsPage);

};

//Show the map of free spaces
function showMapsPage() {

    setUpCanvas();
    if(!carParkName){
        if(localStorage.getItem("carParkName"))carParkName = localStorage.getItem("carParkName");
        else alert("No car park found. Please reload the website and start again.")
    }
    getCarPark(carParkName);

}

function getCarPark(name) {

    localStorage.setItem("carParkName", name);

    carParkName = name;

    if (carPark == {} || carPark.name != name) {
        getAjax("getCarPark?name=" + name, successCarPark);
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

function successCarPark(data) {

    if (data == "Not Found") {
        networkError();
    }
    else {

        data = JSON.parse(data);

        var maxFloors = data.parkingArray.length - 1;
        var freeSpaces = 0;
        var totalSpaces = 0;

        for (var i = 0; i < data.parkingArray.length; i++) {
            for (var j = 0; j < data.parkingArray[i].length; j++) {
                totalSpaces++;
                if (data.parkingArray[i][j] == 0) {
                    freeSpaces++;
                }
            }
        }

        carPark = new CarPark(data.name, maxFloors, freeSpaces, totalSpaces, data.parkingArray, data.spacesWide);

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

