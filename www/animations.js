"use strict";
/**
*  Moves all the initialized card sprites to their initial deck position. Then, plays the hand setup animation.
*	@param - func - an optional function to run at the end of the animation
*/
function playDeckSetupAnimation(func=()=>{}) {
    const playerDeckSprites = game.state.getCurrentState().playerDeckSprites;
    const enemyDeckSprites = game.state.getCurrentState().enemyDeckSprites;
    const SPEED = 300;
    const DELAY = 100;
    autoMoveGroupTween(playerDeckSprites, PLAYER_DECK_X_LOCATION, playerDeckSprites.getChildAt(0).y, true, SPEED, 0, 0, 0, DELAY, function() {
    	playHandSetupAnimation(func);
    });
    autoMoveGroupTween(enemyDeckSprites, ENEMY_DECK_X_LOCATION, enemyDeckSprites.getChildAt(0).y, true, SPEED, 0, 0, 0, DELAY);
}



/**
*	Draws starting hands for both players, flips the cards, then plays the sort animation. This function also moves the top 10 sprites from the deck sprites groups to the hand sprites groups.
*	@param - func - an optional function to run at the end of the animation
*/
function playHandSetupAnimation(func=()=>{}) {
	let playerDeckSprites = game.state.getCurrentState().playerDeckSprites;
	let playerHandSprites = game.state.getCurrentState().playerHandSprites;
	let enemyDeckSprites = game.state.getCurrentState().enemyDeckSprites;
	let enemyHandSprites = game.state.getCurrentState().enemyHandSprites;

	moveTopSprites(playerDeckSprites, playerHandSprites, INITIAL_HAND_SIZE);
	moveTopSprites(enemyDeckSprites, enemyHandSprites, INITIAL_HAND_SIZE);

	const SPEED = 300;
	const DELAY = 100;
	autoMoveGroupTween(playerHandSprites, CARD_WIDTH * CARD_SCALE * 2 + PLAYER_DECK_X_LOCATION, playerHandSprites.getChildAt(0).y, false, SPEED, CARD_WIDTH * CARD_SCALE, 0, 0, DELAY, function() {
		autoFlipGroupTweenMulti(playerHandSprites, game.state.getCurrentState().initialHand, 0, DELAY, function() {
			playSortAnimation(func);
		});
	});
	autoMoveGroupTween(enemyHandSprites, ENEMY_DECK_X_LOCATION - CARD_WIDTH * CARD_SCALE * 2, enemyHandSprites.getChildAt(0).y, false, SPEED, -1 * CARD_WIDTH * CARD_SCALE, 0, 0, DELAY);

	function moveTopSprites(groupA, groupB, count) {
		for (let i = 0; i < count; i++) {
			let topCard = groupA.getTop();
			groupA.remove(topCard);
			groupB.add(topCard);
		}
	}
}



/**
*	Plays the sort animation. Then, plays the spread animation to spread the cards back out.
*	@param - func - an optional function to run at the end of the animation
*/
function playSortAnimation(func=()=>{}) {
	const SPEED = 300;
	const INITIAL_DELAY = 500;
	const FLIP_DELAY = 300;
	const playerHandSprites = game.state.getCurrentState().playerHandSprites;
	autoMoveGroupTween(playerHandSprites, GAME_WIDTH / 2, playerHandSprites.getChildAt(0).y, false, SPEED, 0, 0, INITIAL_DELAY, 0, function() {
		autoFlipGroupTweenSingle(playerHandSprites, BACK, FLIP_DELAY, 0, function() {
			autoFlipGroupTweenMulti(playerHandSprites, game.state.getCurrentState().sortedInitialHand, FLIP_DELAY, 0, function() {
				playSpreadAnimation(func);
			});
		})
	})
}


/**
*	Spreads the cards back out.
*	@param - func - an optional function to run at the end of the animation
*/
function playSpreadAnimation(func=()=>{}) {
	const SPEED = 300;
	const DELAY = 100;
	const playerHandSprites = game.state.getCurrentState().playerHandSprites;
	autoMoveGroupTween(playerHandSprites, CARD_WIDTH * CARD_SCALE * 2 + PLAYER_DECK_X_LOCATION, playerHandSprites.getChildAt(0).y, false, SPEED, CARD_WIDTH * CARD_SCALE, 0, DELAY, 0, func);
}




/**
*  Moves the entire group of sprites to a certain position with a delay between each move.
*	@param group - A Phaser group of sprites
*	@param x - the x position to move to
*	@param y - the y position to move to
*	@param speed - the speed of the movement. Defaults to 300.
*	@param play_shuffle - plays a shuffle sound if true. Defaults to false.
*	@param x_buffer - each subsequent sprite will have x_buffer added to the original position. Defaults to 0.
*	@param y_buffer - each subsequent sprite will have y_buffer added to the original position. Defaults to 0.
*	@param initial_delay - the delay before starting the movements. Defaults to 0.
*	@param staggering_delay - the delay between each movement. Defaults to 0.
*	@param func - a function to be called after the animation is done. Defaults to an empty function that does nothing.
*/
function autoMoveGroupTween(group, x, y, play_shuffle=false, speed=300, x_buffer = 0, y_buffer = 0, initial_delay= 0, staggering_delay = 0, func=()=>{}) {
	const tweens = [];
	for (let i = 0; i < group.length; i++) {
		let sprite = group.getChildAt(i);
		tweens.push(moveTween(sprite, x + x_buffer * i, y + y_buffer * i, speed, initial_delay + i * staggering_delay));
		tweens[i].onStart.add(function() {
			sprite.bringToTop();
		});
	}
    tweens[tweens.length - 1].onComplete.add(func);
    startAllTweens(tweens);

    if (play_shuffle) {
    	const shuffleSound = game.add.audio(SHUFFLE_SOUND);
    	shuffleSound.play();
    }
}

/**
*  Flips the entire group of sprites to the new specified sprite.
*	@param group - A Phaser group of sprites
*	@param new_sprite_name - the key of the new sprite
*	@param initial_delay - the delay before starting the movements. Defaults to 0.
*	@param staggering_delay - the delay between each movement. Defaults to 0.
*	@param func - a function to be called after the animation is done. Defaults to an empty function that does nothing.
*/
function autoFlipGroupTweenSingle(group, new_sprite_name, initial_delay = 0, staggering_delay = 0, func=()=>{}) {
	let tweens = [];
	for (let i = 0; i < group.length; i++) {
		tweens.push(getFlipTween(group.getChildAt(i), new_sprite_name, initial_delay + i * staggering_delay));
	}
	onChainComplete(tweens[tweens.length - 1], func);
	startAllTweens(tweens);
}

/**
*  Flips the entire group of sprites and shows new sprites corresponding to a list of sprite names
*	@param group - A Phaser group of sprites
*	@param new_sprite_names - an array of sprite names. Must match the group in length
*	@param initial_delay - the delay before starting the movements. Defaults to 0.
*	@param staggering_delay - the delay between each movement. Defaults to 0.
*	@param func - a function to be called after the animation is done. Defaults to an empty function that does nothing.
*/
function autoFlipGroupTweenMulti(group, new_sprite_names, initial_delay = 0, staggering_delay = 0, func=()=>{}) {
	let tweens = [];
	for (let i = 0; i < group.length; i++) {
		tweens.push(getFlipTween(group.getChildAt(i), new_sprite_names[i], initial_delay + i * staggering_delay));
	}
	onChainComplete(tweens[tweens.length - 1], func);
	startAllTweens(tweens);
}




/**
*	Moves a sprite to a given (x, y) position
*	@param sprite - the sprite to move
*	@param y - the y-coordinate to move to
*	@param speed - the speed of the movement
*	@param delay - the delay in ms before starting the move
*	@returns A Phaser tween that has not been started
*/
function moveTween(sprite, x, y, speed=400, delay=0) {
	return game.add.tween(sprite).to({x: x, y: y}, speed, Phaser.Easing.Linear.Out, false, delay);
}


/**
*	Plays an animation sending all sprites in the group to the left side of the screen. Then, removes the sprites from the group and destroys all the sprites.
*	@param group - the Phaser group of sprites to destroy
*	@param func - an optional function to call at the end
*/
function autoDumpGroupLeft(group, func=()=>{}) {
	if (group.length >= 1) {
		let tweens = [];
		for (let i = 0; i < group.length; i++) {
			tweens.push(dumpSpriteLeftAnimation(group.getChildAt(i)));
		}
		onChainComplete(tweens[tweens.length - 1], function() {
			group.removeAll(true);
			func();
		});
		startAllTweens(tweens);
	}
	else {
		func();
	}
}
/**
*	Plays an animation sending all sprites in the group to the right side of the screen. Then, removes the sprites from the group and destroys all the sprites.
*	@param group - the Phaser group of sprites to destroy
*	@param func - an optional function to call at the end
*/
function autoDumpGroupRight(group, func=()=>{}) {
	if (group.length >= 1) {
		let tweens = [];
		for (let i = 0; i < group.length; i++) {
			tweens.push(dumpSpriteRightAnimation(group.getChildAt(i)));
		}
		onChainComplete(tweens[tweens.length - 1], function() {
			group.removeAll(true);
			func();
		});
		startAllTweens(tweens);
	}
	else {
		func();
	}
}


/**
*	Plays an animation sending all sprites in groupA to the left and all sprites in groupB to the right. Removes the sprites and destroys them all afterward.
*	@param groupA - the Phaser group of sprites to send to the right
*	@param groupB - the Phaser group of sprites to send to the left
*	@param func - an optional function to call at the end
*/
function destroyField(groupA, groupB, func) {
	autoDumpGroupRight(groupA);
	autoDumpGroupLeft(groupB, func);
}



/**
*	Draws the cards specified. Dumps cards when necessary.
*	@param playerDraw - an array of card names that the player drew
*	@param enemyDraw - an array of cards names that the enemy drew
*	@param func - an optional function to call at the end
*/
function playDrawAnimation(playerDraw, enemyDraw, func) {
	const SPEED = 400;
	const DELAY = 300;
	const playerDeckSprites = game.state.getCurrentState().playerDeckSprites;
	const enemyDeckSprites = game.state.getCurrentState().enemyDeckSprites;
	const playerFieldSprites = game.state.getCurrentState().playerFieldSprites;
	const enemyFieldSprites = game.state.getCurrentState().enemyFieldSprites;

	console.log(playerDraw);
	console.log(enemyDraw);

	game.world.bringToTop(playerDeckSprites);
	game.world.bringToTop(enemyDeckSprites);

	let topIndex = playerDeckSprites.length - 1;
	let playerSprite = playerDeckSprites.getChildAt(topIndex);
	let enemySprite = enemyDeckSprites.getChildAt(topIndex);
    let playerTween = moveTween(playerSprite, PLAYER_FIELD_X_LOCATION, PLAYER_FIELD_Y_LOCATION, SPEED, DELAY);
    let enemyTween = moveTween(enemySprite, ENEMY_FIELD_X_LOCATION, ENEMY_FIELD_Y_LOCATION, SPEED, DELAY);
    endOfChain(playerTween, getFlipTween(playerSprite, playerDraw[0], 0));
    endOfChain(enemyTween, getFlipTween(enemySprite, enemyDraw[0], 0));

    for (let i = 1; i < playerDraw.length; i++) {
        endOfChain(playerTween, dumpSpriteRightAnimation(playerSprite));
        endOfChain(enemyTween, dumpSpriteLeftAnimation(enemySprite));

        topIndex--;
    	playerSprite = playerDeckSprites.getChildAt(topIndex)
    	enemySprite = enemyDeckSprites.getChildAt(topIndex);
        endOfChain(playerTween, moveTween(playerSprite, PLAYER_FIELD_X_LOCATION, PLAYER_FIELD_Y_LOCATION, SPEED, DELAY));
        endOfChain(enemyTween, moveTween(enemySprite, ENEMY_FIELD_X_LOCATION, ENEMY_FIELD_Y_LOCATION, SPEED, DELAY));
        endOfChain(playerTween, getFlipTween(playerSprite, playerDraw[i], 0));
        endOfChain(enemyTween, getFlipTween(enemySprite, enemyDraw[i], 0));
    }

    onChainComplete(playerTween, function() {
    	//The last drawn cards go to the field. Remove the rest.
    	let initialDeckSize = playerDeckSprites.length - 1;
    	for (let i = initialDeckSize; i >= topIndex; i--) {
    		playerDeckSprites.removeChildAt(i);
    	}    	
    	playerFieldSprites.add(playerSprite);
    	enemyFieldSprites.add(enemySprite);
    	func();
    });

    playerTween.start();
    enemyTween.start();
}




/**
*	Plays a different card animation depending on the card played
*	@param index - the index of the card that was played
*	@param card - the name of the played card
*	@param playedMoved - boolean representing if the player is the one who played the card or not
*	@param func - an optional function to call at the end
*/
function playCardAnimation(index, card, playerMoved, func) {
	if (card === BOLT) {
		playBoltCardAnimation(index, card, playerMoved, func);
	}
	else if (card === MIRROR) {
		playMirrorCardAnimation(index, card, playerMoved, func);
	}
	else if (card === WAND) {
		playWandCardAnimation(index, card, playerMoved, func);
	}
	else {
		playNormalCardAnimation(index, card, playerMoved, func);
	}
}

/**
*	Plays the bolt animation
*	@param index - the index of the card that was played
*	@param card - the name of the played card
*	@param playedMoved - boolean representing if the player is the one who played the card or not
*	@param func - an optional function to call at the end
*/
function playBoltCardAnimation(index, card, playerMoved, func) {
	const SPEED = 800;
	let currentState = game.state.getCurrentState();
	currentState.boltCardSound.play();
    const SHAKE_INTENSITY = 0.01;
    const SHAKE_SPEED = 300;
    const FLASH_DURATION = 500;
    currentState.camera.shake(SHAKE_INTENSITY, SHAKE_SPEED, true, Phaser.Camera.SHAKE_BOTH, true);
    currentState.camera.flash(0xffff66, FLASH_DURATION);

	if (playerMoved) {
		const playerHandSprites = currentState.playerHandSprites;
		const enemyFieldSprites = currentState.enemyFieldSprites;
		let sprite = playerHandSprites.getChildAt(index);
		game.world.bringToTop(playerHandSprites);
		playerHandSprites.bringToTop(sprite);
		let tween = game.add.tween(sprite).to({ x: sprite.x, y: sprite.y - 100 }, SPEED, Phaser.Easing.Linear.Out, false, 0);
		endOfChain(tween, getFlipTween(enemyFieldSprites.getTop(), BACK, 0));
		onChainComplete(tween, function() {
			playerHandSprites.remove(sprite, true); //Remove and destroy
			func();
		});
		tween.start();
	}
	else {
		const enemyHandSprites = currentState.enemyHandSprites;
		const playerFieldSprites = currentState.playerFieldSprites;
		let sprite = enemyHandSprites.getChildAt(index);
		game.world.bringToTop(enemyHandSprites);
		enemyHandSprites.bringToTop(sprite);
		let tween = game.add.tween(sprite).to({ x: sprite.x, y: sprite.y + 100 }, SPEED, Phaser.Easing.Linear.Out, false, 0);
		let flipTween = getFlipTween(sprite, card, 0);
		endOfChain(tween, getFlipTween(playerFieldSprites.getTop(), BACK, 0));
		onChainComplete(tween, function() {
			enemyHandSprites.remove(sprite, true); //Remove and destroy
			func();
		});
		tween.start();
		flipTween.start();

	}
}

/**
*	Plays the mirror animation
*	@param index - the index of the card that was played
*	@param card - the name of the played card
*	@param playedMoved - boolean representing if the player is the one who played the card or not
*	@param func - an optional function to call at the end
*/
function playMirrorCardAnimation(index, card, playerMoved, func) {
	const SPEED = 800;
	let currentState = game.state.getCurrentState();
	currentState.mirrorCardSound.play();

	if (playerMoved) {
		const playerHandSprites = currentState.playerHandSprites;
		let sprite = playerHandSprites.getChildAt(index);
		game.world.bringToTop(playerHandSprites);
		playerHandSprites.bringToTop(sprite);
		let tween = game.add.tween(sprite).to({ x: sprite.x, y: sprite.y - 100 }, SPEED, Phaser.Easing.Linear.Out, false, 0);
		tween.onComplete.add(function() {
			const playerFieldSprites = currentState.playerFieldSprites;
			const enemyFieldSprites = currentState.enemyFieldSprites;
			autoMoveGroupTween(playerFieldSprites, ENEMY_FIELD_X_LOCATION, ENEMY_FIELD_Y_LOCATION, false, SPEED, ENEMY_FIELD_BUFFER, 0, 0, 0, function() {
				playerHandSprites.remove(sprite, true); //Remove and destroy
				swapGroups(playerFieldSprites, enemyFieldSprites);
				func();
			});
			autoMoveGroupTween(enemyFieldSprites, PLAYER_FIELD_X_LOCATION, PLAYER_FIELD_Y_LOCATION, false, SPEED, PLAYER_FIELD_BUFFER, 0, 0);
		});
		tween.start();
	}
	else {
		const enemyHandSprites = currentState.enemyHandSprites;
		let sprite = enemyHandSprites.getChildAt(index);
		game.world.bringToTop(enemyHandSprites);
		enemyHandSprites.bringToTop(sprite);
		let tween = game.add.tween(sprite).to({ x: sprite.x, y: sprite.y + 100 }, SPEED, Phaser.Easing.Linear.Out, false, 0);
		let flipTween = getFlipTween(sprite, card, 0);
		tween.onComplete.add(function() {
			const playerFieldSprites = currentState.playerFieldSprites;
			const enemyFieldSprites = currentState.enemyFieldSprites;
			autoMoveGroupTween(playerFieldSprites, ENEMY_FIELD_X_LOCATION, ENEMY_FIELD_Y_LOCATION, false, SPEED, ENEMY_FIELD_BUFFER, 0, 0, 0, function() {
				enemyHandSprites.remove(sprite, true); //Remove and destroy
				swapGroups(playerFieldSprites, enemyFieldSprites);
				func();
			});
			autoMoveGroupTween(enemyFieldSprites, PLAYER_FIELD_X_LOCATION, PLAYER_FIELD_Y_LOCATION, false, SPEED, PLAYER_FIELD_BUFFER, 0, 0);
		});

		tween.start();
		flipTween.start();
	}

	function swapGroups(groupA, groupB) {
		const spritesA = [];
		const spritesB = [];
		const originalLengthA = groupA.length;
		const originalLengthB = groupB.length;
		for (let i = 0; i < originalLengthA; i++) {
			spritesA.push(groupA.removeChildAt(0));
		}
		for (let i = 0; i < originalLengthB; i++) {
			spritesB.push(groupB.removeChildAt(0));
		}

		for (let i = 0; i < originalLengthB; i++) {
			groupA.addChild(spritesB[i]);
		}
		for (let i = 0; i < originalLengthA; i++) {
			groupB.addChild(spritesA[i]);
		}
	}
}

/**
*	Plays the wand animation
*	@param index - the index of the card that was played
*	@param card - the name of the played card
*	@param playedMoved - boolean representing if the player is the one who played the card or not
*	@param func - an optional function to call at the end
*/
function playWandCardAnimation(index, card, playerMoved, func) {
	const SPEED = 800;
	if (playerMoved) {
		const playerHandSprites = game.state.getCurrentState().playerHandSprites;
		const playerFieldSprites = game.state.getCurrentState().playerFieldSprites;
		if (playerFieldSprites.getTop().key === BACK) {
			game.state.getCurrentState().wandCardSound.play();
			let sprite = playerHandSprites.getChildAt(index);
			game.world.bringToTop(playerHandSprites);
			playerHandSprites.bringToTop(sprite);
			let tween = game.add.tween(sprite).to({ x: sprite.x, y: sprite.y - 100 }, SPEED, Phaser.Easing.Linear.Out, false, 0);
			endOfChain(tween, getFlipTween(playerFieldSprites.getTop(), playerFieldSprites.getTop().name, 0));
			onChainComplete(tween, function() {
				playerHandSprites.remove(sprite, true); //Remove and destroy
				func();
			});
			tween.start();
		}
		else {
			playNormalCardAnimation(index, card, playerMoved, func);
		}
	}
	else {
		const enemyHandSprites = game.state.getCurrentState().enemyHandSprites;
		const enemyFieldSprites = game.state.getCurrentState().enemyFieldSprites;
		if (enemyFieldSprites.getTop().key === BACK) {
			game.state.getCurrentState().wandCardSound.play();
			let sprite = enemyHandSprites.getChildAt(index);
			game.world.bringToTop(enemyHandSprites);
			enemyHandSprites.bringToTop(sprite);
			let tween = game.add.tween(sprite).to({ x: sprite.x, y: sprite.y + 100 }, SPEED, Phaser.Easing.Linear.Out, false, 0);
			let flipTween = getFlipTween(sprite, card, 0);
			endOfChain(tween, getFlipTween(enemyFieldSprites.getTop(), enemyFieldSprites.getTop().name, 0));
			onChainComplete(tween, function() {
				enemyHandSprites.remove(sprite, true); //Remove and destroy
				func();
			});
			tween.start();
			flipTween.start();
		}
		else {
			playNormalCardAnimation(index, card, playerMoved, func);
		}
	}

}
/**
*	Plays the normal card animation
*	@param index - the index of the card that was played
*	@param card - the name of the played card
*	@param playedMoved - boolean representing if the player is the one who played the card or not
*	@param func - an optional function to call at the end
*/
function playNormalCardAnimation(index, card, playerMoved, func) {
	const SPEED = 400;
	game.state.getCurrentState().normalCardSound.play();
	if (playerMoved) {
		const playerHandSprites = game.state.getCurrentState().playerHandSprites;
		const playerFieldSprites = game.state.getCurrentState().playerFieldSprites;
		let sprite = playerHandSprites.getChildAt(index);
		game.world.bringToTop(playerHandSprites);
		playerHandSprites.bringToTop(sprite);
		let tween = game.add.tween(sprite).to({ x: PLAYER_FIELD_X_LOCATION + PLAYER_FIELD_BUFFER * playerFieldSprites.length, y: PLAYER_FIELD_Y_LOCATION }, SPEED, Phaser.Easing.Linear.Out, false, 0);
		tween.onComplete.add(function() {
			playerHandSprites.removeChild(sprite);
			playerFieldSprites.add(sprite);
			func();
		});
		tween.start();

	}
	else {
		const enemyHandSprites = game.state.getCurrentState().enemyHandSprites;
		const enemyFieldSprites = game.state.getCurrentState().enemyFieldSprites;
		let sprite = enemyHandSprites.getChildAt(index);
		game.world.bringToTop(enemyHandSprites);
		enemyHandSprites.bringToTop(sprite);
		let tween = game.add.tween(sprite).to({ x: ENEMY_FIELD_X_LOCATION + ENEMY_FIELD_BUFFER * enemyFieldSprites.length, y: ENEMY_FIELD_Y_LOCATION}, SPEED, Phaser.Easing.Linear.Out, false, 0);
		let flipTween = getFlipTween(sprite, card, 0);
		tween.onComplete.add(function() {
			enemyHandSprites.removeChild(sprite);
			enemyFieldSprites.add(sprite);
			func();
		});
		tween.start();
		flipTween.start();
	}
}






/**
*	Gets a flip tween for a card
*	@param sprite - the sprite to flip
*	@param newCard - the new card that will be shown after the flip
*	@param delay - the delay before beginning the flip after the tween is started
*	@return a fliptween that has not been started
*/
function getFlipTween(sprite, newCard, delay) {
	const FLIP_SPEED = 200;
    let flipTween = game.add.tween(sprite.scale).to({
        x: 0,
        y: CARD_SCALE * 1.2 //Expand y to give the flip a slight "3d" effect
    }, FLIP_SPEED, Phaser.Easing.Linear.None, false, delay);

    let flipTween2 = game.add.tween(sprite.scale).to({
        x: CARD_SCALE,
        y: CARD_SCALE
    }, FLIP_SPEED, Phaser.Easing.Linear.None, false);

    flipTween.onComplete.add(function() {
        sprite.loadTexture(newCard);
    });
    flipTween.chain(flipTween2);

    if (newCard !== BACK) {
    	sprite.name = newCard; //Set the cards name property for wand/bolt
    }
    return flipTween;
}


/**
*	Calls start() on all the given tweens
*	@param - tweens_array - an array of tweens
*/
function startAllTweens(tweens_array) {
	for (let i = 0; i < tweens_array.length; i++) {
		tweens_array[i].start();
	}
}

/**
*	Gets a tween that sends a sprite off the screen to the right
*	@param sprite - the sprite to send
*	@param speed - the speed of the animation. Defaults to 400.
*	@param delay - the time to wait before beginning the animation after it is started. Defaults to 1500.
*	@returns - a tween that has not been started
*/
function dumpSpriteRightAnimation(sprite, speed=400, delay=1500) {
    return game.add.tween(sprite).to({x: GAME_WIDTH + CARD_WIDTH }, speed, Phaser.Easing.Linear.Out, false, delay);
}
/**
*	Gets a tween that sends a sprite off the screen to the left
*	@param sprite - the sprite to send
*	@param speed - the speed of the animation. Defaults to 400.
*	@param delay - the time to wait before beginning the animation after it is started. Defaults to 1500.
*	@returns - a tween that has not been started
*/
function dumpSpriteLeftAnimation(sprite, speed=400, delay=1500) {
    return game.add.tween(sprite).to({x: -1 * CARD_WIDTH }, speed, Phaser.Easing.Linear.Out, false, delay);
}

/**
*	Chains a tween to the end of a chain of tweens
*	@param chain - the starting tween of a chain
*	@param newTween - the tween to add to the end of the chain
*/
function endOfChain(chain, newTween) {
    let end = chain;
    while (end.chainedTween != undefined) {
        end = end.chainedTween;
    }
    end.chain(newTween);
}

/**
*	Attaches a function to the last tween of a chain
*	@param chain - the starting tween of a chain
*	@param func - the function to attach
*/
function onChainComplete(chain, func) {
    let end = chain;
    while (end.chainedTween != undefined) {
        end = end.chainedTween;
    }
    end.onComplete.add(func);
}