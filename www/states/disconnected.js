"use strict";
var disconnectedState = {
	create: function() {
        this.stage.backgroundColor = "#4488AA";
        let text = this.add.text(game.world.centerX, game.world.centerY, 'Connection lost due to inactivity. \n Refresh the page to reconnect.', { fontSize: '50px' });
        text.anchor.setTo(0.5);
    }
}