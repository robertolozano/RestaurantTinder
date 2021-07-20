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

//Authentication
// var provider = new firebase.auth.GoogleAuthProvider();