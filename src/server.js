const express = require("express");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");
const bodyParser = require("body-parser");
const session = require("express-session");
const validateSession = require("./middleware/validateSession");
const { Auth } = require("./routes/index");
const mongoSanitize = require("express-mongo-sanitize"); // Import express-mongo-sanitize

require("dotenv").config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
// Middleware setup
app.use(xss());

// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SEC, // Replace with a secret key for session encryption
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

// Define your API routes
app.use("/api/v1/auth", Auth);

// Protected route that requires a valid session
app.get("/api/v1", validateSession, function (req, res) {
  res.json({ status: "OK", user: req.session.user });
});

module.exports = app;
