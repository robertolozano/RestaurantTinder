window.onload = setUp();

function setUp(imageurl, index, name) {
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