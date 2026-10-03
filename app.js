require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");

// routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const MONGO_URL = process.env.MONGO_URI;

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

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// LISTINGS ROUTE
app.use("/listings", listings);

// REVIEW ROUTE
app.use("/listings/:id/reviews", reviews);

// UNKOWN PATH INTERCEPTOR
app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ERROR handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Default error" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});
