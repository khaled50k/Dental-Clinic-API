const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const validateSession = require("./middleware/validateSession");
const { Auth, Patient, Prescription, Appointment } = require("./routes/index");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger"); // Import your logger
const sanitizeParams = require("./validation/sanitizeParams");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Middleware setup
app.use(sanitizeParams);
// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SEC,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

// Use express-mongo-sanitize to prevent NoSQL injection
app.use(mongoSanitize());

// Create a rate limiter for the /auth route
const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});

// Apply the rate limiter to the /auth route
app.use("/api/v1/auth", authLimiter, Auth);
app.use("/api/v1/patient", validateSession, Patient);
app.use("/api/v1/prescription", validateSession, Prescription);
app.use("/api/v1/appointment", validateSession, Appointment);

// Protected route that requires a valid session
app.get("/api/v1", validateSession, function (req, res) {
  // Example of logging
  logger.info("Protected route accessed");

  res.json({ status: "OK", user: req.session.user });
});

module.exports = app;
