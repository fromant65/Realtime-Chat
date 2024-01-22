const Message = require("../model/Message");

async function sendMsg(req, res) {
  const content = req.body.content;
  const author = req.body.author;
  const date = new Date();
  const room = req.body.room;
  try {
    const lastMessage = await Message.findOne().sort("-date").exec();
    const lastId = lastMessage.id || 0;
    const orderID = lastId + 1;
    const message = await Message.create({
      name: author,
      message: content,
      date: date,
      id: orderID,
      room: room,
    });
    res.status(201).json({ success: true, message: message });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
}

async function loadMsg(req, res) {
  //Loads the last messages from the room and returns an array with them
  let messages = req.body.messages;
  const room = req.body.room;
  try {
    const messagesArray = [];
    const lastMsg = (await Message.findOne().sort("-date").exec()) || 0;
    let currentID = lastMsg.id;
    while (messages > 0 && currentID > 0) {
      const msg = await Message.findOne({ id: currentID, room: room });
      if (msg) {
        messagesArray.push(msg);
        messages--;
      }
      currentID--;
    }
    res.json({ messages: messagesArray });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

async function loadNewMsg(req, res) {
  // Loads a given ammount of messages from the DB if there are already loaded messages
  // and returns the array of loaded messages
  let messages = req.body.messages;
  let lastMsgId = req.body.lastMsg;
  const room = req.body.room;
  try {
    const messagesArray = [];
    const lastMsg = (await Message.findById(lastMsgId).exec()) || 0;
    let currentID = lastMsg.id - 1;
    while (messages > 0 && currentID > 0) {
      const msg = await Message.findOne({ id: currentID, room: room });
      if (msg) {
        messagesArray.push(msg);
        messages--;
      }
      currentID--;
    }
    res.json({ messages: messagesArray });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { sendMsg, loadMsg, loadNewMsg };
