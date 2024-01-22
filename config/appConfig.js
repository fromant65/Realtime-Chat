require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const sessions = require("express-session");
const oneDay = 1000 * 60 * 60 * 24;
const sessionOptions = {
  secret: process.env.ACCESS_TOKEN_SECRET,
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
};

//Middleware
app.use(sessions(sessionOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

//Routes
app.use("/", require("../routes/root"));

module.exports = app;