// node init/index.js  |  always run this script from root folder
require("dotenv").config();
const mongoose = require("mongoose");
let sampleListings = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = process.env.MONGO_URI;
console.log(MONGO_URL);

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  sampleListings = sampleListings.map((obj) => ({
    ...obj,
    owner: "6ac34755386a32dc2e0681c1",
  }));

  await Listing.insertMany(sampleListings);
  console.log("data was initialized");
};

initDB();
