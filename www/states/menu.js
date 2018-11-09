"use strict";
var menuState = {
	create: function() {
        if (!game.menuBGM.isPlaying) {
            game.menuBGM.loopFull();
        }

        this.swooshAudio = game.add.audio(SWOOSH);

        let titleText = this.add.text(game.world.centerX, GAME_HEIGHT / 10, 'Blade', {fontSize: '100px'});
        titleText.anchor.setTo(0.5);

        this.playText = this.add.text(game.world.centerX, GAME_HEIGHT / 10 * 3, 'Multiplayer', {fontSize: '70px'});
        this.playText.anchor.setTo(0.5);
        this.playText.inputEnabled = true;
        this.playText.events.onInputDown.add(function() {
            game.state.start('multi_play_menu');
        })
        this.playText.events.onInputOver.add(function() {
            this.swooshAudio.play();
        }.bind(this))

        this.exitText = this.add.text(game.world.centerX, GAME_HEIGHT / 10 * 5, 'Exit', {fontSize: '70px'});
        this.exitText.anchor.setTo(0.5);
        this.exitText.inputEnabled = true;
        this.exitText.events.onInputDown.add(function() {
            game.state.start('title');
        })
        this.exitText.events.onInputOver.add(function() {
            this.swooshAudio.play();
        }.bind(this))
    },

    update : function() {
        if (this.playText.input.pointerOver()) {
            this.playText.addColor("#ffffff", 0); //white
        }
        else {
            this.playText.addColor("#000000", 0); //black
        }

        if (this.exitText.input.pointerOver()) {
            this.exitText.addColor("#ffffff", 0);
        }
        else {
            this.exitText.addColor("#000000", 0);
        }
    }
}