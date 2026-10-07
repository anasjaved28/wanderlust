const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isListingOwner,
  validateListing,
} = require("../middleware.js");

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "Listing Created Successfully");
    return res.redirect("/listings");
  }),
);

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } }) // Nested populate to get the author of each review
      .populate("owner");
    if (!listing) {
      req.flash("error", "Requested Listing Does Not Exit");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  }),
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isListingOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Requested Listing Does Not Exist");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
  }),
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isListingOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true }, // Mongoose validates the update
    );

    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isListingOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Deleted Successfully");
    res.redirect("/listings");
  }),
);

module.exports = router;
