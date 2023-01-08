/**
 * Sockets documentation
 * https://socket.io/docs/v4/
 */

/*
Tareas pendientes
- Estilizar frontend
- Rooms?
*/

require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn.js");
const PORT = process.env.PORT || 3000;
const oneDay = 1000 * 60 * 60 * 24;
const sessionOptions = {
  secret: process.env.ACCESS_TOKEN_SECRET,
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
};

//connect to Mongo DB
connectDB();

//Middleware
app.use(sessions(sessionOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

//Routes
app.use("/", require("./routes/root"));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  /*
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
  socket.on("hello from client", (...args) => {
    console.log(args);
  });
  */
  socket.on("message", ({ message, user }) => {
    //console.log(message, user);
    socket.broadcast.emit("message", { message: message, user });
  });
  //console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
