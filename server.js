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
const PORT = process.env.PORT || 3500;
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
  cors: {
    origin: process.env.PORT
      ? "https://realtime-chat-xqpq.onrender.com"
      : "http://localhost:3500",
  },
});

io.on("connection", (socket) => {
  socket.emit("conn", { conn: true });

  socket.on("message", ({ message, user, id, room }) => {
    //console.log(message, user, room);
    socket.to(room).emit("message", { message: message, user: user, id: id });
  });

  socket.on("enter-room", ({ room }) => {
    console.log(`joining ${room}`);
    socket.join(room);
    console.log(socket.rooms);
  });

  socket.on("leave-room", ({ room }) => {
    console.log(`leaving ${room}`);
    socket.leave(room);
  });
  //console.log(socket.id);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
