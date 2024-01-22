const { createServer } = require("http");
const { Server } = require("socket.io");
//Creating socket server
function createSocketServer(app) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.PORT
        ? "https://realtime-chat-xqpq.onrender.com"
        : "http://localhost:3500",
    },
  });
  return {httpServer,io};
}

module.exports = createSocketServer;
