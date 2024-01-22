const express = require("express");
const router = express.Router();
const path = require("path");
const loginController = require("../controller/loginController")
const {sendMsg,loadMsg,loadNewMsg} = require("../controller/messageController");

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("^/$|/index(/.)?", (req, res) => {
  res.redirect("/login");
});

router.get("/index/:room", (req, res) => {
  let session = req.session;
  if (session.userid)
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  else res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});

router.post("/login", (req,res)=>{
  loginController(req,res);
});

router.get("/get-username", (req, res) => {
  let userid = req.session.userid;
  res.json({ userid });
});

router.post("/send-msg", async (req, res) => {
  sendMsg(req,res);
});

router.post("/load-msg", async (req, res) => {
  loadMsg(req,res);
});

router.post("/load-new-msg", async (req, res) => {
  loadNewMsg(req,res);
});

module.exports = router;
