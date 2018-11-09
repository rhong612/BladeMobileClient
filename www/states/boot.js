"use strict";
var bootState = {
    preload: function() {
        game.stage.disableVisibilityChange = true; //Make game run in background
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.refresh();
        this.load.image(PRELOAD_BAR_BACKGROUND, 'assets/images/loading_background.png')
        this.load.image(PRELOAD_BAR, 'assets/images/loading_bar.png');
    },
    create: function() {
        game.state.start('load');
    }
}