// Initialize Firebase
var config = {
  apiKey: "AIzaSyCea0qfVYp-87c-qcYVAOMKg-xDWsXKSQw",
  authDomain: "rps-multiplayer-ec36f.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-ec36f.firebaseio.com",
  storageBucket: "rps-multiplayer-ec36f.appspot.com",
  messagingSenderId: "326990959774"
};
firebase.initializeApp(config);

var database = firebase.database();
  
var rpsGame = {

	player1: undefined,

	player2: undefined,
  	
  	selectPlayer: function (){
  		//console.log("test");
  	},

  	selectHand: function (){
  		//console.log("test");
  	},

  	compareHand: function (){
  		//console.log("test");
  	},

  	writeResults: function (){
  		//console.log("test");
  	}

 };

 $("submit-name").click(function(event){

 	event.preventDefault();

 	if(database.ref().player1select && database.ref().player2select){
 		alert("Both players already selected");
 	} else if (database.ref().player1select) {
 		rpsGame.player2 = $("#player-name").val().trim();
 		database.ref().set({
 			"player2": rpsGame.player2,
 			"player2select": true
 		});
 		console.log(rpsGame.player2);
 	} else {
 		rpsGame.player1 = $("#player-name").val().trim();
 		database.ref().set({
 			"player1": rpsGame.player1,
 			"player1select": true
 		});
 		console.log(rpsGame.player2);
 	}
 });

 $(".hand").click(function(){

 });

