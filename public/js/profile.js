window.onload = setUp();
window.onload = setUp2();

let signInButton = document.getElementById("sign_in_button");
signInButton.addEventListener("click", signIn);

function setUp2(imageurl, index, name) {
    card = document.createElement('div');
    card.className = "card";
          
    restaurant_image = document.createElement('img');
    // restaurant_image.id = "restaurant_image_" + index;
    restaurant_image.src = "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg"
  
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

function signIn(){
    console.log("pressed sign in button")

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log("user " + user.displayName + " is already signed in");
            window.location.href = "./profile"

        } else {
            firebase.auth().signInWithPopup(provider).then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                console.log(user)

                database.ref('/users/').update({
                    userID: user.email
                });
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
            });
        }
    });
}
  
function setUp(){
    let signInButton = document.getElementById("sign_in_button");
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user already signed in should be changed to profile")
            signInButton.textContent = "Profile"
        } else {
            console.log('user not signed in change to log in')
            signInButton.textContent = "Log In"
        }
    });
}