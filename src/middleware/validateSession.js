const express = require("express");
const session = require("express-session");

// Create a middleware to validate the session
module.exports = (req, res, next) => {
  // Get the session from the request
  const userSession = req.session;

  // Check if the session is valid
  if (!userSession.authenticated) {
    // The session is not valid, send a response with an error message
    return res.status(401).json({ error: "Session not authenticated" });
  }

  // Check if the session has expired
  if (userSession.cookieMaxAge && Date.now() > userSession.cookieMaxAge) {
    // The session has expired, invalidate the session
    userSession.destroy();
    // Send a response with an error message
    return res.status(401).json({ error: "Session expired" });
  }

  // The session is valid, continue with the request
  next();
};

// Error handling
const handleSessionErrors = (err, req, res, next) => {
  // Check if the error is a session error
  if (err.name === "SessionExpiredError") {
    // The session has expired, send a response with an error message
    return res.status(401).json({ error: err.message });
  } else if (err.name === "InvalidSessionError") {
    // The session is invalid, send a response with an error message
    return res.status(401).json({ error: err.message });
  } else {
    // Handle other errors by passing them to the next middleware
    next(err);
  }
};
