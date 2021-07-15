// window.onload = setUp();

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const square = entry.target.querySelector('.second_text');

        if (entry.isIntersecting) {
            square.classList.add('appear_animation');
            return;
        }
    });
});
  
observer.observe(document.getElementById("second_text_div"));

const element = document.querySelector("#bluetext");

const observer2 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const square = document.getElementById("background");

        if (entry.isIntersecting) {
            console.log("in view");
            square.classList.add('background_long');
            square.classList.remove('background_short');
            return;
        }
        console.log("not in view");

        square.classList.add('background_short');
        square.classList.remove('background_long');
    });
});

observer2.observe(document.querySelector(".navbar"));


let signInButton = document.getElementById("sign_in_button");
signInButton.addEventListener("click", signIn);

//Authentication
var provider = new firebase.auth.GoogleAuthProvider();

function signIn(){
  console.log("pressed sign in button")
  window.location.href = "./profile"

  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     // User is signed in.
  //     console.log("user " + user.displayName + " is already signed in");
  //     window.location.href = "./profile"

  //   } else {
  //     firebase.auth().signInWithPopup(provider).then((result) => {
  //         /** @type {firebase.auth.OAuthCredential} */
  //         var credential = result.credential;
  //         // This gives you a Google Access Token. You can use it to access the Google API.
  //         var token = credential.accessToken;
  //         // The signed-in user info.
  //         var user = result.user;
  //         console.log(user)

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
//       console.log("user already signed in should be changed to profile")
//       signInButton.textContent = "Profile"
//     } else {
//       console.log('user not signed in change to log in')
//       signInButton.textContent = "Log In"
//     }
//   });
// }


// function startGame(){
//   let xhr = new XMLHttpRequest;
//   xhr.open("GET","/start", true);
//   xhr.setRequestHeader("Content-Type", "application/json");
//   xhr.onloadend = function(e) {
//     if (xhr.readyState === 4 && xhr.status === 200) { 
//        console.log("Game Started");
//     }
//     //Redirect to voter page
//     window.location.pathname = xhr.response;
//   };
//   xhr.send();
// }