'use strict';
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/login?from=' + req.originalUrl);
  }
}

module.exports = isAuthenticated;