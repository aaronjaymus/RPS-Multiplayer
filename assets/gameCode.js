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

	handSelected: false,
  	
  	selectPlayer: function (){
  
  		console.log("selectPlayer function called");

   			//check the database to see if player 1 or 2 has been selected and set the local and server variables to the player names chosen
			if(rpsGame.localPlayer === null) {
				
				var userRef = firebase.database().ref("users");

				userRef.once("value")
					.then(function(snapshot){
					//console.log("P1? "+ snapshot.child("player1").exists());	
				  	if (snapshot.child("player1").exists()) {
				 		
				 		rpsGame.player2 = $("#player-name").val().trim();
				 		rpsGame.localPlayer = $("#player-name").val().trim();
				 	
				 		database.ref("users").update({
				 			"player2": rpsGame.player2
				 		});

				 		var disconnect2 = firebase.database().ref("users/player2");
				 		disconnect2.onDisconnect().set(null);

				 	console.log("Player2: "+ rpsGame.player2);
				 	console.log("call 1 Local player is: " + rpsGame.localPlayer)
				 	} else {
				 		
				 		rpsGame.player1 = $("#player-name").val().trim();
				 		rpsGame.localPlayer = $("#player-name").val().trim();
				 		
				 		database.ref("users").update({
				 			"player1": rpsGame.player1
				 		});

				 		var disconnect1 = firebase.database().ref("users/player1");
				 		disconnect1.onDisconnect().set(null);
				 		
				 	console.log("Player1: " + rpsGame.player1);
				 	console.log("call 1 Local player is: " + rpsGame.localPlayer)
				 	};
				});
			};

					

  	},

  	selectHand: function (button){
  		//console.log("test");
  		if(rpsGame.handSelected === false && rpsGame.localPlayer !== null){
  			$(button).addClass("active");
  			var hand = $(button).data("hand");
  			var handName = $(button).data("name");
  			console.log(hand);
  			rpsGame.handSelected = true;

  			database.ref("users").once("value").then(function(snapshot){
  				if(snapshot.child("player1").val() === rpsGame.localPlayer) {
  					database.ref().update({
  						"hands/p1hand" : hand,
  						"hands/p1handName" : handName
  					});
  				} else {
  					database.ref().update({
  						"hands/p2hand" : hand,
  						"hands/p2handName" : handName
  					})
  				}
  			});

  		} else {
  			alert("You have chosen already");
  		}

  		rpsGame.compareHand();

  	},

  	compareHand: function (){
  		console.log("compareHand");
  		database.ref("hands").once("value").then(function(snapshot){
  			if(snapshot.child("p1hand").exists() && snapshot.child("p2hand").exists()){
  				var hand1 = snapshot.child("p1hand").val();
  				var hand2 = snapshot.child("p2hand").val();

  				rpsGame.rpsCode(hand1, hand2);

  			}
  		});

  	},

  	rpsCode: function (h1, h2){

		database.ref().once("value").then(function(snapshot){

			this.player1 = snapshot.child("users/player1").val();
			this.player2 = snapshot.child("users/player2").val();

			if(h1 === h2){
				console.log("tie");
				database.ref("results/ties").transaction(function(score){
					return score + 1;
				});
				
			} else if (h1 === "r"){
				if(h2 === "p"){
					console.log("P2 Win");
					database.ref("results/p2wins").transaction(function(score){
						return score + 1;
					});
					
				} else {
					console.log("P1 Win");
					database.ref("results/p1wins").transaction(function(score){
						return score + 1;
					});
					
				}
			} else if (h1 === "p"){
				if(h2 === "r"){
					console.log("P1 Win");
					database.ref("results/p1wins").transaction(function(score){
						return score + 1;
					});
					
				} else {
					console.log("P2 Win");
					database.ref("results/p2wins").transaction(function(score){
						return score + 1;
					});
					
				}
			} else if (h1 === "s") {
				if(h2 === "r"){
					console.log("P2 Win");
					database.ref("results/p2wins").transaction(function(score){
						return score + 1;
					});
					
				} else {
					console.log("P1 Win");
					database.ref("results/p1wins").transaction(function(score){
						return score + 1;
					});

				}
			}
		
		});


  	},

  	writeNames: function (snapshot){

  		console.log("writeNames function called");

  			
  			//check if player 1 or 2 exists and write names to player-container
  			if(snapshot.child("player1").exists() && snapshot.child("player2").exists()){
  				var p1 = $("<p>");
  				p1.html("Player 1: " + snapshot.child("player1").val());
  				var p2 = $("<p>");
  				p2.html("Player 2: " + snapshot.child("player2").val());

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
  			
  			
  			rpsGame.writePlayer(snapshot);
  		
  	},

  	writePlayer: function (snapshot){
  		//check if local player has been selected and write to player-container. clear name-container if local player exists
  		
  		if(rpsGame.localPlayer === null && snapshot.child("player1").exists() && snapshot.child("player2").exists()){
  			alert("Game already in session");
  		}

  		if(rpsGame.localPlayer !== null){
  			//console.log(this);
  			$("#name-container").empty();
  			if (rpsGame.localPlayer === rpsGame.player1){
  				var p = $("<p>");
  				p.html("You are Player 1");

  				$("#player-container").prepend(p);
  			} else if (rpsGame.localPlayer === rpsGame.player2){
  				var p = $("<p>");
  				p.html("You are Player 2");

  				$("#player-container").prepend(p);
  			};
  		};
  	},

  	writeResults: function (snapshot){
  		$("#player-1-wins").html(snapshot.child("p1wins").val());
  		$("#player-2-wins").html(snapshot.child("p2wins").val());
  		$("#tie-games").html(snapshot.child("ties").val());
  		//console.log("test");
  	},

  	resetGame: function (){
  		database.ref("users").once("value").then(function(snapshot){
	  		if(snapshot.child("player1").exists() && snapshot.child("player2").exists()){
	  			alert("Game already in session");
	  		} else {
		  		database.ref().update({
		  			"results/ties" : 0,
		  			"results/p1wins" : 0,
		  			"results/p2wins" : 0
		  		});
	  		}
  		});
  	},

  	resetHand: function (){
  		$(".hand").removeClass("active");
  		database.ref("hands").set(null);
  		rpsGame.handSelected = false;
  	},

  	clearHandTracker: function (){
  		$("#hand-tracker").empty();
  	},

  	sendChat: function (){

  		console.log("call 2 local player" + rpsGame.localPlayer);
  		var chat = $("#chat-input").val();
  		$("#chat-input").val("");

  		database.ref().once("value").then(function(snapshot){
  			if(rpsGame.localPlayer === snapshot.child("users/player1").val()){
  				database.ref().update({"chat" : snapshot.child("users/player1").val() + ": " + chat});
  			} else if(rpsGame.localPlayer === snapshot.child("users/player2").val()){
  				database.ref().update({"chat" : snapshot.child("users/player2").val() + ": " + chat});
  			} else {
  				alert("Choose your name before talking smack");
  			}
  		});
  	},

  	writeChat: function (){
  		var chatP = $("<p>");
  		database.ref().once("value").then(function(snapshot){
  			chatP.text(snapshot.child("chat").val());
  			$("#chat-section").append(chatP);
  		});
  	},

  	resetChat: function (){
  		$("#chat-section").empty();
  	},

  	start: function (){	
  		rpsGame.resetGame();
  	}


 };

rpsGame.start();

database.ref("users").on("value", function(snapshot){
	rpsGame.writeNames(snapshot);
});

database.ref("results").on("value", function(snapshot){
	rpsGame.writeResults(snapshot);
	rpsGame.resetHand();
});

database.ref("chat").on("value", function(snapshot){
	rpsGame.writeChat();
});

 $("#submit-name").click(function(event){


 	event.preventDefault();

 	rpsGame.selectPlayer();

 });

 $(".hand").click(function(){
 	rpsGame.selectHand(this);
 });


$("#send-chat").click(function(event){

	event.preventDefault();

	rpsGame.sendChat();
});


$(window).on("beforeunload", function () {
	//rpsGame.leaveGame();
});



