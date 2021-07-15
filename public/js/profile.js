window.onload = setUp();

let signInButton = document.getElementById("sign_in_button");
signInButton.addEventListener("click", profileButton);

let logInWithGoogle = document.getElementById("log_in_with_google");
logInWithGoogle.addEventListener("click", googleLogIn);

function profileButton(){
    window.location.href = "./profile"
}

function displayRestaurant(restaurant) {
    card = document.createElement('div');
    card.className = "card";
          
    restaurant_image = document.createElement('img');
    restaurant_image.src = restaurant.image_url_data;
  
    card_info_div = document.createElement('div');
    card_info_div.className = "card_info";

    restaurant_name = document.createElement('P');
    var t = document.createTextNode(restaurant.name_data);
    restaurant_name.appendChild(t);

    restaurant_price = document.createElement('P');
    t = document.createTextNode(restaurant.price_data);
    restaurant_price.appendChild(t);

    restaurant_stars_div = document.createElement('div');
    restaurant_stars = document.createElement('div');
    star1 = document.createElement('i');
    star1.className = "far fa-star";
    star2 = document.createElement('i');
    star1.className = "far fa-star";
    star3 = document.createElement('i');
    star1.className = "far fa-star";
    star4 = document.createElement('i');
    star1.className = "far fa-star";
    star5 = document.createElement('i');
    star1.className = "far fa-star";

    restaurant_address = document.createElement('P');
    location_data = JSON.parse(restaurant.location_data)
    t = document.createTextNode(`${location_data.address1}, ${location_data.city}, ${location_data.state}`);
    restaurant_address.appendChild(t);


    document.getElementById("card_section").appendChild(card);
    card.appendChild(restaurant_image);

    card_info_div.appendChild(restaurant_name);
    card_info_div.appendChild(restaurant_price);

    restaurant_stars.appendChild(star1);
    restaurant_stars.appendChild(star2);
    restaurant_stars.appendChild(star3);
    restaurant_stars.appendChild(star4);
    restaurant_stars.appendChild(star5);
    restaurant_stars_div.appendChild(restaurant_stars);
    card_info_div.appendChild(restaurant_stars_div);

    card_info_div.appendChild(restaurant_address);
    card.appendChild(card_info_div);
    // button_yes.addEventListener("click", function (){
    //   button_click("yes " + name);
    // });
    reviewGetRating(star1, star2, star3, star4, star5, restaurant.rating_data);
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

var provider = new firebase.auth.GoogleAuthProvider();

function googleLogIn(){
    console.log("pressed sign in button")
    let user = firebase.auth().currentUser;
    // firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // User is signed in.
        console.log("user " + user.displayName + " is already signed in");

        firebase.auth().signOut().then(() => {
            console.log("User logged out successfully");
            logInWithGoogle.textContent = "Log in with Google";

            if (document.getElementById("card_section").hasChildNodes()) {
                while (document.getElementById("card_section").firstChild) {
                    document.getElementById("card_section").removeChild(document.getElementById("card_section").firstChild);
                }
            }


        }).catch((error) => {
            console.log("User logout error");
        });

    } else {
        firebase.auth().signInWithPopup(provider).then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            var user = result.user;
            console.log(user)

            database.ref('/users/').update({
                userID: user.email
            });

            logInWithGoogle.textContent = "Log Out";

        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    }
    // });
}
  
var database = firebase.database();

var restaurantList;

function setUp(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user already signed in")
            console.log(user);
            logInWithGoogle.textContent = "Log Out";

            var selectAll = database.ref('/users/'+user.uid+'/prev_restaurants/')
            selectAll.once('value', (snapshot) => {
              const data = snapshot.val();
              restaurantList = data;

              for (const property in restaurantList) {
                console.log(`${property}: ${restaurantList[property]}`);
                var restaurant = restaurantList[property];
                displayRestaurant(restaurant);
              }
            });

        } else {
            console.log('user not signed in')
        }
    });
}