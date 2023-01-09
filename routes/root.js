const express = require("express");
const router = express.Router();
const path = require("path");
const Message = require("../model/Message");

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

router.post("/send-msg", async (req, res) => {
  const content = req.body.content;
  const author = req.body.author;
  const date = new Date();
  console.log("msg sent");
  try {
    const lastMessage = await Message.findOne().sort("-date").exec();
    console.log(lastMessage);
    const lastId = lastMessage.id || 0;
    const orderID = lastId + 1;
    const message = await Message.create({
      name: author,
      message: content,
      date: date,
      id: orderID,
    });
    console.log(message);
    res.status(201).json({ success: true, message: message });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post("/load-msg", async (req, res) => {
  let messages = req.body.messages;
  try {
    const messagesArray = [];
    const lastMsg = (await Message.findOne().sort("-date").exec()) || 0;
    let currentID = lastMsg.id;
    //console.log(currentID, messages, lastMsg);
    while (messages > 0 && currentID > 0) {
      //console.log(currentID);
      const msg = await Message.findOne({ id: currentID });
      if (msg) {
        messagesArray.push(msg);
        messages--;
      }
      currentID--;
    }
    //console.log(messagesArray);
    res.json({ messages: messagesArray });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post("/load-new-msg", async (req, res) => {
  let messages = req.body.messages;
  let lastMsgId = req.body.lastMsg;
  try {
    const messagesArray = [];
    const lastMsg = (await Message.findById(lastMsgId).exec()) || 0;
    let currentID = lastMsg.id - 1;
    //console.log(currentID, messages, lastMsg);
    while (messages > 0 && currentID > 0) {
      //console.log(currentID);
      const msg = await Message.findOne({ id: currentID });
      if (msg) {
        messagesArray.push(msg);
        messages--;
      }
      currentID--;
    }
    //console.log(messagesArray);
    res.json({ messages: messagesArray });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
