/**
 * Sockets documentation
 * https://socket.io/docs/v4/
 */

require("dotenv").config();
const app = require("./config/appConfig.js");
const createSocketServer = require("./config/socketConfig.js");
const socketEvents = require("./config/socketEvents.js");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn.js");
const PORT = process.env.PORT || 3500;

//connect to Mongo DB
connectDB();

//Create socket server
const {httpServer,io} = createSocketServer(app);

//Add events to socket
socketEvents(io);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
