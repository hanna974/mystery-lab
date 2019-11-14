function protectUserRoute(req, res, next) {
  const isAuthorized = req.session.currentUser;
  if (isAuthorized) {
    res.locals.isLoggedIn = true;
    next();
  } else {
    res.locals.isLoggedIn = false;
    res.redirect("/signin");
  }
}

module.exports = protectUserRoute;
