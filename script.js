let map;
let start = null;
let end = null;
let directionsService;
let directionsRenderer;
let routePath = [];
let stepIndex = 0;
let taxiMarker = null;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.92, lng: 32.85 },
    zoom: 13
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true
  });

  map.addListener("click", (e) => {
    if (!start) {
      start = e.latLng;
      placeMarker(start);
    } else if (!end) {
      end = e.latLng;
      placeMarker(end);
      drawRoute();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      moveTaxi();
    }
  });
}

function placeMarker(position) {
  new google.maps.Marker({
    position,
    map
  });
}

function drawRoute() {
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const route = result.routes[0];
        const leg = route.legs[0];

        // Yol mesafesi
        document.getElementById("roadDistance").innerText =
          leg.distance.text;

        // Kuş uçuşu mesafe
        const air = haversineDistance(
          { lat: start.lat(), lng: start.lng() },
          { lat: end.lat(), lng: end.lng() }
        );
        document.getElementById("airDistance").innerText =
          air.toFixed(2) + " km";

        // Yol noktaları
        routePath = [];
        route.overview_path.forEach(p => {
          routePath.push(p);
        });

        stepIndex = 0;

        // Pembe taksi
        taxiMarker = new google.maps.Marker({
          position: routePath[0],
          map: map,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#ff4da6",
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: 1
          }
        });
      }
    }
  );
}

function moveTaxi() {
  if (!taxiMarker || stepIndex >= routePath.length) return;

  taxiMarker.setPosition(routePath[stepIndex]);
  stepIndex++;
}

// Haversine – kuş uçuşu mesafe
function haversineDistance(p1, p2) {
  const R = 6371;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(p1.lat * Math.PI / 180) *
    Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
