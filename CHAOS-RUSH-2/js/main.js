import LoginScene from './scene/LoginScene.js';
import RegisterScene from './scene/RegisterScene.js';
import MenuScene from './scene/MenuScene.js';
import MainScene from './scene/MainScene.js';
import VirtualJoystick from '../VirtualJoystick.js';

const config = {
  type: Phaser.AUTO,

  parent: 'game-container',

  dom: {
    createContainer: true
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },

  render: {
    pixelArt: true
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },

  scene: [
    LoginScene,
    RegisterScene,
    MenuScene,
    MainScene
  ]
};

window.game = new Phaser.Game(config);