let map;
let points = [];
let directionsService;
let directionsRenderer;
let taxiMarker;
let airLine;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.92, lng: 32.85 },
    zoom: 12
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    panel: document.getElementById("directions")
  });

  map.addListener("click", (e) => {
    if (points.length < 2) {
      points.push(e.latLng);
      new google.maps.Marker({ position: e.latLng, map });

      if (points.length === 2) {
        drawRoute();
        drawAirLine();
      }
    }
  });
}

function drawRoute() {
  directionsService.route(
    {
      origin: points[0],
      destination: points[1],
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const leg = result.routes[0].legs[0];
        document.getElementById("roadDistance").innerText =
          leg.distance.text;

        createTaxi(result.routes[0].overview_path);
      }
    }
  );
}

function createTaxi(path) {
  taxiMarker = new google.maps.Marker({
    position: path[0],
    map: map,
    icon: {
      url: "https://maps.google.com/mapfiles/kml/shapes/cabs.png",
      scaledSize: new google.maps.Size(40, 40)
    }
  });
}

function drawAirLine() {
  const distance =
    google.maps.geometry.spherical.computeDistanceBetween(
      points[0],
      points[1]
    );

  document.getElementById("airDistance").innerText =
    (distance / 1000).toFixed(2) + " km";

  airLine = new google.maps.Polyline({
    path: points,
    map: map,
    strokeColor: "#ff1493",
    strokeOpacity: 1,
    strokeWeight: 3
  });
}
