//when window first loads, voter.html will grab all restaurants
window.onload= getRestaurantsFromServer();

//Open a web socket connection to the server
// ****** Use wss if on glitch, ws otherwise ******
const baseUrl = "ws://" + window.location.host;
const connection = new WebSocket(baseUrl);
console.log(window.location.host);

//What to do as soon as the connection opens
connection.onopen = () => {
  connection.send(JSON.stringify({"type": "helloClient"}));
};

//connection errors
connection.onerror = error => {
  console.log('WebSocket error: ${error}');
};

//called when we recieve message from server
connection.onmessage = event => {
  console.log(event.data);
  let msgObj = JSON.parse(event.data);

  if (msgObj.type == "message") {
    console.log("message type")
    console.log(msgObj.msg);
  } 
  else if (msgObj.type == 'winner') //If it is a command we assume 
  {
    gameOver = true;
    displayWinner(msgObj.info)
  }
  else if(msgObj.type == "newRound"){ //new round; grab restaurants again
    getRestaurantsFromServer();
  }
  else {
    console.log("neither message type")
    console.log(msgObj.type);
  }
};

//Info is a json file containing all info: info.name, info.id
function displayWinner(info){
  console.log("We have a winner")
  console.log(info)
  let prev = document.querySelector('#prev');
  prev.parentNode.removeChild(prev);

  let next = document.querySelector('#next');
  next.parentNode.removeChild(next);

  document.getElementById("business_pic").src = info.image_url;
  document.getElementById("business").textContent = info.name;
  document.getElementById("business_price").textContent = info.price;
  getRating(info.rating);

  document.getElementById("round1_votes").textContent = "";
  
  let header = document.getElementsByTagName("header");
  header[0].className = "shown";
}

function getRestaurantsFromServer(){
  let url = '/gameData';

  let xhr = new XMLHttpRequest;
  xhr.open("GET",url);
  xhr.setRequestHeader("Content-Type", "application/json"); 

  xhr.onloadend = function(e) {
    businessGlobalList = JSON.parse(xhr.response);
    console.log(JSON.parse(xhr.response));
    currentRestaurant = -1;
    getNextRestaurant();

    if (xhr.readyState === 4 && xhr.status === 200) { 
      //  console.log("JSON sent to server");
    }
  }
  xhr.send();
}

//variable created because businessList from YELP dies after its return call
//but I needed it in another function so I assigned it to a global variable
let businessGlobalList;

var mySwiper = new Swiper ('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,
  effect: 'slide',
  initialSlide: 1,
  // shortSwipes: false,
  // longSwipes: true,
  // longSwipesRatio: 0.05,
  // shortSwipes: false,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  
  scrollbar: {
    el: '.swiper-scrollbar',
  },
})

//This variable keeps track of what restaurant
//the user is at in the list
let currentRestaurant = -1;

let gameOver = false;

//Function that detects if user has swiped on page
mySwiper.on('slideChange', function () {
  if(gameOver == false){
    if((mySwiper.activeIndex < mySwiper.previousIndex) && (mySwiper.activeIndex != 1)){
      sleep(200);
      // console.log("voting for "+businessGlobalList[currentRestaurant].name + " " + currentRestaurant);
      vote(businessGlobalList[currentRestaurant].id, "no");
      getNextRestaurant();
      mySwiper.slideTo(1, 1000, true);
    }
    if((mySwiper.activeIndex > mySwiper.previousIndex) && (mySwiper.activeIndex != 1)){
      sleep(200);
      // console.log("voting for "+businessGlobalList[currentRestaurant].name + " " + currentRestaurant);
      vote(businessGlobalList[currentRestaurant].id, "yes");
      getNextRestaurant();
      mySwiper.slideTo(1, 1000, true);
    }
  }
});

//This function will grab the next restaurant in the list
function getNextRestaurant(){
  try{
    currentRestaurant++;
    console.log("Currently on res# " + currentRestaurant);
    document.getElementById("business_pic").src = businessGlobalList[currentRestaurant].image_url;
    document.getElementById("business").textContent = businessGlobalList[currentRestaurant].name;
    document.getElementById("business_price").textContent = businessGlobalList[currentRestaurant].price;
    // document.getElementById("business_rating").textContent = businessGlobalList[currentRestaurant].rating;
    getRating(businessGlobalList[currentRestaurant].rating)
    let location = JSON.parse(businessGlobalList[currentRestaurant].location);
    document.getElementById("business_address").textContent = location.address1 + ", " + location.city + ", " + location.state + " " + location.zip_code;
    
    if(businessGlobalList[currentRestaurant].total_votes != 0){
      document.getElementById("round1_votes").textContent = "Round 1 Votes: "+businessGlobalList[currentRestaurant].total_votes;
    }
    
    if(businessGlobalList[currentRestaurant].reviews!="noreviews"){
      // console.log(businessGlobalList[currentRestaurant].name + " " + businessGlobalList[currentRestaurant].reviews);
      let JSONrev = JSON.parse(businessGlobalList[currentRestaurant].reviews)
      let reviews = JSON.parse(JSONrev);

      document.getElementById("review1_text").textContent = reviews[0].text;
      document.getElementById("review2_text").textContent = reviews[1].text;
      document.getElementById("review3_text").textContent = reviews[2].text;
      
      review1GetRating(reviews[0].rating);
      review2GetRating(reviews[1].rating);
      review3GetRating(reviews[2].rating);

      document.getElementById("review1_date").textContent = reviews[0].time_created.substr(8,2) + "/" + reviews[0].time_created.substr(5,2) + "/" + reviews[0].time_created.substr(0,4);
      document.getElementById("review2_date").textContent = reviews[1].time_created.substr(8,2) + "/" + reviews[1].time_created.substr(5,2) + "/" + reviews[1].time_created.substr(0,4);
      document.getElementById("review3_date").textContent = reviews[2].time_created.substr(8,2) + "/" + reviews[2].time_created.substr(5,2) + "/" + reviews[2].time_created.substr(0,4);

      document.getElementById("review1_reviewer").textContent = reviews[0].user.name;
      document.getElementById("review2_reviewer").textContent = reviews[1].user.name;
      document.getElementById("review3_reviewer").textContent = reviews[2].user.name;

      console.log(reviews);
    }
    if(businessGlobalList[currentRestaurant].reviews=="noreviews"){
      document.getElementById("review1_text").textContent = "No reviews found for this restaurant";
      document.getElementById("review2_text").textContent = "No reviews found for this restaurant";
      document.getElementById("review3_text").textContent = "No reviews found for this restaurant";

      review1GetRating(0);
      review2GetRating(0);
      review3GetRating(0);

      document.getElementById("review1_date").textContent = "";
      document.getElementById("review2_date").textContent = "";
      document.getElementById("review3_date").textContent = "";

      document.getElementById("review1_reviewer").textContent = "";
      document.getElementById("review2_reviewer").textContent = "";
      document.getElementById("review3_reviewer").textContent = "";
      console.log(businessGlobalList[currentRestaurant].name + " " + businessGlobalList[currentRestaurant].reviews);
    }
    return;
  }
  catch{
    finished_voting_for_round();
    return;
  }
}

function finished_voting_for_round(){
  document.getElementById("business_pic").src = "https://cdn.glitch.com/aa77cb65-0ae2-4388-9521-dc70cf3b8f55%2Flogo-removebg-preview%20(1).png?v=1590852320072";
  document.getElementById("business").textContent = "Waiting for other voters..."
  document.getElementById("business_price").textContent = "";
  document.getElementById("business_address").textContent = ""
  document.getElementById("round1_votes").textContent = "";
  // document.getElementById("business_rating").textContent = businessGlobalList[currentRestaurant].rating;
  getRating(0);
}

//This function gets the correct # of stars depending on the rating
function getRating(number){ 
  if(number == 0){
    document.getElementById("first_star").className = "far fa-star";
    document.getElementById("second_star").className = "far fa-star";
    document.getElementById("third_star").className = "far fa-star";
    document.getElementById("fourth_star").className = "far fa-star";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 0.5){
    document.getElementById("first_star").className = "fas fa-star-half-alt";
    document.getElementById("second_star").className = "far fa-star";
    document.getElementById("third_star").className = "far fa-star";
    document.getElementById("fourth_star").className = "far fa-star";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 1){
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "far fa-star";
    document.getElementById("third_star").className = "far fa-star";
    document.getElementById("fourth_star").className = "far fa-star";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 1.5){
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "fas fa-star-half-alt";
    document.getElementById("third_star").className = "far fa-star";
    document.getElementById("fourth_star").className = "far fa-star";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 2){
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "fas fa-star";
    document.getElementById("third_star").className = "far fa-star";
    document.getElementById("fourth_star").className = "far fa-star";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 2.5){
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "fas fa-star";
    document.getElementById("third_star").className = "fas fa-star-half-alt";
    document.getElementById("fourth_star").className = "far fa-star";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 3){
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "fas fa-star";
    document.getElementById("third_star").className = "fas fa-star";
    document.getElementById("fourth_star").className = "far fa-star";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 3.5){
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "fas fa-star";
    document.getElementById("third_star").className = "fas fa-star";
    document.getElementById("fourth_star").className = "fas fa-star-half-alt";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 4){
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "fas fa-star";
    document.getElementById("third_star").className = "fas fa-star";
    document.getElementById("fourth_star").className = "fas fa-star";
    document.getElementById("fifth_star").className = "far fa-star";
  }
  if(number == 4.5){
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "fas fa-star";
    document.getElementById("third_star").className = "fas fa-star";
    document.getElementById("fourth_star").className = "fas fa-star";
    document.getElementById("fifth_star").className = "fas fa-star-half-alt";
  }
  if(number == 5){   
    document.getElementById("first_star").className = "fas fa-star";
    document.getElementById("second_star").className = "fas fa-star";
    document.getElementById("third_star").className = "fas fa-star";
    document.getElementById("fourth_star").className = "fas fa-star";
    document.getElementById("fifth_star").className = "fas fa-star";
  }
  return
}

//Use to vote for a restaurant with id rest_id (uses web socket connection)
function vote(rest_id, ballot){
  connection.send(JSON.stringify({"type": "vote", "id": rest_id, "ballot": ballot}));
}

//Just a function that I made to make the page wait
//before pulling next card
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}



let show_reviews = document.getElementById("business_reviews")
show_reviews.addEventListener("click", show_reviews_func);

function show_reviews_func(){
  document.getElementById("overlay").style.display = "block";
  document.getElementById("reviews").className = "shown";
  document.getElementById("close_reviews").className = "shown";
}

let close_reviews = document.getElementById("close_reviews")
close_reviews.addEventListener("click", close_reviews_func);

function close_reviews_func() {
  document.getElementById("reviews").className = "hidden";
  close_reviews.className = "hidden";
  document.getElementById("overlay").style.display = "none";
}


//This function gets the correct # of stars depending on the rating
function review1GetRating(number){ 
  if(number == 0){
    document.getElementById("review1_first_star").className = "far fa-star";
    document.getElementById("review1_second_star").className = "far fa-star";
    document.getElementById("review1_third_star").className = "far fa-star";
    document.getElementById("review1_fourth_star").className = "far fa-star";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 0.5){
    document.getElementById("review1_first_star").className = "fas fa-star-half-alt";
    document.getElementById("review1_second_star").className = "far fa-star";
    document.getElementById("review1_third_star").className = "far fa-star";
    document.getElementById("review1_fourth_star").className = "far fa-star";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 1){
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "far fa-star";
    document.getElementById("review1_third_star").className = "far fa-star";
    document.getElementById("review1_fourth_star").className = "far fa-star";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 1.5){
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "fas fa-star-half-alt";
    document.getElementById("review1_third_star").className = "far fa-star";
    document.getElementById("review1_fourth_star").className = "far fa-star";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 2){
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "fas fa-star";
    document.getElementById("review1_third_star").className = "far fa-star";
    document.getElementById("review1_fourth_star").className = "far fa-star";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 2.5){
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "fas fa-star";
    document.getElementById("review1_third_star").className = "fas fa-star-half-alt";
    document.getElementById("review1_fourth_star").className = "far fa-star";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 3){
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "fas fa-star";
    document.getElementById("review1_third_star").className = "fas fa-star";
    document.getElementById("review1_fourth_star").className = "far fa-star";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 3.5){
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "fas fa-star";
    document.getElementById("review1_third_star").className = "fas fa-star";
    document.getElementById("review1_fourth_star").className = "fas fa-star-half-alt";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 4){
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "fas fa-star";
    document.getElementById("review1_third_star").className = "fas fa-star";
    document.getElementById("review1_fourth_star").className = "fas fa-star";
    document.getElementById("review1_fifth_star").className = "far fa-star";
  }
  if(number == 4.5){
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "fas fa-star";
    document.getElementById("review1_third_star").className = "fas fa-star";
    document.getElementById("review1_fourth_star").className = "fas fa-star";
    document.getElementById("review1_fifth_star").className = "fas fa-star-half-alt";
  }
  if(number == 5){   
    document.getElementById("review1_first_star").className = "fas fa-star";
    document.getElementById("review1_second_star").className = "fas fa-star";
    document.getElementById("review1_third_star").className = "fas fa-star";
    document.getElementById("review1_fourth_star").className = "fas fa-star";
    document.getElementById("review1_fifth_star").className = "fas fa-star";
  }
  return
}


//This function gets the correct # of stars depending on the rating
function review2GetRating(number){ 
  if(number == 0){
    document.getElementById("review2_first_star").className = "far fa-star";
    document.getElementById("review2_second_star").className = "far fa-star";
    document.getElementById("review2_third_star").className = "far fa-star";
    document.getElementById("review2_fourth_star").className = "far fa-star";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 0.5){
    document.getElementById("review2_first_star").className = "fas fa-star-half-alt";
    document.getElementById("review2_second_star").className = "far fa-star";
    document.getElementById("review2_third_star").className = "far fa-star";
    document.getElementById("review2_fourth_star").className = "far fa-star";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 1){
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "far fa-star";
    document.getElementById("review2_third_star").className = "far fa-star";
    document.getElementById("review2_fourth_star").className = "far fa-star";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 1.5){
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "fas fa-star-half-alt";
    document.getElementById("review2_third_star").className = "far fa-star";
    document.getElementById("review2_fourth_star").className = "far fa-star";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 2){
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "fas fa-star";
    document.getElementById("review2_third_star").className = "far fa-star";
    document.getElementById("review2_fourth_star").className = "far fa-star";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 2.5){
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "fas fa-star";
    document.getElementById("review2_third_star").className = "fas fa-star-half-alt";
    document.getElementById("review2_fourth_star").className = "far fa-star";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 3){
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "fas fa-star";
    document.getElementById("review2_third_star").className = "fas fa-star";
    document.getElementById("review2_fourth_star").className = "far fa-star";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 3.5){
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "fas fa-star";
    document.getElementById("review2_third_star").className = "fas fa-star";
    document.getElementById("review2_fourth_star").className = "fas fa-star-half-alt";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 4){
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "fas fa-star";
    document.getElementById("review2_third_star").className = "fas fa-star";
    document.getElementById("review2_fourth_star").className = "fas fa-star";
    document.getElementById("review2_fifth_star").className = "far fa-star";
  }
  if(number == 4.5){
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "fas fa-star";
    document.getElementById("review2_third_star").className = "fas fa-star";
    document.getElementById("review2_fourth_star").className = "fas fa-star";
    document.getElementById("review2_fifth_star").className = "fas fa-star-half-alt";
  }
  if(number == 5){   
    document.getElementById("review2_first_star").className = "fas fa-star";
    document.getElementById("review2_second_star").className = "fas fa-star";
    document.getElementById("review2_third_star").className = "fas fa-star";
    document.getElementById("review2_fourth_star").className = "fas fa-star";
    document.getElementById("review2_fifth_star").className = "fas fa-star";
  }
  return
}


//This function gets the correct # of stars depending on the rating
function review3GetRating(number){ 
  if(number == 0){
    document.getElementById("review3_first_star").className = "far fa-star";
    document.getElementById("review3_second_star").className = "far fa-star";
    document.getElementById("review3_third_star").className = "far fa-star";
    document.getElementById("review3_fourth_star").className = "far fa-star";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 0.5){
    document.getElementById("review3_first_star").className = "fas fa-star-half-alt";
    document.getElementById("review3_second_star").className = "far fa-star";
    document.getElementById("review3_third_star").className = "far fa-star";
    document.getElementById("review3_fourth_star").className = "far fa-star";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 1){
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "far fa-star";
    document.getElementById("review3_third_star").className = "far fa-star";
    document.getElementById("review3_fourth_star").className = "far fa-star";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 1.5){
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "fas fa-star-half-alt";
    document.getElementById("review3_third_star").className = "far fa-star";
    document.getElementById("review3_fourth_star").className = "far fa-star";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 2){
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "fas fa-star";
    document.getElementById("review3_third_star").className = "far fa-star";
    document.getElementById("review3_fourth_star").className = "far fa-star";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 2.5){
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "fas fa-star";
    document.getElementById("review3_third_star").className = "fas fa-star-half-alt";
    document.getElementById("review3_fourth_star").className = "far fa-star";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 3){
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "fas fa-star";
    document.getElementById("review3_third_star").className = "fas fa-star";
    document.getElementById("review3_fourth_star").className = "far fa-star";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 3.5){
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "fas fa-star";
    document.getElementById("review3_third_star").className = "fas fa-star";
    document.getElementById("review3_fourth_star").className = "fas fa-star-half-alt";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 4){
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "fas fa-star";
    document.getElementById("review3_third_star").className = "fas fa-star";
    document.getElementById("review3_fourth_star").className = "fas fa-star";
    document.getElementById("review3_fifth_star").className = "far fa-star";
  }
  if(number == 4.5){
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "fas fa-star";
    document.getElementById("review3_third_star").className = "fas fa-star";
    document.getElementById("review3_fourth_star").className = "fas fa-star";
    document.getElementById("review3_fifth_star").className = "fas fa-star-half-alt";
  }
  if(number == 5){   
    document.getElementById("review3_first_star").className = "fas fa-star";
    document.getElementById("review3_second_star").className = "fas fa-star";
    document.getElementById("review3_third_star").className = "fas fa-star";
    document.getElementById("review3_fourth_star").className = "fas fa-star";
    document.getElementById("review3_fifth_star").className = "fas fa-star";
  }
  return
}