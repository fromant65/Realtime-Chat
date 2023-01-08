const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema({
  name: String,
  message: String,
  date: Date,
  id: Number,
});

module.exports = mongoose.model("Message", Message);
