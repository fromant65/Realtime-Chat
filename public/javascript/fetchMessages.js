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
