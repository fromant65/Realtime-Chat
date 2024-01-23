async function fetchMessages() {
  const currentRoom = getRoom();
  const req = await fetch("/load-msg", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: 10,
      room: currentRoom,
    }),
  });
  const data = await req.json();
  loadMessages(data.messages);
}

async function loadMessages(msgs) {
  const reqUser = await fetch("/get-username");
  const data = await reqUser.json();
  const userid = data.userid;
  msgs = msgs.reverse();
  for (message in msgs) {
    if (msgs[message].name === userid) {
      messages.appendChild(
        ownMessage(msgs[message].message, msgs[message]._id)
      );
    } else {
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
