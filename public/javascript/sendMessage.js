const send = document.getElementById("send");
const inputMsg = document.getElementById("input-msg");
const messages = document.querySelector(".messages");
const form = document.querySelector(".send-msg-form");
const loadMore = document.querySelector(".load-more");
//console.log(inputMsg, send);

addEventListener("load", async () => {
  const req = await fetch("/load-msg", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: 10,
    }),
  });
  const data = await req.json();
  //console.log(data.messages);
  loadMessages(data.messages);
});

loadMore.addEventListener("click", async () => {
  //Codear funcion para cargar más mensajes
  //El problema que existe ahora mismo es que para cargar más mensajes se necesita saber cual fue el último cargado
  //Para saber eso habría que cargar las ids en los divs
  //Pero las funciones ownMessage y recievedMessage solo reciben el contenido del mensaje y el usuario;
  //Habría que pasarles la ID o el mensaje entero; hay que refactorizarlas
  loadMoreMessages();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = inputMsg.value;
  inputMsg.value = "";
  const reqUser = await fetch("/get-username");
  const dataUser = await reqUser.json();
  const reqDB = await fetch("/send-msg", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
      author: dataUser.userid,
    }),
  });
  const resDB = await reqDB.json();
  if (resDB.success) {
    messages.appendChild(ownMessage(message));
    socket.emit("message", { message, user: dataUser.userid });
  } else {
    console.log("hubo un error al enviar el mensaje: ", resDB.message);
  }
});

send.addEventListener("click", async (e) => {
  e.preventDefault();
  const message = inputMsg.value;
  inputMsg.value = "";
  const req = await fetch("/get-username");
  const data = await req.json();
  messages.appendChild(ownMessage(message));
  socket.emit("message", { message, user: data.userid });
});

async function loadMessages(msgs) {
  const reqUser = await fetch("/get-username");
  const data = await reqUser.json();
  const userid = data.userid;
  msgs = msgs.reverse();
  for (message in msgs) {
    if (msgs[message].name === userid) {
      messages.appendChild(ownMessage(msgs[message].message));
    } else {
      messages.appendChild(
        recievedMessage(msgs[message].message, msgs[message].name)
      );
    }
  }
}

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
