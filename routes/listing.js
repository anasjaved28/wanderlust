const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

// JOI VALIDATION (SERVER SIDE VALIDATION)
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    return next(new ExpressError(400, error.message));
  }
  next();
};

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
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Requested Listing Does Not Exit");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }),
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
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
  validateListing, // Joi validates request data
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true }, // Mongoose validates the update
    );

    req.flash("success", "Updated Successfully");
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Deleted Successfully");
    res.redirect("/listings");
  }),
);

module.exports = router;
