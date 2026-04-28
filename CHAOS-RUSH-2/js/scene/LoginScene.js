import { supabase } from '../supabaseClient.js';

export default class LoginScene extends Phaser.Scene {
  constructor(){ super({ key:'LoginScene' }); }

  create(){
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#080a10');

    this.add.text(width/2, 80, 'CHAOS RUSH', {
      fontSize:'52px', color:'#00ffff', fontStyle:'bold'
    }).setOrigin(0.5);

    this.add.rectangle(width/2, height/2, 520, 420, 0x000000, 0.65)
      .setStrokeStyle(2, 0x00ffff);

    this.add.text(width/2, 220, 'LOGIN', {
      fontSize:'34px', color:'#ffffff', fontStyle:'bold', fontFamily:'Tektur'
    }).setOrigin(0.6);

    const email = this.add.dom(width/2, 310).createFromHTML(`
      <input id='email' type='email' placeholder='E-mail' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff; position:relative; z-index:1;'>
    `);

    const senha = this.add.dom(width/2, 400).createFromHTML(`
      <input id='senha' type='password' placeholder='Senha' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;'>
    `);

    const entrar = this.add.rectangle(width/2, 490, 320, 52, 0x00aaff, 0.9)
      .setInteractive({ useHandCursor:true });

    this.add.text(width/2, 490, 'ENTRAR', {
      fontSize:'24px', color:'#ffffff', fontStyle:'bold'
    }).setOrigin(0.5);

    const status = this.add.text(width/2, 455, '', {
      fontSize:'18px', color:'#ffff00'
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

    const registerLink = this.add.text(width/2, height-60, 'Ainda não tem conta? Registrar', {
      fontSize:'16px', color:'#cccccc'
    }).setOrigin(0.5).setInteractive({ useHandCursor:true });

    registerLink.on('pointerdown', () => {
      this.scene.start('RegisterScene');
    });
  }
}
