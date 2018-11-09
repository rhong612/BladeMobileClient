"use strict";

var multiPlayMenuState = {
	create: function() {
		//Show list of players in the lobby
        socket.on('client_waiting_list', function(player_lobby) {
        	game.world.removeAll();
	        game.stage.backgroundColor = "#4488AA";
        	let lobbyText = game.add.text(0, GAME_HEIGHT * 1/10, 'Waiting Lobby', {fontSize: '50px'});
        	let instructionText = game.add.text(0, GAME_HEIGHT * 2/10, 'Click on the name of a player that you want to challenge.', {fontSize: '30px'});
	        let spacing = 50;
        	for (const key in player_lobby) {
        		if (player_lobby[key].username !== username) {
	        		let text = game.add.text(GAME_WIDTH * 3/4, spacing, player_lobby[key].username, { fontSize: '30px' });
	        		text.anchor.setTo(0, 0);
			        text.inputEnabled = true;
	       			text.events.onInputOver.add(text => text.addColor('#ffffff', 0));
	        		text.events.onInputOut.add(text => text.addColor('#000000', 0));
			        text.events.onInputDown.add(function() {
			        	socket.emit('challenge', player_lobby[key].username);
        				game.world.removeAll();
			        	let waiting_prompt = game.add.text(game.world.centerX, game.world.centerY, "Waiting for player response...", { fontSize: '50px' });
			        	waiting_prompt.anchor.setTo(0.5);
			        	let cancel_btn = game.add.text(game.world.centerX, game.world.centerY + 100, "Cancel", { fontSize: '50px' });
			        	cancel_btn.anchor.setTo(0.5);
			        	cancel_btn.inputEnabled = true;
			        	cancel_btn.events.onInputDown.add(function() {
							socket.emit('cancel_challenge');
			        	});
			        });
	        		spacing += 50;
        		}
        	}
        });

        socket.on('client_challenge_prompt', function(challenger_username) {
        	game.world.removeAll();
        	game.stage.backgroundColor = "#4488AA";
        	let text = game.add.text(game.world.centerX, game.world.centerY, "Challenge from " + challenger_username, { fontSize: '50px' });
	       	text.anchor.setTo(0.5);
			text.inputEnabled = true;

			let acceptBtn = game.add.text(game.world.centerX, game.world.centerY + 100, "Accept", {fontSize: '50px'});
			acceptBtn.anchor.setTo(0.5);
			acceptBtn.inputEnabled = true;
			let declineBtn = game.add.text(game.world.centerX, game.world.centerY - 100, "Decline", {fontSize: '50px'});
			declineBtn.anchor.setTo(0.5);
			declineBtn.inputEnabled = true;

			acceptBtn.events.onInputDown.add(function() {
				socket.emit('accept_challenge');
			});
			declineBtn.events.onInputDown.add(function() {
				socket.emit('cancel_challenge');
			});

        })

        socket.on('receive_hand_multi', function(response) {
            let hand = response.hand.slice();
            let sortedHand = response.sortedHand.slice();
            let playerNum = response.playerNum;
        	game.state.start('multi_play', true, false, hand, sortedHand, playerNum);
        })


        socket.emit('join_waiting_list');
	},

	shutdown : function() {
		game.menuBGM.stop();
	}
}
