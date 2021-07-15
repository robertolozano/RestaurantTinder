// window.onload = setUp();

var database = firebase.database();

// List of keywords to search a restaurant
let restaurants = ["Afghan", "African", "Arabian", "Argentine", "Armenian", "Asian Fusion", "Australian", "Austrian", "Bangladeshi", "Basque", "Barbeque", "Belgian", "Brasseries", "Brazilian", "Breakfast & Brunch", "British", "Buffets", "Bulgarian", "Burgers", "Burmese", "Cafes", "Cafeteria", "Cajun/Creole", "Cambodian", "Caribbean", "Catalan", "Cheesesteaks", "Chicken Wings", "Chicken Shop", "Chinese", "Coffee", "Comfort Food", "Creperies", "Cuban", "Czech", "Delis", "Diners", "Dinner Theater", "Eritrean", "Ethiopian", "Filipino", "Fish & Chips", "Fondue", "Food Court", "Food Stands", "French", "Game Meat", "Gastropubs", "Georgian", "German", "Gluten-Free", "Greek", "Guamanian", "Halal", "Hawaiian", "Himalayan/Nepalese", "Hong Kong Style Cafe", "Honduran", "Hot Dogs", "Fast Food", "Hot Pot", "Hungarian", "Iberian", "Indonesian", "Indian", "Irish", "Italian", "Japanese", "Kebab", "Korean", "Kosher", "Laotian", "Latin American", "Malaysian", "Mediterranean", "Mexican", "Middle Eastern", "Modern European", "Mongolian", "Moroccan", "American (New)", "New Mexican Cuisine", "Nicaraguan", "Noodles", "Pakistani", "Pan Asian", "Persian/Iranian", "Peruvian", "Pizza", "Polish", "Polynesian", "Pop-Up Restaurants", "Portuguese", "Poutineries", "Live/Raw Food", "Russian", "Salad", "Sandwiches", "Scandinavian", "Scottish", "Seafood", "Singaporean", "Slovakian", "Smoothie", "Somali", "Soul Food", "Soup", "Southern", "Spanish", "Sri Lankan", "Steakhouses", "Supper Clubs", "Sushi Bars", "Syrian", "Taiwanese", "Tapas Bars", "Tapas/Small Plates", "Tex-Mex", "Thai", "American (Traditional)", "Turkish", "Ukrainian", "Uzbek", "Vegan", "Vegetarian", "Vietnamese", "Waffles", "Wraps"];

// let startButton = document.getElementById("start");
// startButton.addEventListener("click", startFunction);

let get_restaurants = document.getElementById("get_restaurants");
get_restaurants.addEventListener("click", searchRestaurants);

document.getElementById('location').onkeypress = function(e){
  if (!e) e = window.event;
  var keyCode = e.code || e.key;
  if (keyCode == 'Enter'){
    console.log("enter was pressed");
    searchRestaurants()
    return false;
  }
}

let begin = document.getElementById("begin");
begin.addEventListener("click", startGame);

let keywords = document.getElementById("myInput");
let locations = document.getElementById("location");

let signInButton = document.getElementById("sign_in_button");
signInButton.addEventListener("click", signIn);

var database = firebase.database();

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


//Sends user search terms to server
function searchRestaurants(){
  sendID();
  let search = {term: keywords.value, location: locations.value};
  let xhr = new XMLHttpRequest;
  xhr.open("POST","/search", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onloadend = function(e) {
    if (xhr.readyState === 4 && xhr.status === 200) { 
      console.log(`Search found ${JSON.parse(xhr.response).businesses.length} restaurants`);
      
      if (document.getElementById("search_results").hasChildNodes()) {
        while (document.getElementById("search_results").firstChild) {
          document.getElementById("search_results").removeChild(document.getElementById("search_results").firstChild);
        }
      }

      for(i = 0; i < JSON.parse(xhr.response).businesses.length; i++){
        displaySearchResults(JSON.parse(xhr.response).businesses[i], 0);
      }
      console.log("after displayresults")

    }
  };
  xhr.send(JSON.stringify(search));
}

//Officially starts game and redirects players + host to voting page
function startGame(){
  if(restaurantList.length > 0){
    let xhr = new XMLHttpRequest;
    xhr.open("POST","/start", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onloadend = function(e) {
      if (xhr.readyState === 4 && xhr.status === 200) { 
        console.log("Game Started");
      }
      //Redirect to voter page
      window.location.pathname = xhr.response;
    };
    xhr.send(JSON.stringify(restaurantList));
  }
  else{
    alert("Must have at least one restaurant to begin");
  }
}

restaurantList = [];

function displaySearchResults(restaurants, flag){
  slide = document.createElement('div');
  slide.className = "slide2 slide_animation";

  slide_cover = document.createElement('div');
  slide_cover.className = "slide_cover";

  business_pic = document.createElement('img');
  business_pic.src = restaurants.image_url;
  business_pic.className = "business_pic";


  info_section = document.createElement('div');
  info_section.className = "info_section";

  slide2_div1 = document.createElement('div');
  slide2_div1.className = "slide2_div1";

  business = document.createElement("p");
  node1 = document.createTextNode(restaurants.name);
  business.appendChild(node1);
  business.className = "business";

  business_price = document.createElement("p");
  if(restaurants.price == undefined){
    restaurants.price = "Price not given";
  }
  node2 = document.createTextNode(restaurants.price);
  business_price.appendChild(node2);
  business_price.className = "business_price";

  slide2_div2 = document.createElement('div');
  slide2_div2.className = "slide2_div2";

  stars = document.createElement('div');
  stars.className = "stars";

  star1 = document.createElement('i');
  star1.className = "far fa-star";

  star2 = document.createElement('i');
  star2.className = "far fa-star";

  star3 = document.createElement('i');
  star3.className = "far fa-star";

  star4 = document.createElement('i');
  star4.className = "far fa-star";

  star5 = document.createElement('i');
  star5.className = "far fa-star";

  business_address = document.createElement("p");
  node3 = document.createTextNode(`${restaurants.location.address1}, ${restaurants.location.city}, ${restaurants.location.state}`);
  business_address.appendChild(node3);
  business_address.className = "business_address";

  business_reviews = document.createElement('button'); 
  business_reviews.className = "business_reviews";
  business_reviews.innerHTML = "Reviews";

  add_restaurant = document.createElement('button');
  add_restaurant.className = "add_restaurant";
  
  search_results = document.createElement('div');

  business_buttons = document.createElement('div');
  business_buttons.className = "business_buttons";


  if(flag == 1){ // 1 == queued
    add_restaurant.innerHTML = "Remove";
    add_restaurant.style.backgroundColor = "rgb(239 136 125)";

    add_restaurant.addEventListener("click", function(){
      console.log(`Removing ${restaurants.name}`);
      this.parentNode.parentNode.parentNode.parentNode.remove();

      index = restaurantList.indexOf(restaurants);
      if (index > -1) {
        restaurantList.splice(index, 1);
      }
    });

    index = restaurantList.indexOf(restaurants);
    console.log(index);
    if(index < 0) {
      search_results = document.getElementById("queued_restaurants");
      restaurantList.push(restaurants);
    }


    scroll_right = document.createElement('button'); 
    scroll_right.className = "scroll_right";
    scroll_right.innerHTML = ">";
  
    scroll_left = document.createElement('button'); 
    scroll_left.className = "scroll_left";
    scroll_left.innerHTML = "<";
  
    search_results.appendChild(scroll_left)
    search_results.appendChild(scroll_right)
  
    scroll_right.addEventListener('mouseover', function () {
      scrollRightInterval = setInterval(function(){
        document.getElementById("queued_restaurants").scrollLeft += 10;
      }, 10);
    });
    scroll_right.addEventListener('mouseout', function () {
        clearInterval(scrollRightInterval);
    });
  
    scroll_left.addEventListener('mouseover', function () {
      scrollLeftInterval = setInterval(function(){
        document.getElementById("queued_restaurants").scrollLeft -= 10;
      }, 10);
    });
    scroll_left.addEventListener('mouseout', function () {
        clearInterval(scrollLeftInterval);
    });  

  }
  else{ //0 == search
    add_restaurant.innerHTML = "Add";

    add_restaurant.addEventListener("click", function(){
      console.log(`Adding ${restaurants.name}`);

      if(restaurantList.includes(restaurants) == false){
        console.log(`${restaurants.name} is not previously in list`);
        // restaurantList.push(restaurants);
      }

      displaySearchResults(restaurants, 1);
    });

    search_results = document.getElementById("search_results");


    scroll_right = document.createElement('button'); 
    scroll_right.className = "scroll_right";
    scroll_right.innerHTML = ">";
  
    scroll_left = document.createElement('button'); 
    scroll_left.className = "scroll_left";
    scroll_left.innerHTML = "<";
  
    search_results.appendChild(scroll_left)
    search_results.appendChild(scroll_right)
  
    scroll_right.addEventListener('mouseover', function () {
      scrollRightInterval = setInterval(function(){
        document.getElementById("search_results").scrollLeft += 10;
      }, 10);
    });
    scroll_right.addEventListener('mouseout', function () {
        clearInterval(scrollRightInterval);
    });
  
    scroll_left.addEventListener('mouseover', function () {
      scrollLeftInterval = setInterval(function(){
        document.getElementById("search_results").scrollLeft -= 10;
      }, 10);
    });
    scroll_left.addEventListener('mouseout', function () {
        clearInterval(scrollLeftInterval);
    });
  


  }

  search_results.appendChild(slide);
  slide.appendChild(slide_cover);
  slide_cover.appendChild(business_pic);
  slide_cover.appendChild(info_section);
  // slide_cover.appendChild(add_restaurant);

  info_section.appendChild(slide2_div1);
  info_section.appendChild(slide2_div2);
  info_section.appendChild(business_address);
  info_section.appendChild(business_buttons);
  // info_section.appendChild(business_reviews);

  business_buttons.appendChild(business_reviews);
  business_buttons.appendChild(add_restaurant);

  slide2_div1.appendChild(business);
  slide2_div1.appendChild(business_price);

  slide2_div2.appendChild(stars);
  slide2_div2.appendChild(star1);
  slide2_div2.appendChild(star2);
  slide2_div2.appendChild(star3);
  slide2_div2.appendChild(star4);
  slide2_div2.appendChild(star5);

  reviewGetRating(star1, star2, star3, star4, star5, restaurants.rating);
}

function reviewGetRating(first_star, second_star, third_star, fourth_star, fifth_star, number){
  var stars_array = [first_star, second_star, third_star, fourth_star, fifth_star];

  number_whole_stars = Math.floor(number);
  has_half_star = number % 1;

  for(let i = 0; i < number_whole_stars; i++){
    stars_array[i].className = "fas fa-star";
  }

  for(let i = number_whole_stars; i < 5; i++){
    stars_array[i].className = "far fa-star";
  }

  if(has_half_star == 0.5){
    stars_array[number_whole_stars].className = "fas fa-star-half-alt";
  }
}

//Sends user search terms to server
function sendID(){
  let id_value = createId();
  let id = {id: id_value};
  let xhr = new XMLHttpRequest;
  xhr.open("POST","/sendID", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onloadend = function(e) {
    // if (xhr.status === 200) { 
    console.log("Sent ID successfully");


    console.log("sending the user_data");
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("sending the users email");
        database.ref('/gameInstance/'+id_value+"/users").update({
          user_data: user.email
        });
      } else {
        console.log("sending guest");
        database.ref('/gameInstance/'+id_value+"/users").update({
          user_data: "guest"
        });
      }
    });
    // }
  };
  xhr.send(JSON.stringify(id));
}

keywords.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    console.log("enter was pressed");
    event.preventDefault();
    searchRestaurants()
  }
});

//Function below used from https://www.w3schools.com/howto/howto_js_autocomplete.asp
//Autocomplete function takes 2 arguments,
//Text field element and array of autocompleted values:
function autocomplete(inp, arr) {
  var currentFocus;

  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });


  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

autocomplete(document.getElementById("myInput"), restaurants);

//Will create a random unique id ** NOT IN USE **
function createId() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 22; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
 //Authentication
 var provider = new firebase.auth.GoogleAuthProvider();

function signIn(){
  console.log("pressed sign in button");
  window.location.href = "./profile";

  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     // User is signed in.
  //     console.log("user " + user.displayName + " is already signed in");
  //     window.location.href = "./profile";

  //   } else {
  //     firebase.auth().signInWithPopup(provider).then((result) => {
  //         /** @type {firebase.auth.OAuthCredential} */
  //         var credential = result.credential;
  //         // This gives you a Google Access Token. You can use it to access the Google API.
  //         var token = credential.accessToken;
  //         // The signed-in user info.
  //         var user = result.user;
  //         console.log(user);

  //         database.ref('/users/').update({
  //           userID: user.email
  //         });
  //     }).catch((error) => {
  //         // Handle Errors here.
  //         var errorCode = error.code;
  //         var errorMessage = error.message;
  //         // The email of the user's account used.
  //         var email = error.email;
  //         // The firebase.auth.AuthCredential type that was used.
  //         var credential = error.credential;
  //     });
  //   }
  // });
}

// function setUp(){
//   let signInButton = document.getElementById("sign_in_button");
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       console.log("user already signed in should be changed to profile");
//       signInButton.textContent = "Profile";
//     } else {
//       console.log('user not signed in change to log in');
//       signInButton.textContent = "Log In";
//     }
//   });
// }