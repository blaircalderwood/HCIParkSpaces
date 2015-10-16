var canvas, context;
var parkingArray = [];

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

    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
    $('.ui-content').height(content);

    $('mainCanvas').height(content);

    canvas = document.getElementById('mainCanvas');
    var mainCanvas = $('#mainCanvas');
    mainCanvas.height(content);
    mainCanvas.width($('.ui-content').width());
    context = canvas.getContext('2d');

    context.fillStyle = 'grey';
    context.fillRect(0, 0, canvas.width, canvas.height);
    //spaceFree('red', 0, 0);
    mainCanvas.on("swipeleft", swipeLeft);
    mainCanvas.on("swiperight", swipeRight);

    for(var i = 0; i < 6; i ++){
        parkingArray.push(new ParkingSpace(0, (canvas.height / 5) * i, canvas.width / 3, canvas.height / 5));
    }

};

function swipeLeft(){

    spaceFree('green', parkingArray[1]);
    spaceFree('red', parkingArray[0]);
}

function swipeRight(){

    spaceFree('green', parkingArray[0]);
    spaceFree('red', parkingArray[1]);
}

function spaceFree(colour, space){

    context.fillStyle = colour;
    context.fillRect(space.x, space.y, space.x + canvas.width / 4, space.y + canvas.height / 5);
}