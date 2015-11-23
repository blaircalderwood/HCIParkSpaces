var x = document.getElementById("demo");
var map;
var markerArray = [];

/**Create a new SelectedMarker object
 *
 * @param name - The name of the marker (car park name
 * @param lat - The latitude in which the marker will be displayed
 * @param lng - The longitude in which the marker will be displayed
 * @returns {SelectedMarker}
 * @constructor
 */
SelectedMarker = function(name, lat, lng){

    this.carParkName = name;
    this.lat = lat;
    this.lng = lng;

    return this;

};

// Created by following the tutorial at https://developers.google.com/maps/documentation/javascript/tutorial

/**Called when the Google map has been successfully retrieved from the server
 *
 */
function gMapLoaded() {

    // Show the loading sign until the user's current position is displayed on the map
    $.mobile.loading("show");

    // Create a new Google Map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    });

    // Display the user's current position on the map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this device.";
    }

    // Create the search box and display it on screen
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for clicks on the search box results
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Delete the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: "https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png",
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    /** Show the user's map position on screen
     *
     * @param position - User's latitude and longitude position
     */
    function setPosition(position) {
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(pos, 5);
        console.log(position);
        $.mobile.loading("hide");

    }

    //Create a new parking icon to be used as a marker
    var icon = {
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Parking_icon.svg", //url
        scaledSize: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };

    //Retrieve the positions of each car park from the server
    getAjax("carParkPositions", placeMarkers);

    /**Place the markers on screen for user selection
     *
     * @param data - The car park positions retrieved from the server
     */
    function placeMarkers(data){

        markerArray = JSON.parse(data);

        //Place a marker for each item in array
        for(var i = 0; i < markerArray.length; i ++) {

            marker = new google.maps.Marker({
                icon: icon,
                map: map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: {
                    lat: markerArray[i].lat, lng: markerArray[i].lng
                }
            });

            marker.addListener('click', click);

        }

    }

}

/**Get the details of a car park when its respective marker is clicked
 *
 */
function click(){

    //Round the latitude and longitude to ensure numbers for marker lookup will be the same
    var lat = Math.round(this.position.lat() * 1000000) / 1000000;
    var lng = Math.round(this.position.lng() * 1000000) / 1000000;

    //Search for the car park by comparing locations with the location of the clicked marker
    var name;
    for(var i = 0; i < markerArray.length; i ++){
        if(lat == markerArray[i].lat && lng == markerArray[i].lng){
            name = markerArray[i].name;
            break;
        }
    }

    //Get the car park details from the server and display the amount of free/total spaces
    getCarPark(name);

    //Open a popup and display the car park name
    document.getElementById("carParkName").innerText = name;
    $("#popupBasic").popup("open");

    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    }

}
