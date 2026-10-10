const map = new mapboxgl.Map({
  accessToken: mapToken,
  container: "map",
  center: mapData.coordinates, // [lng, lat]
  zoom: 10,
});

const popupContent = document.createElement("div");
const heading = document.createElement("h4");
heading.textContent = mapData.location;
const note = document.createElement("p");
note.textContent = "Exact Location provided after booking";
popupContent.append(heading, note);

new mapboxgl.Marker({ color: "red" })
  .setLngLat(mapData.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent))
  .addTo(map);
