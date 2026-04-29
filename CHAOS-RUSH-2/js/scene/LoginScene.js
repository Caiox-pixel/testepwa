import { supabase } from '../supabaseClient.js';

export default class LoginScene extends Phaser.Scene {
  constructor(){ super({ key:'LoginScene' }); }

  create(){
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#080a10');

    const panelWidth = Math.min(520, width * 0.9);
    const panelHeight = Math.min(420, height * 0.78);
    const inputWidth = Math.min(320, panelWidth - 80);
    const titleSize = width < 420 ? '42px' : '52px';
    const subtitleSize = width < 420 ? '28px' : '34px';
    const panelX = width / 2;
    const panelY = height / 2;

    this.add.text(panelX, 80, 'CHAOS RUSH', {
      fontSize: titleSize,
      color:'#00ffff',
      fontStyle:'bold'
    }).setOrigin(0.5);

    this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0x000000, 0.65)
      .setStrokeStyle(2, 0x00ffff);

    this.add.text(panelX, panelY - panelHeight / 2 + 80, 'LOGIN', {
      fontSize: subtitleSize,
      color:'#ffffff',
      fontStyle:'bold',
      fontFamily:'Tektur'
    }).setOrigin(0.5);

    const email = this.add.dom(panelX, panelY - 40).createFromHTML(`
      <div style="width:${inputWidth}px; display:flex; justify-content:center;">
        <input id='email' type='email' placeholder='E-mail' style='width:100%;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff; font-size:16px;'>
      </div>
    `);

    const senha = this.add.dom(panelX, panelY + 40).createFromHTML(`
      <div style="width:${inputWidth}px; display:flex; justify-content:center;">
        <input id='senha' type='password' placeholder='Senha' style='width:100%;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff; font-size:16px;'>
      </div>
    `);

    const entrar = this.add.rectangle(panelX, panelY + panelHeight / 2 - 70, inputWidth, 52, 0x00aaff, 0.9)
      .setInteractive({ useHandCursor:true });

    this.add.text(panelX, panelY + panelHeight / 2 - 70, 'ENTRAR', {
      fontSize:'22px',
      color:'#ffffff',
      fontStyle:'bold'
    }).setOrigin(0.5);

    const status = this.add.text(panelX, panelY + panelHeight / 2 - 120, '', {
      fontSize:'16px',
      color:'#ffff00'
    }).setOrigin(0.5);

    entrar.on('pointerdown', async () => {
      const emailValue = email.node.querySelector('#email').value.trim();
      const senhaValue = senha.node.querySelector('#senha').value.trim();

      if(!emailValue || !senhaValue){
        status.setText('Preencha e-mail e senha');
        return;
      }

      status.setText('Conectando...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValue,
        password: senhaValue
      });

      console.log('Supabase login result', { emailValue, data, error });

      if(error){
        status.setText(error.message || 'Erro ao autenticar');
        return;
      }

      if(!data || !data.session){
        status.setText('Falha no login: sessão não gerada');
        console.error('Supabase login sem session', data);
        return;
      }

      // Salva dados do usuário
      const userName = data.user?.user_metadata?.nome || data.user?.email || '';
      localStorage.setItem('chaos_user', JSON.stringify({
        email: data.user.email,
        nome: userName
      }));

      status.setText('Login realizado!');
      this.time.delayedCall(700, () => this.scene.start('MenuScene'));
    });

    const registerLink = this.add.text(panelX, panelY + panelHeight / 2 - 30, 'Ainda não tem conta? Registrar', {
      fontSize:'14px',
      color:'#cccccc',
      align:'center',
      wordWrap: { width: panelWidth - 40 }
    }).setOrigin(0.5).setInteractive({ useHandCursor:true });

    registerLink.on('pointerdown', () => {
      this.scene.start('RegisterScene');
    });
  }
}
