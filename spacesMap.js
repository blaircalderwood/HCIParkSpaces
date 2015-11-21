var context, mainCanvas;
var parkingArray = [];
var carPark = {};
var carParkName;
var road_arrow;

/**Perform on window load
 *
 */
window.onload = function () {

    //Check if reloaded page is the car park space map (fixes an issue that prevented loading of space map)
    if ($(location).attr('href').indexOf("#parkingPage") != -1)showMapsPage();

    //Show the map of free spaces
    $("#parkingPage").on('pageshow', showMapsPage);

};

/**Load the arrow image and the space map
 *
 */
function showMapsPage() {

    road_arrow = new Image();
    road_arrow.src = "images/arrow.png";
    road_arrow.onload = function () {
        setUpCanvas();

        getCarPark(carParkName);

    }

}

/**Get the car park details from the server
 *
 * @param name - the name of the car park (e.g. "Byres Road Car Park")
 */
function getCarPark(name) {

    //If no name is passed in then the user has reloaded the page - use the last known car park name
    if (!name) {
        if (localStorage.getItem("carParkName")){
            carParkName = localStorage.getItem("carParkName");
        }
        else alert("No car park found. Please reload the website and start again.")
    }
    //If a name is found save it to local storage in case user reloads page
    else {
        carParkName = name;
        localStorage.setItem("carParkName", carParkName);
    }

    //Get the car park details from the server
    if (carPark == {} || carPark.name != carParkName) {
        getAjax("getCarPark?name=" + carParkName, successCarPark);
    }

    //Check for changed space maps (e.g. a space has change from taken to free) every second
    setInterval(function() {
        getAjax("getCarPark?name=" + carParkName, successCarPark);
    }, 1000);

}

/**Load the map canvas from the DOM
 *
 */
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

    //Set functions to change floor
    mainCanvas.on("swipeleft", this.floorUp);
    mainCanvas.on("swiperight", this.floorDown);

}

/**Create a new CarPark object with details retrieved from the server
 *
 * @param data - The data recieved from the server
 */
function successCarPark(data) {

    parkingArray = [];

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

        carPark = new CarPark(data.name, maxFloors, freeSpaces, totalSpaces, data.parkingArray, data.spacesWide, carPark.currentFloor || 0);

        if ($(location).attr('href').indexOf("#parkingPage") !== -1) carPark.show();
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

//Test functions not implemented in final version but have been included to show certain tests used

function testPutSpaces(availability){

    getAjax("putSpace?name=Byres%20Road%20Car%20Park&floor=0&spaceIndex=5&availability=" + availability)
}

function generateRandomParking(floors, spaces){

    var newParkingArray = [];

    for(var i = 0; i < floors; i ++){
        newParkingArray[i] = [];
        for(var j = 0; j < spaces; j ++){
            newParkingArray[i][j] = Math.round(Math.random());
        }
    }

    return JSON.stringify(newParkingArray);

}

