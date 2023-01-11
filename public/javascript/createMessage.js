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
  //console.log(color);
  userDiv.style.color = `#${color}`;
  userDiv.classList.add("rec-msg-sender");
  messageDiv.classList.add("recieved-message");
  container.classList.add("rec-msg-container");
  container.appendChild(userDiv);
  container.appendChild(messageDiv);
  container.id = id;
  return container;
}
