const roomId = document.getElementById("room-id");
const sendRoomId = document.getElementById("send-room-id");

//console.log(roomId, sendRoomId);

sendRoomId.addEventListener("click", async (e) => {
  e.preventDefault();
  const reqUser = await fetch("/get-username");
  const dataUser = await reqUser.json();
  const room = roomId.value;
  const currentRoom = getRoom();
  socket.emit("leave-room", { room: currentRoom, user:dataUser.userid });
  socket.emit("enter-room", { room, user:dataUser.userid  });
  setTimeout(() => {
    location.pathname = `/index/${room}`;
  }, 500);
  //console.log(currentRoom);
});
