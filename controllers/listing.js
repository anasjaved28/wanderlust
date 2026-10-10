const Listing = require("../models/listing.js");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_PUBLIC_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Create New Listing
const pickListingFields = ({
  title,
  description,
  price,
  location,
  country,
}) => ({
  title,
  description,
  price,
  location,
  country,
});

const geocode = async (location) => {
  const response = await geocodingClient
    .forwardGeocode({ query: location, limit: 1 })
    .send();
  return response.body.features[0]?.geometry;
};

module.exports.createListing = async (req, res) => {
  const geometry = await geocode(req.body.listing.location);
  if (!geometry) {
    req.flash(
      "error",
      "Could not find that location. Try being more specific.",
    );
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(pickListingFields(req.body.listing));
  newListing.owner = req.user._id;
  newListing.geometry = geometry;
  if (req.file) {
    newListing.image = { filename: req.file.filename, url: req.file.path };
  }

  await newListing.save();

  req.flash("success", "Listing Created Successfully");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) // Nested populate to get the author of each review
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested Listing Does Not Exit");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested Listing Does Not Exist");
    return res.redirect("/listings");
  }
  // Resize the Preview image using Cloudinary transformations
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_250,h_150,c_fill,q_auto",
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested Listing Does Not Exist");
    return res.redirect("/listings");
  }

  const locationChanged = req.body.listing.location !== listing.location;
  Object.assign(listing, pickListingFields(req.body.listing));

  if (locationChanged) {
    const geometry = await geocode(listing.location);
    if (!geometry) {
      req.flash(
        "error",
        "Could not find that location. Try being more specific.",
      );
      return res.redirect(`/listings/${id}/edit`);
    }
    listing.geometry = geometry;
  }

  if (req.file) {
    listing.image = { filename: req.file.filename, url: req.file.path };
  }
  await listing.save();
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Deleted Successfully");
  res.redirect("/listings");
};
