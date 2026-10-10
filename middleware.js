const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");

// AUTHENTICATION MIDDLEWARE
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Only remember GET requests, otherwise login would redirect to a route that doesn't exist
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }
    req.flash("error", "You must be logged in to do that");
    return res.redirect("/login");
  }
  next();
};

// Passport clears the session on login, so the URL is copied into res.locals first
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// AUTHORIZATION MIDDLEWARE
module.exports.isListingOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested Listing Does Not Exist");
    return res.redirect("/listings");
  }
  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Requested Review Does Not Exist");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// JOI VALIDATION (SERVER SIDE VALIDATION)
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};
