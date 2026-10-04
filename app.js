require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

async function startServer() {
  try {
    if (
      !process.env.PORT ||
      !process.env.MONGO_URI ||
      !process.env.SESSION_SECRET
    ) {
      throw new Error("Missing required environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

startServer();

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // (7 days) maxAge specifies how many milliseconds the cookie should last in the browser before expiring. after 7 days user will automatically be logged out.
    httpOnly: true, // prevents client-side JavaScript from reading the session cookie through document.cookie.
  },
};

app.use(session(sessionOptions));
app.use(flash());

// PASSPORT logic
app.use(passport.initialize()); // Initializes Passport as middleware in your Express application.
app.use(passport.session()); // Enables persistent login sessions using Express sessions.
passport.use(new LocalStrategy(User.authenticate())); // Tells Passport to use the Local Strategy (username + password authentication) and sets the verification logic.
passport.serializeUser(User.serializeUser()); // User.serializeUser() stores only the unique user ID (e.g., _id). This keeps session cookies small and secure.
passport.deserializeUser(User.deserializeUser()); // Fetches the full user object from MongoDB on every subsequent request based on the stored session ID.

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //req.user stores user's login info
  next();
});

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// UNKOWN PATH INTERCEPTOR
app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ERROR handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Default error" } = err;
  res.status(statusCode).render("error.ejs", { message });
});
