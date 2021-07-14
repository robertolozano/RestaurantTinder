window.onload = setUp();
window.onload = setUp2();

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

function setUp2(imageurl, index, name) {
    imageurl = "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg";

    card = document.createElement('div');
    card.className = "card";
          
    restaurant_image = document.createElement('img');
    // restaurant_image.id = "restaurant_image_" + index;
    restaurant_image.src = imageurl;
  
    card_info_div = document.createElement('div');
    card_info_div.className = "card_info";

    restaurant_name = document.createElement('P');
    restaurant_stars = document.createElement('P');
    restaurant_address = document.createElement('P');
  
    var t = document.createTextNode("Open Rice Kitchen");
    restaurant_name.appendChild(t);
    t = document.createTextNode("5 Stars");
    restaurant_stars.appendChild(t);
    t = document.createTextNode("123 Davis Rd.");
    restaurant_address.appendChild(t);

    // button_yes.addEventListener("click", function (){
    //   button_click("yes " + name);
    // });
   
    document.getElementById("card_section").appendChild(card);
    card.appendChild(restaurant_image);
    card_info_div.appendChild(restaurant_name);
    card_info_div.appendChild(restaurant_stars);
    card_info_div.appendChild(restaurant_address);
    card.appendChild(card_info_div);
    card_info_div.appendChild(restaurant_name);
    card_info_div.appendChild(restaurant_stars);
    card_info_div.appendChild(restaurant_address);
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
              console.log("This is the data!-------------------", data, "this is the end of profile data");
            });


        } else {
            console.log('user not signed in change to log in')
            signInButton.textContent = "Log In"
        }
    });
}