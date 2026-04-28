import { supabase } from '../supabaseClient.js';

export default class RegisterScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RegisterScene' });
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#080a10');

    this.add.text(width / 2, 80, 'CHAOS RUSH', {
      fontSize: '52px', color: '#00ffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.rectangle(width / 2, height / 2, 520, 520, 0x000000, 0.65)
      .setStrokeStyle(2, 0x00ffff);

    this.add.text(width / 2, 220, 'REGISTRE-SE', {
      fontSize: '34px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Tektur'
    }).setOrigin(0.6);

    const nome = this.add.dom(width / 2, 300).createFromHTML(`
      <input id='nome' type='text' placeholder='Nome' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;'>
    `);

    const email = this.add.dom(width / 2, 360).createFromHTML(`
      <input id='email' type='email' placeholder='E-mail' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;'>
    `);

    const senha = this.add.dom(width / 2, 420).createFromHTML(`
      <input id='senha' type='password' placeholder='Senha' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;'>
    `);

    const confirmar = this.add.dom(width / 2, 480).createFromHTML(`
      <input id='confirmar-senha' type='password' placeholder='Confirmar senha' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;'>
    `);

    const cadastrar = this.add.rectangle(width / 2, 550, 320, 52, 0x00aaff, 0.9)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 550, 'CADASTRAR', {
      fontSize: '24px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    const status = this.add.text(width / 2, 515, '', {
      fontSize: '18px', color: '#ffff00'
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

    const loginLink = this.add.text(width / 2, height - 60, 'Já tem conta? Faça login.', {
      fontSize: '16px', color: '#cccccc'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    loginLink.on('pointerdown', () => {
      this.scene.start('LoginScene');
    });
  }
}
