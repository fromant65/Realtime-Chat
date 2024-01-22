const socketEvents = (io) => {
  io.on("connection", (socket) => {
    socket.emit("conn", { conn: true });

    socket.on("message", ({ message, user, id, room }) => {
      console.log(message, user, room);
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
  });
};

module.exports= socketEvents;