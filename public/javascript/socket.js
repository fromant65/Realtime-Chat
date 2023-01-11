const socket = io("ws://localhost:3000");
//console.log(socket);

const currentRoom = getRoom();

socket.on("conn", ({ conn }) => {
  socket.emit("enter-room", { room: currentRoom });
  //console.log("connection", conn);
});

function getRoom() {
  const roomArray = location.pathname.split("index/");
  const room = roomArray[1] || "default";
  //console.log(roomArray, room);
  return room;
}

/*
// send a message to the server
socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });
// receive a message from the server
socket.on("hello from server", (...args) => {
  // ...
  console.log(args);
});
*/
