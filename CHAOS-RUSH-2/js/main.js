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
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true,
    fullscreenTarget: 'parent',
    min: {
      width: 320,
      height: 180
    }
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

// Redimensionar jogo quando janela mudar
window.addEventListener('resize', () => {
  if (window.game && window.game.isRunning()) {
    window.game.scale.refresh();
  }
});