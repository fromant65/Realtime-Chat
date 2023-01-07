const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {
  let session = req.session;
  if (session.userid)
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  else res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});

router.post("/login", (req, res) => {
  let session = req.session;
  if (req.body.username) {
    session.userid = req.body.username;
    res.redirect("/index");
  }
});

router.get("/get-username", (req, res) => {
  let userid = req.session.userid;
  res.json({ userid });
});
module.exports = router;
