const send = document.getElementById("send");
const inputMsg = document.getElementById("input-msg");
const messages = document.querySelector(".messages");
//console.log(inputMsg, send);

send.addEventListener("click", async (e) => {
  e.preventDefault();
  const message = inputMsg.value;
  inputMsg.value = "";
  const req = await fetch("/get-username");
  const data = await req.json();
  messages.appendChild(ownMessage(message));
  socket.emit("message", { message, user: data.userid });
});

function generateMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.innerText = message;
  return messageDiv;
}

function ownMessage(message) {
  const container = document.createElement("div");
  const messageDiv = generateMessage(message);
  messageDiv.classList.add("own-message");
  const fillerDiv = document.createElement("div");
  fillerDiv.classList.add("filler-div");
  fillerDiv.innerText = message;
  container.classList.add("sent-msg-container");
  container.appendChild(messageDiv);
  container.appendChild(fillerDiv);
  return container;
}

function recievedMessage(message, user) {
  const container = document.createElement("div");
  const messageDiv = generateMessage(message);
  const userDiv = document.createElement("div");
  userDiv.innerText = user;
  userDiv.classList.add("rec-msg-sender");
  messageDiv.classList.add("recieved-message");
  container.classList.add("rec-msg-container");
  container.appendChild(userDiv);
  container.appendChild(messageDiv);
  return container;
}

socket.on("message", ({ message, user }) => {
  messages.appendChild(recievedMessage(message, user));
  //console.log("mensaje recibido");
});
