"use strict";
var loadState = {
    preload: function() {
        this.stage.backgroundColor = '#DECCCC';
        let preloadBarBackground = this.add.image(GAME_WIDTH / 2 - game.cache.getImage(PRELOAD_BAR_BACKGROUND).width / 2, GAME_HEIGHT / 2, PRELOAD_BAR_BACKGROUND);
        let preloadBar = this.add.sprite(GAME_WIDTH / 2 - game.cache.getImage(PRELOAD_BAR).width / 2, GAME_HEIGHT / 2 + 10, PRELOAD_BAR);
        this.load.setPreloadSprite(preloadBar);

        //Cards
        this.load.image(BACK, 'assets/images/cards/back.png');
        this.load.image(BOLT, 'assets/images/cards/bolt.png');
        this.load.image(MIRROR, 'assets/images/cards/mirror.png');
        this.load.image(FORCE, 'assets/images/cards/force.png');
        this.load.image(WAND, 'assets/images/cards/wand.png');
        this.load.image(TWO_CARD, 'assets/images/cards/blade_pistols.png');
        this.load.image(THREE_CARD, 'assets/images/cards/bow.png');
        this.load.image(FOUR_CARD, 'assets/images/cards/sword.png');
        this.load.image(FIVE_CARD, 'assets/images/cards/shotgun.png');
        this.load.image(SIX_CARD, 'assets/images/cards/spear.png');
        this.load.image(SEVEN_CARD, 'assets/images/cards/broadsword.png');

        //Other assets
        this.load.image(RETURN_BUTTON, 'assets/images/return_button.png');
        this.load.image(SOUND_ICON, 'assets/images/sound_icon.png');
        this.load.image(MUTE_ICON, 'assets/images/mute_icon.png');
        this.load.image(CROSSED_SWORDS, 'assets/images/crossed_swords.png');

        //Sound effects
        this.load.audio(SHUFFLE_SOUND, 'assets/sounds/card_shuffle.mp3');
        this.load.audio(SWORD_SLICE, 'assets/sounds/sword_slice.wav');
        this.load.audio(SWOOSH, 'assets/sounds/swoosh.wav');
        this.load.audio(NORMAL_CARD_PLAY, 'assets/sounds/card_play.wav');
        this.load.audio(WAND_CARD_PLAY, 'assets/sounds/wand.ogg');
        this.load.audio(BOLT_CARD_PLAY, 'assets/sounds/bolt.ogg');
        this.load.audio(MIRROR_CARD_PLAY, 'assets/sounds/mirror.ogg');

        //Music
        this.load.audio(GAME_BGM, 'assets/music/Trails of Cold Steel OST - Game of Blades.mp3');
        this.load.audio(MENU_BGM, 'assets/music/Trails of Cold Steel OST - Dining Bar F.mp3');
        console.log("Loading");
    },
    create: function() {
        console.log("Create started");
        //Global music variables
        game.menuBGM = game.add.audio(MENU_BGM);
        game.menuBGM.volume = 0.2;
        game.menuBGM.autoplay = false;

        game.gameBGM = game.add.audio(GAME_BGM);
        game.gameBGM.volume = 0.2;
        game.gameBGM.autoplay = false;

        
        //Global speaker icon
        game.soundSprite = game.make.sprite(0, 0, SOUND_ICON);
        game.muteSprite = game.make.sprite(0, 0, MUTE_ICON);
        game.muteSprite.visible = false;
        game.stage.addChild(game.soundSprite);
        game.stage.addChild(game.muteSprite);
        game.soundSprite.inputEnabled = true;
        game.soundSprite.events.onInputDown.add(function() {
            game.soundSprite.visible = false;
            game.soundSprite.inputEnabled = false;
            game.muteSprite.visible = true;
            game.muteSprite.inputEnabled = true;
            game.menuBGM.mute = true;
            game.gameBGM.mute = true;
        })
        game.muteSprite.events.onInputDown.add(function() {
            game.muteSprite.visible = false;
            game.muteSprite.inputEnabled = false;
            game.soundSprite.visible = true;
            game.soundSprite.inputEnabled = true;
            game.menuBGM.mute = false;
            game.gameBGM.mute = false;
        })

    	let reloadText = this.add.text(game.world.centerX, game.world.centerY, 'An error occurred while loading assets. Please refresh the page.');
    	reloadText.anchor.setTo(0.5);
        console.log("Create complete. Changing state to title");
        game.state.start('title');
    }
}