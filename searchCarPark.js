var x = document.getElementById("demo");
var map;

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
}

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a


function initAutocomplete() {

    $.mobile.loading("show");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
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
    // [END region_getplaces]

    // pick list containing a mix of places and predicted search terms.
    function setPosition(position) {
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(pos, 5);
        console.log(position);
        $.mobile.loading("hide");

    }

    var icon = {
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Parking_icon.svg", //url
        scaledSize: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };

    marker = new google.maps.Marker({
        icon: icon,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: {
            lat: 55.864408, lng: -4.260743
        }
    });
    marker.addListener('click', toggleBounce);


    /*marker = new google.maps.Marker({
        icon: icon,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: {
            lat: 55.864408, lng: -4.260743
        }
    });
    marker.addListener('click', toggleBounce);*/


}

function toggleBounce() {

    $("#popupBasic").popup("open");
    getCarPark(document.getElementById("carParkName").innerText);

    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }


}
