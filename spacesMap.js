var context, mainCanvas;
var parkingArray = [];
var currentFloor = 0;

//Create a new parking space and set it's availability to free
ParkingSpace = function(x, y, width, height){

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    spaceFree('green', this);
    return this;

};

window.onload = function () {

    $("#parkingPage").on('pageshow', showMapsPage);

};

function showMapsPage(){

    setUpCanvas();
    //Create 3 rows of parking spaces
    createSpacesRow(0);
    createSpacesRow((mainCanvas.width() / 5) * 2);
    createSpacesRow((mainCanvas.width() / 5) * 4);

    getSpaces();
}

function setUpCanvas(){

    //Set up the canvas size to fit the screen
    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() -
        $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
    $('.ui-content').height(content);

    var domCanvas = document.getElementById('mainCanvas');
    mainCanvas = $('#mainCanvas');
    domCanvas.width = $(window).width();
    domCanvas.height = content * 0.95;
    context = mainCanvas[0].getContext('2d');


    var blueprint_background = new Image();
    blueprint_background.src = 'http://thumbs.dreamstime.com/t/arrow-parking-lot-white-painted-stones-39394625.jpg';
    blueprint_background.onload = function(){
        context.drawImage(blueprint_background,100,0,400,700);
        //rotateAndPaintImage ( context,blueprint_background ,Math.PI);
        context.drawImage(blueprint_background,500,0,400,700);
        //blueprint_background.rotate( -Math.PI );








    //Fill the canvas with grey to illustrate the car park's roads
    //context.fillStyle = 'grey';
    //context.fillRect(0, 0, mainCanvas.width(), mainCanvas.height());


    //Direction Lines



    context.beginPath();
    context.moveTo( mainCanvas.width()/3.5,  mainCanvas.height()/5);
    context.lineTo(mainCanvas.width()/3.5, mainCanvas.height()/1.2 );
    context.stroke();
    context.closePath();
    context.fillStyle = 'black';
    drawArrowhead(mainCanvas.width()/3.5, mainCanvas.height()/1.2 ,Math.PI);

    function drawArrowhead(x,y,radians){
        context.save();
        context.beginPath();
        context.translate(x,y);
        context.rotate(radians);
        context.moveTo(0,0);
        context.lineTo(5,20);
        context.lineTo(-5,20);
        context.closePath();
        context.restore();
        context.fill();
    }


    //Set up the swipe left and right functions to change floor
<<<<<<< Updated upstream:spacesMap.js
    mainCanvas.on("swipeleft", floorUp);
    mainCanvas.on("swiperight", floorDown);
=======
    mainCanvas.on("swipeleft", floorDown);
    mainCanvas.on("swiperight", floorUp);

    //Create 3 rows of parking spaces
    createSpacesRow(0);
    createSpacesRow((mainCanvas.width() / 5) * 2);
    createSpacesRow((mainCanvas.width() / 5) * 4);

    getAjax("getSpaces", successParkingData);

};
};
>>>>>>> Stashed changes:mainCode.js

}
//Create a row of six parking spaces
function createSpacesRow(x){

    for(var i = 0; i < 6; i ++){
        parkingArray.push(new ParkingSpace(x, (mainCanvas.height() / 5) * i, mainCanvas.width() / 5, mainCanvas.height() / 5));
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

function getSpaces(){
    getAjax("getSpaces?floor=" + currentFloor, successParkingData);
}

function getMaxFloors(){
    getAjax("getMaxFloors", floorUp);
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

    document.getElementById("floorText").innerText = ("Floor " + currentFloor);

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

        getAjax("putSpace?floor=2&spaceIndex=" + spaceIndex + "&availability=" + (colour=='red'? 1: 0), successTestPost);

}

function successTestPost(data){
    console.log(data);
    getSpaces();
}