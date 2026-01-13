let map;
let points = [];
let routePath = [];
let stepIndex = 0;
let taxiMarker;

let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 39.9255, lng: 32.8663 }
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map });

  map.addListener("click", (e) => {
    if (points.length === 2) return;
    points.push(e.latLng);

    new google.maps.Marker({
      position: e.latLng,
      map
    });

    if (points.length === 2) {
      rotaCiz();
    }});

 document.getElementById("map").addEventListener("mouseenter", () => {
  document.addEventListener("keydown", handleKey);
    });

    function handleKey(e) {
    if (e.code === "Space") {
     e.preventDefault();
     ilerle();
    }}

}

function rotaCiz() {
  directionsService.route({
    origin: points[0],
    destination: points[1],
    travelMode: "DRIVING"
  }, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);

      const route = result.routes[0];
      const leg = route.legs[0];

      // Talimatları yaz
      const list = document.getElementById("directions");
      list.innerHTML = "";

      leg.steps.forEach(step => {
        const li = document.createElement("li");
        li.innerHTML = `${step.instructions} (${step.distance.text})`;
        list.appendChild(li);
      });

      // Polyline noktaları
      routePath = [];
      route.overview_path.forEach(p => routePath.push(p));

      // Taksi
      taxiMarker = new google.maps.Marker({
        position: routePath[0],
        map,
        icon: {
          url: "https://maps.google.com/mapfiles/kml/shapes/cabs.png",
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      stepIndex = 0;
    }
  });
}

function ilerle() {
  if (!taxiMarker || stepIndex >= routePath.length - 1) return;

  stepIndex++;
  taxiMarker.setPosition(routePath[stepIndex]);
}
