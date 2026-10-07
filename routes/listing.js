const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");

const {
  isLoggedIn,
  isListingOwner,
  validateListing,
} = require("../middleware.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing),
);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isListingOwner,
  wrapAsync(listingController.renderEditForm),
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isListingOwner,
  validateListing,
  wrapAsync(listingController.updateListing),
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isListingOwner,
  wrapAsync(listingController.deleteListing),
);

module.exports = router;
