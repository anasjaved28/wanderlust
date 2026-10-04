const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");

// SIGNUP route
router.get("/signup", async (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password); //Passport Logic
      console.log(registeredUser);
      req.flash("success", "User Registered Successfully!!");
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }),
);

// LOGIN route
router.get("/login", async (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  //passed as middlware
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res, next) => {
    req.flash("success", "Welcome Back to Wanderlust");
    res.redirect("/listings");
  },
);

// LOGOUT route

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out!");
    res.redirect("/listings");
  });
});

module.exports = router;
