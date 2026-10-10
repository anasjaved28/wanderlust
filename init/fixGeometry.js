require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await Listing.updateMany(
    {
      $or: [
        { "geometry.type": { $exists: false } },
        { "geometry.coordinates.0": { $exists: false } },
      ],
    },
    { $set: { geometry: { type: "Point", coordinates: [73.5093, 4.1755] } } },
  );

  console.log(`Updated ${result.modifiedCount} listings`);
  await mongoose.disconnect();
})();
