// List of keywords to search a restaurant
let restaurants = ["Afghan", "African", "Arabian", "Argentine", "Armenian", "Asian Fusion", "Australian", "Austrian", "Bangladeshi", "Basque", "Barbeque", "Belgian", "Brasseries", "Brazilian", "Breakfast & Brunch", "British", "Buffets", "Bulgarian", "Burgers", "Burmese", "Cafes", "Cafeteria", "Cajun/Creole", "Cambodian", "Caribbean", "Catalan", "Cheesesteaks", "Chicken Wings", "Chicken Shop", "Chinese", "Comfort Food", "Creperies", "Cuban", "Czech", "Delis", "Diners", "Dinner Theater", "Eritrean", "Ethiopian", "Filipino", "Fish & Chips", "Fondue", "Food Court", "Food Stands", "French", "Game Meat", "Gastropubs", "Georgian", "German", "Gluten-Free", "Greek", "Guamanian", "Halal", "Hawaiian", "Himalayan/Nepalese", "Hong Kong Style Cafe", "Honduran", "Hot Dogs", "Fast Food", "Hot Pot", "Hungarian", "Iberian", "Indonesian", "Indian", "Irish", "Italian", "Japanese", "Kebab", "Korean", "Kosher", "Laotian", "Latin American", "Malaysian", "Mediterranean", "Mexican", "Middle Eastern", "Modern European", "Mongolian", "Moroccan", "American (New)", "New Mexican Cuisine", "Nicaraguan", "Noodles", "Pakistani", "Pan Asian", "Persian/Iranian", "Peruvian", "Pizza", "Polish", "Polynesian", "Pop-Up Restaurants", "Portuguese", "Poutineries", "Live/Raw Food", "Russian", "Salad", "Sandwiches", "Scandinavian", "Scottish", "Seafood", "Singaporean", "Slovakian", "Somali", "Soul Food", "Soup", "Southern", "Spanish", "Sri Lankan", "Steakhouses", "Supper Clubs", "Sushi Bars", "Syrian", "Taiwanese", "Tapas Bars", "Tapas/Small Plates", "Tex-Mex", "Thai", "American (Traditional)", "Turkish", "Ukrainian", "Uzbek", "Vegan", "Vegetarian", "Vietnamese", "Waffles", "Wraps"]

let startButton = document.getElementById("start");
startButton.addEventListener("click", startFunction);

let get_restaurants = document.getElementById("get_restaurants");
get_restaurants.addEventListener("click", searchRestaurants);

let start_game = document.getElementById("start_game");
start_game.addEventListener("click", startGame);

let keywords = document.getElementById("myInput");
let locations = document.getElementById("location");

var database = firebase.database()

//User clicks start new game, hide start new game,
//Shows search bar, gets randomID from server, displays link
function startFunction(){
  startButton.className = "hidden";
  document.getElementById("search_bar").className = "shown";
  
  let xhr = new XMLHttpRequest;
  xhr.open("GET","/startNewGame");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onloadend = function(e) {
    //xhr.response here is the custom link that we set up
    document.getElementById("link").href = xhr.response;
    document.getElementById("link").textContent = xhr.response;

    //Successfully set up new link
    if (xhr.readyState === 4 && xhr.status === 200) {}
  }
  xhr.send();
}

//Sends user search terms to server
function searchRestaurants(){
  let search = {term: keywords.value, location: locations.value};
  let xhr = new XMLHttpRequest;
  xhr.open("POST","/search", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onloadend = function(e) {
    if (xhr.readyState === 4 && xhr.status === 200) { 
       console.log("Searched for restaurants successfully");
    }
  }
  xhr.send(JSON.stringify(search));
  start_game.className = start_game.className.replace("hidden", "")
}

//Officially starts game and redirects players + host to voting page
function startGame(){
  let xhr = new XMLHttpRequest;
  xhr.open("GET","/start", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onloadend = function(e) {
    if (xhr.readyState === 4 && xhr.status === 200) { 
       console.log("Game Started")
    }
    //Redirect to voter page
    window.location.pathname = xhr.response;
  }
  xhr.send();
}











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