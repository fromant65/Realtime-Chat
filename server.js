/**
 * Sockets documentation
 * https://socket.io/docs/v4/
 */

/*
Tareas pendientes
- Estilizar frontend
- Rooms?
*/

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const sessions = require("express-session");
const oneDay = 1000 * 60 * 60 * 24;
const sessionOptions = {
  secret: "123",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
};

app.use(sessions(sessionOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

/*app.get("/", (req, res) => {
  res.send("pagina cargada");
});*/
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

httpServer.listen(3000, () => console.log(`Server running on port ${3000}`));
