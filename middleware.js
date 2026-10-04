module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //storing absolute path inside a session
    req.flash("error", "Login first to create Listings");
    return res.redirect("/login");
  }
  next();
};

// saving session info into locals because passport clears the session after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
