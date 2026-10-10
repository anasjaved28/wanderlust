// node init/index.js  |  always run this script from root folder
require("dotenv").config();
const mongoose = require("mongoose");
const sampleListings = require("./data.js");
const Listing = require("../models/listing.js");

const MALDIVES = [73.5093, 4.1755]; // [lng, lat], Malé
const OWNER_ID = "6aca8c258c8ef2f21d8b0a9a"; // must be the _id of a real user

const initDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to DB");

  await Listing.deleteMany({});

  const listings = sampleListings.map((obj) => ({
    ...obj,
    owner: OWNER_ID,
    geometry: { type: "Point", coordinates: [...MALDIVES] },
  }));

  await Listing.insertMany(listings);
  console.log("data was initialized");
  await mongoose.disconnect();
};

initDB().catch((err) => {
  console.error(err);
  process.exit(1);
});
