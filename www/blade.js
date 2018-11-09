"use strict";

const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, 'game');

game.state.add('disconnected', disconnectedState);
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('menu', menuState);
game.state.add('multi_play', multiPlayState);
game.state.add('multi_play_menu', multiPlayMenuState)
game.state.start('boot');

