//when window first loads, voter.html will grab all restaurants
window.onload= getRestaurantsFromServer();

var database = firebase.database();

let show_reviews = document.getElementById("business_reviews")
show_reviews.addEventListener("click", show_reviews_func);

let close_reviews = document.getElementById("close_reviews");
close_reviews.addEventListener("click", close_reviews_func);



//Open a web socket connection to the server
// ****** Use wss if on glitch, ws otherwise ******
const baseUrl = "wss://" + window.location.host;
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

    document.getElementById("loader_header").textContent = "Removing Restaurants With Lowest Votes";
    document.getElementById("loader_div").className = "shown";
    document.getElementById("swiper-container").className = "hidden";

    setTimeout(function(){ 
      document.getElementById("loader_header").textContent = "Preparing For Next Round";
    }, 3000);

    setTimeout(function(){ 
      document.getElementById("loader_div").className = "hidden";
      document.getElementById("swiper-container").className = "swiper-container shown";
    }, 6000);

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

  document.getElementById("loader_div").className = "hidden";
  document.getElementById("swiper-container").className = "swiper-container shown";

  
  console.log(info)

  // FIXME
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
      console.log("sending the users email");
      
      database.ref('/users/'+user.uid+"/prev_restaurants/"+info.id_data).update({
        id_data: info.id_data,
        image_url_data: info.image_url_data,
        location_data: info.location_data,
        name_data: info.name_data,
        price_data: info.price_data,
        rating_data: info.rating_data,
        reviews_data: info.reviews_data,
        round_votes_data: info.round_votes_data,
        total_votes_data: info.total_votes_data
      });

      database.ref('/users/'+user.uid).update({
        user_email: user.email
      });

    } else {
      // console.log("sending guest");
      // database.ref('/gameInstance/'+id_value+"/users").update({
      //   user_data: "guest"
      // });
    }
  });
  

  let prev = document.querySelector('#prev');
  prev.parentNode.removeChild(prev);

  let next = document.querySelector('#next');
  next.parentNode.removeChild(next);

  document.getElementById("business_pic").src = info.image_url_data;
  document.getElementById("business").textContent = info.name_data;
  document.getElementById("business_price").textContent = info.price_data;
  reviewGetRating(document.getElementById("first_star"),
            document.getElementById("second_star"),
            document.getElementById("third_star"),
            document.getElementById("fourth_star"),
            document.getElementById("fifth_star"),
            info.rating_data);

  document.getElementById("round1_votes").textContent = "";
  
  let header = document.getElementsByTagName("header");
  header[0].className = "shown";
}

function getRestaurantsFromServer(){
  let url = '/handleGame';
  let xhr = new XMLHttpRequest;
  xhr.open("GET",url);
  xhr.setRequestHeader("Content-Type", "application/json"); 
  xhr.onloadend = function(e) {
    businessGlobalList = JSON.parse(xhr.response);
    console.log(JSON.parse(xhr.response));
    currentRestaurant = -1;
    getNextRestaurant();

    if (xhr.readyState === 4 && xhr.status === 200) {}
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
    nextEl: '.swiper-button-prev',
    prevEl: '.swiper-button-next',
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
  currentKey = Object.keys(businessGlobalList)[currentRestaurant]

  if(gameOver == false){
    if((mySwiper.activeIndex < mySwiper.previousIndex) && (mySwiper.activeIndex != 1)){
      sleep(200);
      // console.log("voting for "+businessGlobalList[currentRestaurant].name + " " + currentRestaurant);
      vote(businessGlobalList[currentKey].id_data, "yes");
      getNextRestaurant();
      mySwiper.slideTo(1, 1000, true);
    }
    if((mySwiper.activeIndex > mySwiper.previousIndex) && (mySwiper.activeIndex != 1)){
      sleep(200);
      // console.log("voting for "+businessGlobalList[currentRestaurant].name + " " + currentRestaurant);
      vote(businessGlobalList[currentKey].id_data, "no");
      getNextRestaurant();
      mySwiper.slideTo(1, 1000, true);
    }
  }
});

//This function will grab the next restaurant in the list
function getNextRestaurant(){
  try{
    currentRestaurant++;
    currentKey = Object.keys(businessGlobalList)[currentRestaurant]
    console.log("Currently on res# " + currentRestaurant);
    console.log(businessGlobalList[currentKey])
    document.getElementById("business_pic").src = businessGlobalList[currentKey].image_url_data;
    document.getElementById("business").textContent = businessGlobalList[currentKey].name_data;
    document.getElementById("business_price").textContent = businessGlobalList[currentKey].price_data;
    reviewGetRating(document.getElementById("first_star"),
                    document.getElementById("second_star"),
                    document.getElementById("third_star"),
                    document.getElementById("fourth_star"),
                    document.getElementById("fifth_star"),
                    businessGlobalList[currentKey].rating_data);

    let location = JSON.parse(businessGlobalList[currentKey].location_data);
    document.getElementById("business_address").textContent = location.address1 + ", " + location.city + ", " + location.state + " " + location.zip_code;
    
    if(businessGlobalList[currentKey].total_votes != 0){
      document.getElementById("round1_votes").textContent = "Round 1 Votes: "+businessGlobalList[currentKey].total_votes_data;
    }
    
    console.log("made it to this part")

    if(businessGlobalList[currentKey].reviews_data!="noreviews"){
      console.log("went into first if")
      console.log(businessGlobalList[currentKey].reviews_data)
      review_data = businessGlobalList[currentKey].reviews_data
      let JSONrev = JSON.parse(review_data)
      console.log("made it past here")
      let reviews = JSON.parse(JSONrev);
      console.log("made it to this part")

      try{
        let review_1_Text = reviews[0].time_created.substr(8,2) + "/" + reviews[0].time_created.substr(5,2) + "/" + reviews[0].time_created.substr(0,4);
        let review_2_Text = reviews[1].time_created.substr(8,2) + "/" + reviews[1].time_created.substr(5,2) + "/" + reviews[1].time_created.substr(0,4);
        let review_3_Text = reviews[2].time_created.substr(8,2) + "/" + reviews[2].time_created.substr(5,2) + "/" + reviews[2].time_created.substr(0,4);
        console.log("made it to this part")

        setUpReviews(reviews[0].text, reviews[1].text, reviews[2].text,
                    reviews[0].rating, reviews[1].rating, reviews[2].rating,
                    review_1_Text, review_2_Text, review_3_Text,
                    reviews[0].user.name, reviews[1].user.name, reviews[2].user.name);
      }
      catch{
        let review_1_Text = ""
        let review_2_Text = ""
        let review_3_Text = ""
        console.log("made it to this part")

        setUpReviews("reviews[0].text", "reviews[1].text", "reviews[2].text",
                    "reviews[0].rating", "reviews[1].rating", "reviews[2].rating",
                    "review_1_Text", "review_2_Text", "review_3_Text",
                    "reviews[0].user.name", "reviews[1].user.name", "reviews[2].user.name");
      }
    }
    console.log("made it to this part")

    if(businessGlobalList[currentKey].reviews_data=="noreviews"){
      let empty_text = "";
      let review_text = "No reviews found for this restaurant";
      setUpReviews(review_text, review_text, review_text, 0, 0, 0,
                   empty_text, empty_text, empty_text,
                   empty_text, empty_text, empty_text);
    }

    console.log("made it to end of try")
    return;
  }
  catch{
    console.log("made it into catch")

    document.getElementById("loader_header").textContent = "Waiting for other voters...";
    document.getElementById("loader_div").className = "shown";
    document.getElementById("swiper-container").className = "hidden";
    
    // document.getElementById("business_pic").src = "https://cdn.glitch.com/aa77cb65-0ae2-4388-9521-dc70cf3b8f55%2Flogo-removebg-preview%20(1).png?v=1590852320072";
    // document.getElementById("business").textContent = "Waiting for other voters..."
    // document.getElementById("business_price").textContent = "";
    // document.getElementById("business_address").textContent = ""
    // document.getElementById("round1_votes").textContent = "";
    // reviewGetRating(document.getElementById("first_star"),
    //           document.getElementById("second_star"),
    //           document.getElementById("third_star"),
    //           document.getElementById("fourth_star"),
    //           document.getElementById("fifth_star"),
    //           0);
    return;
  }
}

function setUpReviews(review1Text, review2Text, review3Text, rating1, rating2, rating3,
                      review1Date, review2Date, review3Date, reviewer1, reviewer2, reviewer3){
  document.getElementById("review1_text").textContent = review1Text;
  document.getElementById("review2_text").textContent = review2Text;
  document.getElementById("review3_text").textContent = review3Text;
  
  reviewGetRating(document.getElementById("review1_first_star"), 
                  document.getElementById("review1_second_star"),
                  document.getElementById("review1_third_star"), 
                  document.getElementById("review1_fourth_star"), 
                  document.getElementById("review1_fifth_star"),
                  rating1);
  reviewGetRating(document.getElementById("review2_first_star"), 
                  document.getElementById("review2_second_star"),
                  document.getElementById("review2_third_star"), 
                  document.getElementById("review2_fourth_star"), 
                  document.getElementById("review2_fifth_star"),
                  rating2);
  reviewGetRating(document.getElementById("review3_first_star"), 
                  document.getElementById("review3_second_star"),
                  document.getElementById("review3_third_star"), 
                  document.getElementById("review3_fourth_star"), 
                  document.getElementById("review3_fifth_star"),
                  rating3);

  document.getElementById("review1_date").textContent = review1Date;
  document.getElementById("review2_date").textContent = review2Date;
  document.getElementById("review3_date").textContent = review3Date;

  document.getElementById("review1_reviewer").textContent = reviewer1;
  document.getElementById("review2_reviewer").textContent = reviewer2;
  document.getElementById("review3_reviewer").textContent = reviewer3;
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

function show_reviews_func(){
  document.getElementById("overlay").style.display = "block";
  document.getElementById("reviews").className = "shown";
  document.getElementById("close_reviews").className = "shown";
}

function close_reviews_func() {
  document.getElementById("reviews").className = "hidden";
  close_reviews.className = "hidden";
  document.getElementById("overlay").style.display = "none";
  return;
}

function reviewGetRating(first_star, second_star, third_star, fourth_star, fifth_star, number){
  let count = 0;
  var stars_array = [first_star, second_star, third_star, fourth_star, fifth_star];
  console.log("The review for this res is "+number);
  // number = 2
  number_whole_stars = Math.floor(number); //number = 2
  has_half_star = number % 1; //number = 0

  for(i = 0; i < number_whole_stars; i++){
    stars_array[i].className = "fas fa-star";
  }

  for(i = number_whole_stars; i < 5; i++){
    stars_array[i].className = "far fa-star";
  }

  if(has_half_star == 0.5){
    stars_array[number_whole_stars].className = "fas fa-star-half-alt";
  }

  return
}


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