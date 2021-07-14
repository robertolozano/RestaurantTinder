window.onload = setUp();
// window.onload = setUp2();

let signInButton = document.getElementById("sign_in_button");
signInButton.addEventListener("click", signIn);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("User is signed in should retrieve cards");
        // database.ref('/gameInstance/'+id_value+"/users").update({
        // user_data: user.email
        // });
    } else {
        console.log("no user signed in");
        // database.ref('/gameInstance/'+id_value+"/users").update({
        // user_data: "guest"
        // });
    }
});

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

var provider = new firebase.auth.GoogleAuthProvider();

function signIn(){
    console.log("pressed sign in button")
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) { // User is signed in.
            console.log("user " + user.displayName + " is already signed in");
            window.location.href = "./profile"

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
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
            });
        }
    });
}
  
var database = firebase.database();

var restaurantList;

function setUp(){
    let signInButton = document.getElementById("sign_in_button");
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user already signed in should be changed to profile")
            signInButton.textContent = "Profile"

            console.log(user);
            var selectAll = database.ref('/users/'+user.uid+'/prev_restaurants/')
            selectAll.once('value', (snapshot) => {
              const data = snapshot.val();
              restaurantList = data;

              for (const property in restaurantList) {
                console.log(`${property}: ${restaurantList[property]}`);

                var restaurant = restaurantList[property];
                displayRestaurant(restaurant);
              }

            //   console.log("This is the data!-------------------", data, "this is the end of profile data");
            });

        } else {
            console.log('user not signed in change to log in')
            signInButton.textContent = "Log In"
        }
    });
}