let map;
let points = [];
let directionsService;
let directionsRenderer;
let taxi;
let routePath = [];
let step = 0;
let airLine;

function initMap() {
  console.log("JS çalışıyor");

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.92, lng: 32.85 },
    zoom: 12
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    panel: document.getElementById("panel")
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
        document.getElementById("road").innerText = leg.distance.text;

        routePath = result.routes[0].overview_path;
        createTaxi();
      }
    }
  );
}

function createTaxi() {
  taxi = new google.maps.Marker({
    position: routePath[0],
    map: map,
    icon: {
      url: "https://maps.google.com/mapfiles/kml/shapes/cabs.png",
      scaledSize: new google.maps.Size(40, 40)
    }
  });
}

function moveTaxi() {
  if (!taxi || step >= routePath.length) return;
  taxi.setPosition(routePath[step]);
  step++;
}

function drawAirLine() {
  const dist = google.maps.geometry.spherical.computeDistanceBetween(
    points[0],
    points[1]
  );

  document.getElementById("air").innerText =
    (dist / 1000).toFixed(2) + " km";

  airLine = new google.maps.Polyline({
    path: points,
    map: map,
    strokeColor: "#ff00aa",
    strokeOpacity: 1,
    strokeWeight: 3
  });
}
