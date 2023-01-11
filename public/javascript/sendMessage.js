const send = document.getElementById("send");
const inputMsg = document.getElementById("input-msg");
const messages = document.querySelector(".messages");
const form = document.querySelector(".send-msg-form");
const loadMore = document.querySelector(".load-more-messages");

addEventListener("load", async () => {
  await fetchMessages();
  loadMore.disabled = false;
});

socket.on("message", ({ message, user, id }) => {
  //console.log(`mensaje recibido: "${message}" de ${user}`);
  messages.appendChild(recievedMessage(message, user, id));
});

loadMore.addEventListener("click", async (e) => {
  //Codear funcion para cargar más mensajes
  //El problema que existe ahora mismo es que para cargar más mensajes se necesita saber cual fue el último cargado
  //Para saber eso habría que cargar las ids en los divs
  //Pero las funciones ownMessage y recievedMessage solo reciben el contenido del mensaje y el usuario;
  //Habría que pasarles la ID o el mensaje entero; hay que refactorizarlas
  //loadMoreMessages();
  loadMore.disabled = true;
  const room = getRoom();
  const id = messages.children[1]?.id;
  const req = await fetch("/load-new-msg", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: 10,
      lastMsg: id,
      room: room,
    }),
  });
  const data = await req.json();
  //console.log(data.messages);
  loadNewMessages(data.messages);
  loadMore.disabled = false;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  sendMessage();
});

inputMsg.addEventListener("input", (e) => {
  send.disabled = inputMsg.value ? false : true;
});

send.addEventListener("click", async (e) => {
  e.preventDefault();
  sendMessage();
});

async function sendMessage() {
  const message = inputMsg.value;
  inputMsg.value = "";
  const reqUser = await fetch("/get-username");
  const dataUser = await reqUser.json();
  const room = getRoom();
  const reqDB = await fetch("/send-msg", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
      author: dataUser.userid,
      room: room,
    }),
  });
  const resDB = await reqDB.json();
  if (resDB.success) {
    messages.appendChild(ownMessage(message, resDB.message._id));
    socket.emit("message", {
      message: message,
      user: dataUser.userid,
      id: resDB.message._id,
      room: room,
    });
  } else {
    console.log("hubo un error al enviar el mensaje: ", resDB.message);
  }
}
