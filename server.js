/**
 * Sockets documentation
 * https://socket.io/docs/v4/
 */

require("dotenv").config();
const app = require("./config/appConfig.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
const socketEvents = require("./config/socketConfig.js");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn.js");
const PORT = process.env.PORT || 3500;

//connect to Mongo DB
connectDB();

//Creating socket server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.PORT
      ? "https://realtime-chat-xqpq.onrender.com"
      : "http://localhost:3500",
  },
});

//Add events to socket
socketEvents(io);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
