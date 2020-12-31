//Open a web socket connection to the server
//Use wss if on glitch, ws otherwise
const baseUrl = "ws://" + window.location.host;
console.log(baseUrl);
const connection = new WebSocket(baseUrl);

//What to do as soon as the connection opens
connection.onopen = () => {
  connection.send(JSON.stringify({"type": "helloClient"}));
};

//Connection Errors
connection.onerror = error => {
  console.log('WebSocket error: ${error}');
};

//{'type': 'command', 'info': "gamestart", "link": "/voter.html"}
//called when we recieve message from server
connection.onmessage = event => {
  console.log(event.data);
  let msgObj = JSON.parse(event.data);

  if (msgObj.type == "command") {
    console.log(msgObj.info);
    window.location.pathname = msgObj.link
  } else {
    console.log("Invalid message type")
    console.log(msgObj);
  }
};