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
    orientation: Phaser.Scale.PORTRAIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true,
    fullscreenTarget: 'parent',
    width: 720,
    height: 1280,
    min: {
      width: 320,
      height: 568
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

const lockPortraitOrientation = () => {
  const desired = 'portrait-primary';
  const screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
  const lockFn = screenOrientation?.lock || screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

  if (typeof lockFn === 'function') {
    try {
      const lockTarget = screenOrientation || screen;
      const result = lockFn.call(lockTarget, desired);
      if (result && typeof result.then === 'function') {
        result.then(() => console.log('[PWA] Orientação travada em retrato'))
          .catch(err => console.warn('[PWA] Falha ao travar retrato:', err));
      }
    } catch (err) {
      console.warn('[PWA] Orientação retrato não pôde ser aplicada:', err);
    }
  }
};

const updatePortraitOverlay = () => {
  const overlay = document.getElementById('orientation-lock-overlay');
  if (!overlay) return;
  const isLandscape = window.innerWidth > window.innerHeight;
  overlay.classList.toggle('hidden', !isLandscape);
};

window.addEventListener('load', () => {
  lockPortraitOrientation();
  updatePortraitOverlay();
  if (window.game && window.game.scale) {
    window.game.scale.resize(window.innerWidth, window.innerHeight);
  }
});

// Redimensionar jogo quando janela mudar
window.addEventListener('resize', () => {
  updatePortraitOverlay();
  if (window.game && window.game.scale) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    window.game.scale.resize(width, height);
    if (window.game.scale.refresh) {
      window.game.scale.refresh();
    }
  }
});

// Lidar com orientação
window.addEventListener('orientationchange', () => {
  updatePortraitOverlay();
  if (window.game && window.game.scale) {
    setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      window.game.scale.resize(width, height);
      if (window.game.scale.refresh) {
        window.game.scale.refresh();
      }
    }, 200);
  }
});

// Detectar instalação do PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
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