var context, mainCanvas;
var parkingArray = [];

//Create a new parking space and set it's availability to free
ParkingSpace = function(x, y, width, height){

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.free = true;
    spaceFree('green', this);
    return this;

};

window.onload = function () {

    //Set up the canvas size to fit the screen
    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
    $('.ui-content').height(content);

    var domCanvas = document.getElementById('mainCanvas');
    mainCanvas = $('#mainCanvas');
    domCanvas.width = $(window).width();
    domCanvas.height = content;
    context = mainCanvas[0].getContext('2d');

    //Fill the canvas with grey to illustrate the car park's roads
    context.fillStyle = 'grey';
    context.fillRect(0, 0, mainCanvas.width(), mainCanvas.height());

    //Set up the swipe left and right functions to change floor
    mainCanvas.on("swipeleft", floorDown);
    mainCanvas.on("swiperight", floorUp);

    //Create 3 rows of parking spaces
    createSpacesRow(0);
    createSpacesRow((mainCanvas.width() / 5) * 2);
    createSpacesRow((mainCanvas.width() / 5) * 4);

    getAjax("getSpaces", successParkingData);

};

//Create a row of six parking spaces
function createSpacesRow(x){

    for(var i = 0; i < 6; i ++){
        parkingArray.push(new ParkingSpace(x, (mainCanvas.height() / 5) * i, mainCanvas.width() / 5, mainCanvas.height() / 5));
    }

}

//View parking spaces on the floor below
function floorDown(){

    spaceFree('green', parkingArray[1]);
    spaceFree('red', parkingArray[14]);
}

//View parking spaces on the floor above
function floorUp(){

    spaceFree('green', parkingArray[14]);
    spaceFree('red', parkingArray[1]);
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

function successParkingData(data){

    data = JSON.parse(data);

    console.log(data);
    for(var i = 0; i < data.length; i ++){
        if(data[i] == 0){
            spaceFree('green', parkingArray[i]);
        }
        else{
            spaceFree('red', parkingArray[i]);
        }
    }
}

//Change the colour of a space to indicate whether it is free (green) or taken (red)
function spaceFree(colour, space){

    context.fillStyle = colour;
    context.strokeStyle = 'white';
    context.strokeWidth = 5;
    context.fillRect(space.x, space.y, space.width, space.height);
    context.strokeRect(space.x, space.y, space.width, space.height);

}

function testPost(colour, spaceIndex){

        getAjax("putSpace?spaceIndex=" + spaceIndex + "&availability=" + 0, successTestPost);

}

function successTestPost(data){
    console.log(data);
}