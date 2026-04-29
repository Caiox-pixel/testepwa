import { supabase } from '../supabaseClient.js';

export default class RegisterScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RegisterScene' });
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#080a10');

    const panelWidth = Math.min(520, width * 0.9);
    const panelHeight = Math.min(520, height * 0.88);
    const inputWidth = Math.min(320, panelWidth - 80);
    const titleSize = width < 420 ? '42px' : '52px';
    const subtitleSize = width < 420 ? '28px' : '34px';
    const panelX = width / 2;
    const panelY = height / 2;

    this.add.text(panelX, 80, 'CHAOS RUSH', {
      fontSize: titleSize,
      color: '#00ffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0x000000, 0.65)
      .setStrokeStyle(2, 0x00ffff);

    this.add.text(panelX, panelY - panelHeight / 2 + 80, 'REGISTRE-SE', {
      fontSize: subtitleSize,
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Tektur'
    }).setOrigin(0.5);

    const nome = this.add.dom(panelX, panelY - 20).createFromHTML(`
      <div style="width:${inputWidth}px; display:flex; justify-content:center;">
        <input id='nome' type='text' placeholder='Nome' style='width:100%;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff; font-size:16px;'>
      </div>
    `);

    const email = this.add.dom(panelX, panelY + 40).createFromHTML(`
      <div style="width:${inputWidth}px; display:flex; justify-content:center;">
        <input id='email' type='email' placeholder='E-mail' style='width:100%;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff; font-size:16px;'>
      </div>
    `);

    const senha = this.add.dom(panelX, panelY + 100).createFromHTML(`
      <div style="width:${inputWidth}px; display:flex; justify-content:center;">
        <input id='senha' type='password' placeholder='Senha' style='width:100%;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff; font-size:16px;'>
      </div>
    `);

    const confirmar = this.add.dom(panelX, panelY + 160).createFromHTML(`
      <div style="width:${inputWidth}px; display:flex; justify-content:center;">
        <input id='confirmar-senha' type='password' placeholder='Confirmar senha' style='width:100%;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff; font-size:16px;'>
      </div>
    `);

    const cadastrar = this.add.rectangle(panelX, panelY + panelHeight / 2 - 70, inputWidth, 52, 0x00aaff, 0.9)
      .setInteractive({ useHandCursor: true });

    this.add.text(panelX, panelY + panelHeight / 2 - 70, 'CADASTRAR', {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const status = this.add.text(panelX, panelY + panelHeight / 2 - 120, '', {
      fontSize: '16px',
      color: '#ffff00'
    }).setOrigin(0.5);

    cadastrar.on('pointerdown', async () => {
      const nomeValue = nome.node.querySelector('#nome').value.trim();
      const emailValue = email.node.querySelector('#email').value.trim();
      const senhaValue = senha.node.querySelector('#senha').value.trim();
      const confirmarValue = confirmar.node.querySelector('#confirmar-senha').value.trim();

      if (!nomeValue || !emailValue || !senhaValue || !confirmarValue) {
        status.setText('Preencha todos os campos');
        return;
      }

      if (senhaValue !== confirmarValue) {
        status.setText('As senhas não coincidem');
        return;
      }

      status.setText('Registrando...');

      const { data, error } = await supabase.auth.signUp({
        email: emailValue,
        password: senhaValue,
        options: {
          data: {
            nome: nomeValue
          }
        }
      });

      if (error) {
        console.error('Erro ao registrar:', error);
        status.setText(error.message || 'Erro ao registrar');
        return;
      }

      if (data.user && !data.session) {
        status.setText('Verifique seu e-mail para confirmar!');
      } else {
        status.setText('Registro realizado! Faça login.');
      }

      this.time.delayedCall(2000, () => this.scene.start('LoginScene'));
    });

    const loginLink = this.add.text(panelX, panelY + panelHeight / 2 - 30, 'Já tem conta? Faça login.', {
      fontSize: '14px',
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: panelWidth - 40 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    loginLink.on('pointerdown', () => {
      this.scene.start('LoginScene');
    });
  }
}
