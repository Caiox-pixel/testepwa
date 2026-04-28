export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image('menuBg', 'assets/img/menu-init-1.png');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.bgFar = this.add
      .tileSprite(0, 0, width, height, 'menuBg')
      .setOrigin(0)
      .setScrollFactor(0);

    this.bgNear = this.add
      .tileSprite(0, 0, width, height, 'menuBg')
      .setOrigin(0)
      .setScrollFactor(0)
      .setAlpha(0.35)
      .setDepth(-1);

    this.cameras.main.setBackgroundColor('#080a10');

    this.add
      .text(width / 2, 100, 'CHAOS RUSH', {
        fontSize: '64px',
        fill: '#00ffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.add
      .text(width / 2, 160, 'Fractured Realms', {
        fontSize: '20px',
        fill: '#cccccc',
      })
      .setOrigin(0.5)
      .setDepth(10);

    const painel = this.add
      .rectangle(width / 2, height / 2.4 + 40, 800, 600, 0x000000, 0.5)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x00ffff)
      .setDepth(5);

    const classes = [
      {
        Key: 'alquimista',
        name: 'A Alquimista Espectral',
        desc: 'Manipula frascos instáveis que causam efeitos aleatórios.\nCarregue sua passiva e acabe com seus inimigos.',
      },
      {
        Key: 'coveiro',
        name: 'O Coveiro Profano',
        desc: 'Profana a terra com a Foice Enferrujada, aplicando Podridão e Lentidão aos inimigos.',
      },
      {
        Key: 'sentinela',
        name: 'A Sentinela do Sino',
        desc: 'Toca o Sino da Purificação, causando dano em área e empurrando inimigos.\nDano bônus quando empurra inimigos.',
        estreia: 'EM BREVE!!!!',
      },
    ];

    const startY = height / 2 - 50;

    classes.forEach((cls, i) => {
      const btnY = startY + i * 90;

      const btn = this.add
        .rectangle(width / 2, btnY, 600, 80, 0x111122, 0.7)
        .setStrokeStyle(2, 0x00ffff)
        .setInteractive({ useHandCursor: true })
        .setDepth(6);

      this.add
        .text(btn.x, btnY - 20, cls.name, {
          fontSize: '22px',
          fill: '#00ffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
        .setDepth(7);

      this.add
        .text(btn.x, btnY + 15, cls.desc, {
          fontSize: '14px',
          fill: '#cccccc',
          align: 'center',
          wordWrap: { width: 550 },
        })
        .setOrigin(0.5)
        .setDepth(7);

      btn.on('pointerover', () => btn.setFillStyle(0x00ffff, 0.3));
      btn.on('pointerout', () => btn.setFillStyle(0x111122, 0.7));
      btn.on('pointerdown', () => {
        this.scene.start('MainScene', { selectedClassKey: cls.Key });
      });

      if (cls.estreia) {
        this.add
          .text(btn.x - 295, btnY - 35, cls.estreia, {
            fontSize: '20px',
            fill: '#ffff00',
            fontStyle: 'bold',
          })
          .setOrigin(0.01)
          .setDepth(7);
      }
    });

    this.add
      .text(width / 2, height - 140, 'Pressione uma classe para começar!!', {
        fontSize: '22px',
        fill: '#FFF700',
      })
      .setOrigin(0.5)
      .setDepth(7);

    this.scale.on('resize', this.resize, this);
  }

  resize(gameSize) {
    const { width, height } = gameSize;
    this.bgFar.setSize(width, height);
    this.bgNear.setSize(width, height);
  }

  update(time, delta) {
    const speedFar = 0.03 * delta;
    const speedNear = 0.08 * delta;

    this.bgFar.tilePositionX += speedFar;
    this.bgNear.tilePositionX -= speedNear;
  }
}
