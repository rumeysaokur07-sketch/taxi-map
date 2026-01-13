let map;
let points = [];
let directionsService;
let directionsRenderer;
let taxiMarker;
let routePath = [];
let stepIndex = 0;
let airLine;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.92, lng: 32.85 },
    zoom: 12
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map });

  map.addListener("click", (e) => {
    if (points.length < 2) {
      points.push(e.latLng);
      new google.maps.Marker({ position: e.latLng, map });

      if (points.length === 2) {
        drawRoute();
        drawAirDistance();
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      moveTaxi();
    }
  });
}

function drawRoute() {
  directionsService.route(
    {
      origin: points[0],
      destination: points[1],
      travelMode: "DRIVING"
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const leg = result.routes[0].legs[0];
        document.getElementById("roadDistance").innerText = leg.distance.text;

        routePath = result.routes[0].overview_path;
        createTaxi();
      }
    }
  );
}

function createTaxi() {
  taxiMarker = new google.maps.Marker({
    position: routePath[0],
    map,
    icon: {
      url: "https://maps.google.com/mapfiles/kml/shapes/cabs.png",
      scaledSize: new google.maps.Size(40, 40)
    }
  });
}

function moveTaxi() {
  if (!taxiMarker || stepIndex >= routePath.length) return;

  taxiMarker.setPosition(routePath[stepIndex]);
  stepIndex++;
}

function drawAirDistance() {
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    points[0],
    points[1]
  );

  document.getElementById("airDistance").innerText =
    (distance / 1000).toFixed(2) + " km";

  airLine = new google.maps.Polyline({
    path: points,
    map,
    strokeColor: "#FF00AA",
    strokeOpacity: 1,
    strokeWeight: 3
  });
}
