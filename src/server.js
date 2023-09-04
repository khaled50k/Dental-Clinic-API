const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const validateSession = require("./middleware/validateSession");
const { Auth } = require("./routes/index");
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SEC, // Replace with a secret key for session encryption
    resave: true, // Save the session even if it hasn't changed
    saveUninitialized: true, // Create a new session if one doesn't exist
    cookie: {
      secure: false, // Set to true in a production environment with HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 30, // Session duration in milliseconds (e.g., 30 days)
    },
  })
);

// Define your API routes
app.use("/api/v1/auth", Auth);

// Protected route that requires a valid session
app.get("/api/v1", validateSession, function (req, res) {
  res.json({ status: "OK", user: req.session.user });
});

module.exports = app;
