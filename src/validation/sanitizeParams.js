const { sanitize } = require("express-xss-sanitizer");

// Middleware function to sanitize request parameters
const sanitizeParams = (req, res, next) => {
  for (const param in req.params) {
    req.params[param] = sanitize(req.params[param] || "");
  }

  for (const key in req.body) {
    req.body[key] = sanitize(req.body[key] || "");
  }

  for (const queryParam in req.query) {
    req.query[queryParam] = sanitize(req.query[queryParam] || "");
  }
  next();
};

module.exports = sanitizeParams;
