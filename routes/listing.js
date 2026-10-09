const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const {
  isLoggedIn,
  isListingOwner,
  validateListing,
} = require("../middleware.js");

// Index and Create Routes
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image][url]"),
    wrapAsync(listingController.createListing),
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Update and Delete Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isListingOwner,
    validateListing,
    upload.single("listing[image][url]"),
    wrapAsync(listingController.updateListing),
  )
  .delete(
    isLoggedIn,
    isListingOwner,
    wrapAsync(listingController.deleteListing),
  );

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isListingOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
