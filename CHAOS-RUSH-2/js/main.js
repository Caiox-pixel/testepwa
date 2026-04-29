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
    orientation: 'portrait-primary',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true,
    fullscreenTarget: 'parent',
    width: 720,
    height: 1280,
    min: {
      width: 320,
      height: 568
    },
    autoRound: true
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

const resumeAudioOnGesture = () => {
  const resume = () => {
    if (window.game && window.game.sound && window.game.sound.context) {
      const context = window.game.sound.context;
      if (context.state === 'suspended' && typeof context.resume === 'function') {
        context.resume().then(() => {
          console.log('[PWA] Audio liberado após gesto do usuário');
        }).catch(err => {
          console.warn('[PWA] Falha ao resumir áudio:', err);
        });
      }
    }
    window.removeEventListener('pointerdown', resume);
    window.removeEventListener('touchstart', resume);
  };

  window.addEventListener('pointerdown', resume, { once: true });
  window.addEventListener('touchstart', resume, { once: true });
};

const updatePortraitOverlay = () => {
  const overlay = document.getElementById('orientation-lock-overlay');
  if (!overlay) return;
  const isLandscape = window.innerWidth > window.innerHeight;
  overlay.classList.toggle('hidden', !isLandscape);
};

const resizeGame = () => {
  updatePortraitOverlay();

  if (!window.game || !window.game.scale) {
    return;
  }

  const width = document.documentElement.clientWidth || window.innerWidth;
  const height = document.documentElement.clientHeight || window.innerHeight;

  window.game.scale.resize(width, height);
  if (window.game.scale.refresh) {
    window.game.scale.refresh();
  }
};

window.addEventListener('load', () => {
  lockPortraitOrientation();
  updatePortraitOverlay();
  resumeAudioOnGesture();
  resizeGame();
});

window.addEventListener('resize', resizeGame);
window.addEventListener('orientationchange', () => {
  setTimeout(resizeGame, 200);
});

if (screen.orientation && typeof screen.orientation.addEventListener === 'function') {
  screen.orientation.addEventListener('change', () => {
    setTimeout(resizeGame, 200);
  });
}

// Detectar instalação do PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("[PWA] Install prompt disponível");

  const promptInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      console.log('[PWA] Resultado do prompt de instalação:', choiceResult.outcome);
      deferredPrompt = null;
    }).catch(err => {
      console.warn('[PWA] Falha ao exibir prompt de instalação:', err);
    });
    window.removeEventListener('pointerdown', promptInstall);
    window.removeEventListener('touchstart', promptInstall);
  };

  window.addEventListener('pointerdown', promptInstall, { once: true });
  window.addEventListener('touchstart', promptInstall, { once: true });
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