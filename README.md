# Hungr

  

## How to build

  

Clone repository and run

npm start

```
npm start
```

Go to:

```
http://127.0.0.1:5000/
```

## Tech Stack
Built with the following Technlogies:
<ul>  
<li>HTML</li>  
<li>CSS</li>  
<li>Javascript</li>  
<li>Express</li>
<li>Node</li>
<li>Yelp API</li>
<li>Swiper API</li>
<li>Firebase
<ul>  
<li>Authentication</li>  
<li>Realtime Database</li>  
</ul>  
</li>
<li>Express</li>  
<li>Websockets API</li>
</ul>

## How to play
1. Enter keyword(s) and location. 
2. Press the "Eat!" button.
3.  Send link to friends and hit "begin" once everyone is ready.
4. Swipe in the tradition tinder-style method or press the button on the sides to indicate if you like/dislike a restaurant.
### Game rules
Throughout each round, if any restaurant receives a like from all of the users, then it will automatically be chosen as the winner. 
There is no limit on how many restaurants a user can like. 
Therefore the game is based on a restaurant receiving a 100% consensus however the game will filter out restaurants as you go so even if the game has to pick for you, it will pick among those that were generally liked amongst the group.

In the 1st round all the restaurants will be shown.

In the 2nd round **only** the restaurants that received votes will be shown.

If no agreement has been reached by the third round, the site will first filter out the restaurants that received no votes in round 2 and then pick randomly between those remaining restaurants.
