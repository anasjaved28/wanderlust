const map = new mapboxgl.Map({
  // public files cannot access environment variables, so we pass the token from the server to the client via a script tag in the EJS template
  accessToken: mapToken,
  container: "map", // container ID
  center: [77.2089, 28.6139], // [lng,lt]
  zoom: 9,
});
