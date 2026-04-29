import LoginScene from './scene/LoginScene.js';
import RegisterScene from './scene/RegisterScene.js';
import MenuScene from './scene/MenuScene.js';
import MainScene from './scene/MainScene.js';
import VirtualJoystick from './VirtualJoystick.js';

const config = {
  type: Phaser.AUTO,

  parent: 'game-container',

  dom: {
    createContainer: true
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true,
    fullscreenTarget: 'parent',
    width: 1280,
    height: 720,
    min: {
      width: 320,
      height: 180
    }
  },

  render: {
    pixelArt: true,
    antialias: false,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      fps: 60
    }
  },

  input: {
    queue: true,
    touch: {
      target: window
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
    const width = window.innerWidth;
    const height = window.innerHeight;
    window.game.scale.resize(width, height);
    window.game.scale.refresh();
  }
});

// Lidar com orientação
window.addEventListener('orientationchange', () => {
  if (window.game && window.game.isRunning()) {
    setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      window.game.scale.resize(width, height);
      window.game.scale.refresh();
    }, 200);
  }
});

// Detectar instalação do PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("[PWA] Install prompt disponível");
});

window.addEventListener('appinstalled', () => {
  console.log("[PWA] App instalado com sucesso!");
  deferredPrompt = null;
});

// Notificar quando estiver online/offline
window.addEventListener('online', () => {
  console.log("[PWA] Online - Jogo disponível");
});

window.addEventListener('offline', () => {
  console.log("[PWA] Offline - Usando cache");
});