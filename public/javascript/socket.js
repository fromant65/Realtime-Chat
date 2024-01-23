const socket = io();

const currentRoom = getRoom();
socket.on("conn", async ({ conn }) => {
  let userReq = await fetch("/get-username");
  let userid = await userReq.json();
  socket.emit("enter-room", { room: currentRoom, user:userid });
});

function getRoom() {
  const roomArray = location.pathname.split("index/");
  const room = roomArray[1] || "default";
  return room;
}
