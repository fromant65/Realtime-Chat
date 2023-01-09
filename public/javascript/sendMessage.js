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
  messages.appendChild(recievedMessage(message, user, id));
  //console.log("mensaje recibido");
});

loadMore.addEventListener("click", async (e) => {
  //Codear funcion para cargar más mensajes
  //El problema que existe ahora mismo es que para cargar más mensajes se necesita saber cual fue el último cargado
  //Para saber eso habría que cargar las ids en los divs
  //Pero las funciones ownMessage y recievedMessage solo reciben el contenido del mensaje y el usuario;
  //Habría que pasarles la ID o el mensaje entero; hay que refactorizarlas
  //loadMoreMessages();
  loadMore.disabled = true;
  const id = messages.children[1].id;
  const req = await fetch("/load-new-msg", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: 10,
      lastMsg: id,
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
    messages.appendChild(ownMessage(message, resDB.message._id));
    socket.emit("message", {
      message: message,
      user: dataUser.userid,
      id: resDB.message._id,
    });
  } else {
    console.log("hubo un error al enviar el mensaje: ", resDB.message);
  }
}

async function fetchMessages() {
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
}

async function loadMessages(msgs) {
  const reqUser = await fetch("/get-username");
  const data = await reqUser.json();
  const userid = data.userid;
  msgs = msgs.reverse();
  //console.log(msgs);
  for (message in msgs) {
    if (msgs[message].name === userid) {
      messages.appendChild(
        ownMessage(msgs[message].message, msgs[message]._id)
      );
    } else {
      //console.log(msgs[message].name, msgs[message], message);
      messages.appendChild(
        recievedMessage(
          msgs[message].message,
          msgs[message].name,
          msgs[message]._id
        )
      );
    }
  }
}

async function loadNewMessages(msgs) {
  const reqUser = await fetch("/get-username");
  const data = await reqUser.json();
  const userid = data.userid;
  for (message in msgs) {
    if (msgs[message].name === userid) {
      messages.children[0].insertAdjacentElement(
        "afterend",
        ownMessage(msgs[message].message, msgs[message]._id)
      );
    } else {
      messages.children[0].insertAdjacentElement(
        "afterend",
        recievedMessage(
          msgs[message].message,
          msgs[message].name,
          msgs[message]._id
        )
      );
    }
  }
}

function generateMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.innerText = message;
  return messageDiv;
}

function ownMessage(message, id) {
  const container = document.createElement("div");
  const messageDiv = generateMessage(message);
  messageDiv.classList.add("own-message");
  const fillerDiv = document.createElement("div");
  fillerDiv.classList.add("filler-div");
  fillerDiv.innerText = message;
  container.classList.add("sent-msg-container");
  container.appendChild(messageDiv);
  container.appendChild(fillerDiv);
  container.id = id;
  return container;
}

function recievedMessage(message, user, id) {
  const container = document.createElement("div");
  const messageDiv = generateMessage(message);
  const userDiv = document.createElement("div");
  userDiv.innerText = user;
  const color = generateColorByUsername(user);
  console.log(color);
  userDiv.style.color = `#${color}`;
  userDiv.classList.add("rec-msg-sender");
  messageDiv.classList.add("recieved-message");
  container.classList.add("rec-msg-container");
  container.appendChild(userDiv);
  container.appendChild(messageDiv);
  container.id = id;
  return container;
}

function generateColorByUsername(user) {
  if (!user) return "222222";
  const hashUser = hashCode(user);
  const posUser = Math.abs(hashUser);
  let hashStr = posUser.toString(16);
  hashStr = [...hashStr].reverse().join("");
  //console.log(colorHex, user, user.toString(16));
  console.log(hashStr);
  const red = `${hashStr[0] || 6}${hashStr[3] || 6}`;
  const green = `${hashStr[1] || 6}${hashStr[4] || 6}`;
  const blue = `${hashStr[2] || 6}${hashStr[5] || 6}`;
  const color = red + green + blue;
  return color;
}

function hashCode(code) {
  var hash = 0,
    i,
    chr;
  if (code.length === 0) return hash;
  for (i = 0; i < code.length; i++) {
    chr = code.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
