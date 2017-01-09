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

	localPlayer: null,

	player1: null,

	player2: null,
  	
  	selectPlayer: function (){
  
  		console.log("selectPlayer function called");

   			//check the database to see if player 1 or 2 has been selected and set the local and server variables to the player names chosen
			if(this.localPlayer === null) {
				
				var userRef = firebase.database().ref("users");

				userRef.once("value")
					.then(function(snapshot){
					console.log("P1? "+ snapshot.child("player1").exists());	
				  	if (snapshot.child("player1").exists()) {
				 		
				 		rpsGame.player1 = snapshot.child("player1").val();
				 		rpsGame.player2 = $("#player-name").val().trim();
				 		rpsGame.localPlayer = rpsGame.player2;
				 		
				 		database.ref("users").update({
				 			"player2": rpsGame.player2
				 		});

				 	console.log("Player2: "+ rpsGame.player2);
				 	
				 	} else {
				 		
				 		rpsGame.player1 = $("#player-name").val().trim();
				 		rpsGame.localPlayer = rpsGame.player1;
				 		
				 		database.ref("users").update({
				 			"player1": rpsGame.player1
				 		});
				 		
				 	console.log("Player1: " + rpsGame.player1);
				 	};
				});
			};

		

  	},

  	selectHand: function (){
  		//console.log("test");
  	},

  	compareHand: function (){
  		//console.log("test");
  	},

  	writeNames: function (){

  		console.log("writeNames function called");

  		var userRef = new firebase.database().ref("users");

  		userRef.once("value").then(function(snapshot){
  			
  			//check if player 1 or 2 exists and write names to player-container
  			if(snapshot.child("player1").exists() && snapshot.child("player2").exists()){
  				var p1 = $("<p>");
  				p1.html("Player 1: " + snapshot.child("player1").val());
  				var p2 = $("<p>");
  				p2.html("player 2: " + snapshot.child("player2").val());

  				$("#player-container").empty();
  				$("#player-container").append(p1, p2);  									

  			} else if (snapshot.child("player1").exists()) {
  				var p1 = $("<p>");
  				p1.html("Player 1: " + snapshot.child("player1").val());

  				$("#player-container").empty();
  				$("#player-container").append(p1);
  			} else if (snapshot.child("player2").exists()) {
  				var p2 = $("<p>");
  				p2.html("Player 2: " + snapshot.child("player2").val());

  				$("#player-container").empty();
  				$("#player-container").append(p2);
  			};
  			//check if local player has been selected and write to player-container. clear name-container if local player exists
  			if(rpsGame.localPlayer !== null){
  				$("#name-container").empty();
  				if (rpsGame.localPlayer === snapshot.child("player1").val()){
  					var p = $("<p>");
  					p.html("You are Player 1");

  					$("player-container").prepend(p);
  				} else if (rpsGame.localPlayer === snapshot.child("player2").val()){
  					var p = $("<p>");
  					p.html("You are Player 2");

  					$("#player-container").prepend(p);
  				}
  			};

  		});
  	},

  	writeResults: function (){
  		//console.log("test");
  	},

  	createUserGroup: function (){
  		database.ref().once("value").then(function(snapshot){
  			if(!snapshot.child("users").exists()){
  				database.ref().set({
  					"users": 0
  				});
  			};
		});
  	},

  	start: function (){
  		rpsGame.createUserGroup();
  		rpsGame.writeNames();
  	},

  	leaveGame: function (){

  	}

 };

rpsGame.start();



 $("#submit-name").click(function(event){


 	event.preventDefault();

 	rpsGame.selectPlayer();
 	rpsGame.writeNames();


 });

 $(".hand").click(function(){

 });

/*
 $(window).unload(function(){

 });
*/

