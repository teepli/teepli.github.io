var map, infoWindow;
const url = "https://rata.digitraffic.fi/api/v1/train-locations/latest/";

// Fetch data from digitraffic, pass it to renderdata()
function getData() {
    fetch(url)
        .then(response => response.json())
        .then(response => response.filter(a => a.speed !== 0))
        .then(data => renderData(data))
        .catch(error => console.log("Error" + error))
}

/*
* renderData() initializes new google map to page,
* adds marker to map for each train which speed > 0
* and adds clickable link to each trains own page
* @param json.data
*/
function renderData(data) {
    let center = {lat: 64.173, lng: 24.944};

    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 6, center: center});

    let locations = data.map(function (data) {
        return {
            lng: data.location.coordinates[0], lat: data.location.coordinates[1],
            url: "../YksittainenJuna/Juna.html?numero=" + data.trainNumber
        }
    });

    let markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: {lng: location.lng, lat: location.lat}, url: location.url, map: map,
            icon: "http://maps.google.com/mapfiles/kml/shapes/rail.png"
        })
    });

    for (let i = 0; i < markers.length; i++) {
        google.maps.event.addListener(markers[i], 'click', function () {
            window.location.href = markers[i].url;
        });
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

