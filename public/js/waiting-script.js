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
  } else if(msgObj.type == "newClientCount"){
    document.getElementById("clientCount").textContent = `${msgObj.clientCount} users in waiting room`;
  } else {
    console.log("Invalid message type")
    console.log(msgObj);
  }
};


window.onload = startFunction();

function startFunction(){
  let xhr = new XMLHttpRequest;
  xhr.open("GET","/startNewGame");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onloadend = function(e) {
    //xhr.response here is the custom link that we set up
    document.getElementById("link").href = xhr.response;
    document.getElementById("link").textContent = xhr.response;

    //Successfully set up new link
    if (xhr.readyState === 4 && xhr.status === 200) {}
  };
  xhr.send();
}

document.getElementById("begin_button").addEventListener("click", startGame);

function startGame(){
  let xhr = new XMLHttpRequest;
  xhr.open("POST","/begin", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onloadend = function(e) {
    if (xhr.readyState === 4 && xhr.status === 200) { 
       console.log("Game Started");
    }
    //Redirect to voter page
    window.location.pathname = xhr.response;
  };
  xhr.send();
}