const socketEvents = (io) => {
  io.on("connection", (socket) => {
    socket.emit("conn", { conn: true });

    socket.on("message", ({ message, user, id, room }) => {
      socket.to(room).emit("message", { message: message, user: user, id: id });
    });

    socket.on("enter-room", ({ room,user }) => {
      console.log(`joining ${room}`);
      socket.to(room).emit("joined-room",{room, user})
      socket.join(room);
    });

    socket.on("leave-room", ({ room,user }) => {
      console.log(`leaving ${room}`);
      socket.to(room).emit("left-room", {room,user});
      socket.leave(room);
    });
  });
};

module.exports= socketEvents;