// ═══════════════════════════════════════════════════
// PATCH 1 — MainScene.js
// Adicionar 3 trechos ao arquivo existente
// ═══════════════════════════════════════════════════

// ── 1A) No topo do arquivo, após os outros imports ──
import VirtualJoystick from '../VirtualJoystick.js';


// ── 1B) No final do método create(), antes do fechar a chave ──
// (coloque logo depois do this.startGame(this.selectedClassKey))

    // Joystick virtual (só aparece em touch/mobile)
    this.joystick = new VirtualJoystick();


// ── 1C) Adicionar o método shutdown() à classe MainScene ──
// (adicione após o método update)

  shutdown() {
    this.joystick?.destroy();
  }


// ═══════════════════════════════════════════════════
// PATCH 2 — player.js
// Substituir APENAS o método handleMovement()
// ═══════════════════════════════════════════════════

  handleMovement() {
    const { up, down, left, right } = this.keys;

    let vx = 0;
    let vy = 0;

    // ── teclado (WASD) ──
    if (up.isDown)    vy = -1;
    else if (down.isDown)  vy =  1;

    if (left.isDown)  vx = -1;
    else if (right.isDown) vx =  1;

    // ── joystick virtual (mobile) ──
    const joy = this.scene?.joystick;
    if (joy?.active) {
      // joystick sobrescreve teclado quando ativo
      vx = joy.vx;
      vy = joy.vy;
    }

    const speed = this.dashing ? this.speed * 3 : this.speed;
    const vec = new Phaser.Math.Vector2(vx, vy).normalize();
    this.setVelocity(vec.x * speed, vec.y * speed);

    if (vx !== 0 || vy !== 0) {
      this.facing = this.getFacingDirection(vx, vy);
    }

    this.updateAnimations(vx, vy);
  }


// ── 2B) Substituir o método handleDash() ──

  handleDash() {
    if (!this.canAttack) return;

    const joyDash = this.scene?.joystick?.dashPressed;
    const keyDash = this.keys.dash.isDown;

    if ((keyDash || joyDash) && !this.dashing && !this.dashCooldown) {
      // consome o sinal do joystick para não repetir
      this.scene?.joystick?.consumeDash();

      this.dashing     = true;
      this.dashCooldown = true;

      this.scene.time.delayedCall(150, () => {
        this.dashing = false;
      });

      this.scene.time.delayedCall(600, () => {
        this.dashCooldown = false;
      });
    }
  }