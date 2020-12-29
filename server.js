'use strict';

// include modules

//Uses port 5000 if on local machine
var PORT = process.env.PORT || 5000;
const WebSocket = require('ws')
const express = require('express');
// const multer = require('multer'); //Just testing if this is necessary if site doesnt work maybe uncomment
const bodyParser = require('body-parser');
const fs = require('fs');
const sql = require("sqlite3").verbose();
// const FormData = require("form-data"); //Just testing if this is necessary if site doesnt work maybe uncomment
const http = require('http')

//yelp api and uses my yelp fusion key
const yelp = require('yelp-fusion');
const client = yelp.client('aJWwPTnE-goeaz8rXnz0yI2nsN2eweeAu28TFozM_QMrNaPeumqL9VYXaMeKE2ppSGxLcWzQthAdc9TAAzJDXteyj6msOq5ftJJwm3EwC4Yn_JV_KxSww_6-lfnEXnYx');

// begin constructing the server pipeline
const app = express();

//Web Socket Stuff
const server = http.createServer(app);
//Create server that allows web socket connections
const wss = new WebSocket.Server({server});


let currentRestaurantList;
let clientCount = 0; //Number of players connected
let currentRound = 1; //current round, starts at 1->3
let totalVotes = 0;
let numRestaurants = 0;

//Occurs everytime a new user connects to ws://---
wss.on('connection', (ws) => {
  clientCount += 1;
  console.log("a new user connected --", clientCount, "users connected");
  console.log("current Round",currentRound);
  ws.on('message', (message) => {
    let voteObj = JSON.parse(message);

    // Check if the message is vote object
    if (voteObj.type == 'vote')
    {
      //Must vote if ballot votes yes
      if (voteObj.ballot == "yes"){
        console.log("one user selected restaurant with id", voteObj.id);
        vote(voteObj.id); 
      }
      // changing vote value in database anytime someone swipws (left or right)
      totalVotes++;
      console.log("totalVotes: "+totalVotes+" clientCount " +clientCount+" numRes "+numRestaurants);
      if(totalVotes == clientCount * numRestaurants){
        currentRound++
        console.log("currentRound was incremented");
        totalVotes = 0;
        if(currentRound == 3){//round3
          chooseRestaurant();
        }
        else{//round 2
          moveNextRound();
          let newRoundObj = {'type': 'newRound'}
          broadcast(JSON.stringify(newRoundObj));
        }
      }
    }
  })

  //Occurs evertime a user disconnects from ws://
  ws.on('close', ()=>{
    clientCount -= 1;
    console.log("a user disconnected --", clientCount, "users connected");
  });

  ws.send('["connected!"]')
})

//Send data to users through web sockets
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

//Checks if there is a winner
function checkWinner(id, num_clients){
  cmd = 'SELECT * FROM Restaurants WHERE id == (?)'
  let restInfo = -1;
  restaurantDB.all(cmd,id, function (err, rows) {
    if (err) {
      console.log("Database reading error", err.message);
    } else {
      // update vote count in database
      restInfo = rows[0];
      console.log("Round votes is ", restInfo.round_votes)
      console.log("num_clients is ", num_clients)
      if (restInfo.round_votes == num_clients){
        let winnerObj = {'type': 'winner', 'info': restInfo}
        broadcast(JSON.stringify(winnerObj));
      }
    }
  });
}

//Next round
function moveNextRound(){
  //change round votes to 0 for next round
  let i;
  cmd = 'UPDATE Restaurants SET round_votes = 0 WHERE id == (?)';
  for(i = 0; i < Object.keys(currentRestaurantList).length; i++){
    restaurantDB.run(cmd,currentRestaurantList[i].id,function(err){
      if(err){
        console.log("Update error",err.message);
      }else{
        console.log("Update complete");
      }
    });
  }  
}

let mostVotes = -1;
let mostVotedRestaurant = -1;

//choose highest voted restaurant
function chooseRestaurant(){
  cmd = 'SELECT * FROM Restaurants ORDER BY round_votes DESC LIMIT 1';
  restaurantDB.get(cmd, function(err,winner){
    if(err){
      console.log("Choose Restaurants Error", err.message);
    }else{
      console.log("winner is ",winner.name);
      let restInfo = winner;
      let winnerObj = {'type': 'winner', 'info': restInfo}
      broadcast(JSON.stringify(winnerObj));
    }
  });
}


//Alters vote value in database then checks for winner
function vote(id){
  cmd = 'SELECT * FROM Restaurants WHERE id == (?)'
  restaurantDB.all(cmd,id, function (err, rows1) {
    if (err) {
      console.log("Database reading error", err.message)
    } else {
      // update vote count in database
      let vote_tally = rows1[0].round_votes
      let total_vote_tally = rows1[0].total_votes

      vote_tally = vote_tally + 1;
      total_vote_tally = total_vote_tally + 1;
      let update = "UPDATE Restaurants SET round_votes=(?), total_votes=(?) WHERE id==(?)"
      restaurantDB.run(update, vote_tally, total_vote_tally, id, function(err,rows2){
        if(err){
          console.log("Database Error")
        } else{
          console.log("Added a vote for ", rows1[0].name,  vote_tally)
          checkWinner(id, clientCount)
        }
      });
    }
  });
}


// creates database in file restaurants.db if it does not exists
const restaurantDB = new sql.Database("restaurants.db");

let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='Restaurants' ";

restaurantDB.get(cmd, function (err, val) {
    console.log(err, val);
    if (val == undefined) {
        console.log("No database file - creating one");
        createRestaurantDB();
    } else {
        console.log("Database file found");
    }
});

function createRestaurantDB() {
  const cmd = 'CREATE TABLE Restaurants ( id TEXT , name TEXT, rating DECIMAL, image_url TEXT, reviews TEXT, price TEXT, location TEXT, round_votes INT, total_votes INT)';
  restaurantDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

function resetGame(){
//    Removes entries from database
  currentRound = 1; //current round, starts at 1->3
  totalVotes = 0;
  numRestaurants = 0;
  const delcmd = 'DELETE FROM Restaurants';
  restaurantDB.run(delcmd, function(err, val) {
    if (err) {
      console.log("Database reset failure.",err.message);
    } else {
      console.log("Database has been reset");
    }
  });
}


function load_restaurants(businessList){
  resetGame()
  // console.log(businessList)
  let i = 0;
  for (i = 0; i < 16; i++) {
    //Add business to database
    //put new postcard into database
    let id = businessList[i].id
    let name = businessList[i].name
    let rating = businessList[i].rating
    let image_url = businessList[i].image_url
    // let review_count = businessList[i].review_count
    let price = businessList[i].price
    let total_votes = 0
    let round_votes = 0
    let reviews = "noreviews";
    let location = JSON.stringify(businessList[i].location);
    console.log(businessList[i].location);
    
    cmd = "INSERT INTO Restaurants ( id,name,rating, image_url,reviews,price, location, round_votes, total_votes) VALUES (?,?,?,?,?,?,?,?,?)";
    restaurantDB.run(cmd,id,name,rating, image_url, reviews, price, location, round_votes,total_votes,  function(err) {
      if (err) {
        console.log("DB insert error",err.message);
        //Said next would not work here
      } else {
        console.log("Successfully added restaurants to database")
      }
    }); // callback, shopDB.run
    
    load_reviews(businessList, i);
  }
}

function load_reviews(businessList, i){
  
    cmd = 'UPDATE Restaurants SET reviews=(?) WHERE id ==(?)';
  
    console.log(businessList[i].name + "------------------------------------------")
    client.reviews(businessList[i].id).then(response => {
      let rev = JSON.stringify(response.jsonBody.reviews)
      console.log(JSON.stringify(rev));
      restaurantDB.run(cmd,JSON.stringify(rev), businessList[i].id, function(err){
        if(err){
          console.log("Review Error");
        } else{}
      });
    }).catch(e => {
    });
}


function handleGame(request, response, next) {
  // let r = request.query.id
  if(currentRound == 1){//all restaurants
    cmd = 'SELECT * FROM Restaurants';
  }
  if(currentRound == 2){//only restaurants with more than 0 votes
    cmd = "SELECT * FROM Restaurants WHERE total_votes > 0";
  }
  if(currentRound == 3){ //most voted restaurant of remaining restaurants
    //already taken care of during voting process
  }
  restaurantDB.all(cmd, function (err, rows) {
    if (err) {
      console.log("Database reading error", err.message)
      next();
    } else {
      // send shopping list to browser in HTTP response body as JSON
      response.json(rows);
      currentRestaurantList = rows; //need this for when i reset votes
      numRestaurants = Object.keys(rows).length;
      console.log("Number of restaurants", numRestaurants)
    }
  });
}


// Serve static files out of public directory
app.use(express.static('public'));

// Also serve static files out of /images
app.use("/images",express.static('images'));

// Handle GET request to base URL with no other route specified
// by sending creator.html, the main page of the app
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get("/voter", function (request, response) {
  response.sendFile(__dirname + '/public/voter.html');
});

app.get("/gameData", handleGame);

app.get("/start", function(req, res){
  console.log("game started")
  let startObj = {'type': 'command', 'info': "gamestart", "link": "/voter.html"}
  broadcast(JSON.stringify(startObj));
  res.send("/voter.html")
});

app.post("/search", express.json(), function (req, res){
  console.log(req.body.term);
  console.log(req.body.location);

  client.search({
    term: req.body.term,
    location: req.body.location,
  }).then(response => {
    console.log(response.jsonBody.total);
    load_restaurants(response.jsonBody.businesses)
    res.send("Successfully added restaurants");
  }).catch(e => {
    console.log(e);
  });
});

app.use(bodyParser.json());

/*
Provides url that users can access game from, will start with waiting page
*/
app.get("/startNewGame", function (req, res){
  let randomID = createId();
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  fullUrl = req.protocol + '://' + req.get('host');
  // Code for current url from: https://stackoverflow.com/questions/42943124/how-to-get-current-url-path-in-express-with-ejs/42943283
  console.log(fullUrl + "/waiting.html")
  console.log(randomID);
  res.send(fullUrl + "/waiting.html");
});

//for creating random id although not in use rn
function createId() {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 22; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

// listen for requests :)
var listener = server.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
