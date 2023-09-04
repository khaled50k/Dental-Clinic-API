require("./config/db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("express").json;
const app = express();
app.use(cors());
app.use(bodyParser());
app.get("/", function (req, res) {
  res.json({ status: "OK" });
});

module.exports = app;
