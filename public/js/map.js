const map = new mapboxgl.Map({
  // public files cannot access environment variables, so we pass the token from the server to the client via a script tag in the EJS template
  accessToken: mapToken,
  container: "map", // container ID
  center: listing.geometry.coordinates, // [lng,lt]
  zoom: 10,
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`,
    ),
  )
  .addTo(map);
