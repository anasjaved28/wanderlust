const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findOneAndUpdate(
    { _id: id, reviews: reviewId },
    { $pull: { reviews: reviewId } },
  );
  if (!listing) {
    req.flash("error", "Review not found on this listing.");
    return res.redirect(`/listings/${id}`);
  }

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
