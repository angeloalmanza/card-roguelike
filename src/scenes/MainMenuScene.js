import Phaser from 'phaser';
import { SaveManager } from '../managers/SaveManager.js';
import { MusicManager } from '../managers/MusicManager.js';
import { AscensionManager } from '../managers/AscensionManager.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';

/**
 * MainMenuScene — Redesign visivo con Theme.js
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;

    MusicManager.start(this, 0.28);
    this._transitioning = false;
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Sfondo base ──────────────────────────────────────────────────────────
    this.add.rectangle(width / 2, height / 2, width, height, C.bg);

    // Cerchio luminoso centrale
    const bgGlow = this.add.graphics();
    bgGlow.fillStyle(0x1a2040, 0.3);
    bgGlow.fillCircle(width / 2, height / 2, 400);

    // Vignetta scura agli angoli
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.4);
    vignette.fillRect(0, 0, width, height);
    vignette.fillStyle(C.bg, 1);
    vignette.fillCircle(width / 2, height / 2, Math.max(width, height) * 0.7);

    // Linea accent superiore dorata
    this.add.rectangle(width / 2, 0, width, 2, C.borderGold).setOrigin(0.5, 0);

    // ── Decorazioni angoli (rombi) ────────────────────────────────────────────
    this._drawCornerDiamond(28, 28);
    this._drawCornerDiamond(width - 28, 28);
    this._drawCornerDiamond(28, height - 28);
    this._drawCornerDiamond(width - 28, height - 28);

    // ── Logo / Titolo ─────────────────────────────────────────────────────────
    const titleY = height / 2 - 150;

    // Linea dorata sopra
    drawDivider(this, width / 2, titleY - 22, 260, { color: C.borderGold, alpha: 0.7 });

    const titleText = this.add.text(width / 2, titleY, 'CARD ROGUELIKE', {
      fontFamily: FONT_TITLE,
      fontSize: '52px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 5,
    }).setOrigin(0.5);

    // Linea dorata sotto
    drawDivider(this, width / 2, titleY + 38, 260, { color: C.borderGold, alpha: 0.7 });

    // Animazione lieve float
    this.tweens.add({
      targets: titleText,
      y: titleY - 4,
      duration: 2500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Sottotitolo
    this.add.text(width / 2, titleY + 58, 'Un deckbuilder roguelike', {
      fontFamily: FONT_UI,
      fontSize: '14px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      letterSpacing: 1,
    }).setOrigin(0.5);

    // ── Bottoni ───────────────────────────────────────────────────────────────
    const hasSave = SaveManager.hasSave();
    let btnY = height / 2 - 30;

    if (hasSave) {
      createButton(this, width / 2, btnY, 270, 50, 'CONTINUA', {
        fill: C.btnSuccess,
        hover: C.btnSuccessHov,
        border: C.skill,
        fontSize: '16px',
        font: FONT_UI,
        letterSpacing: 3,
        onClick: () => {
          const runData = SaveManager.loadRun();
          if (runData.inCombat) {
            this._go('Combat', { runData, nodeType: runData.inCombat });
          } else {
            this._go('Map', { runData });
          }
        },
      });
      btnY += 64;
    }

    createButton(this, width / 2, btnY, 270, 50, 'NUOVA PARTITA', {
      fill: C.btnDanger,
      hover: C.btnDangerHov,
      border: C.attack,
      fontSize: '16px',
      font: FONT_UI,
      letterSpacing: 3,
      onClick: () => this._go('ClassSelection', {}),
    });
    btnY += 64;

    createButton(this, width / 2, btnY, 270, 44, '⚔️  SFIDA DEL GIORNO', {
      fill: 0x2a1800,
      hover: 0x3d2200,
      border: C.rare,
      fontSize: '14px',
      font: FONT_UI,
      letterSpacing: 2,
      onClick: () => this._go('Challenge', {}),
    });
    btnY += 56;

    // Fila bottoni secondari
    const smallW = 118;
    const smallH = 38;
    const smallGap = 10;
    const rowX = width / 2;

    createButton(this, rowX - smallW * 1.5 - smallGap * 1.5, btnY, smallW, smallH, 'GLOSSARIO', {
      fill: C.btnPrimary,
      hover: C.btnHover,
      border: 0x5b9bd5,
      fontSize: '12px',
      font: FONT_UI,
      letterSpacing: 1,
      onClick: () => this.scene.start('Glossary'),
    });

    createButton(this, rowX - smallW * 0.5 - smallGap * 0.5, btnY, smallW, smallH, 'ABILITÀ', {
      fill: C.btnPrimary,
      hover: C.btnHover,
      border: C.borderGold,
      fontSize: '12px',
      font: FONT_UI,
      letterSpacing: 1,
      onClick: () => this._go('Perks', {}),
    });

    createButton(this, rowX + smallW * 0.5 + smallGap * 0.5, btnY, smallW, smallH, 'STATISTICHE', {
      fill: C.btnPrimary,
      hover: C.btnHover,
      border: C.borderSubtle,
      fontSize: '12px',
      font: FONT_UI,
      letterSpacing: 1,
      onClick: () => this.scene.start('Stats'),
    });

    createButton(this, rowX + smallW * 1.5 + smallGap * 1.5, btnY, smallW, smallH, '⚙ IMPOSTAZIONI', {
      fill: C.btnPrimary,
      hover: C.btnHover,
      border: C.borderGoldDim,
      fontSize: '11px',
      font: FONT_UI,
      letterSpacing: 1,
      onClick: () => this._go('Settings', {}),
    });

    // ── Stats footer panel ────────────────────────────────────────────────────
    const stats = SaveManager.getStats();
    const ascLevel = AscensionManager.getLevel();

    const footerH = 36;
    const footerY = height - footerH / 2 - 10;
    drawPanel(this, width / 2, footerY, width - 40, footerH, {
      fill: C.bgPanelDark,
      border: C.borderSubtle,
      borderWidth: 1,
      radius: 8,
    });

    if (stats.totalRuns > 0) {
      const statsLine = [
        `Run: ${stats.totalRuns}`,
        `Vittorie: ${stats.victories}`,
        `Piano max: ${stats.highestFloor + 1}`,
        `Asc: ${ascLevel}`,
      ].join('   |   ');

      this.add.text(width / 2, footerY, statsLine, {
        fontFamily: FONT_BODY,
        fontSize: '11px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0.5);
    } else if (ascLevel > 0) {
      this.add.text(width / 2, footerY, `Ascensione: ${ascLevel}`, {
        fontFamily: FONT_BODY,
        fontSize: '11px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0.5);
    } else {
      this.add.text(width / 2, footerY, 'Fatto con Phaser 3', {
        fontFamily: FONT_BODY,
        fontSize: '10px',
        color: '#' + C.borderSubtle.toString(16).padStart(6, '0'),
      }).setOrigin(0.5);
    }
  }

  _drawCornerDiamond(x, y) {
    const g = this.add.graphics();
    g.fillStyle(C.borderGoldDim, 0.6);
    g.fillTriangle(x, y - 7, x + 7, y, x, y + 7);
    g.fillTriangle(x, y - 7, x - 7, y, x, y + 7);
  }

  _go(key, data) {
    if (this._transitioning) return;
    this._transitioning = true;
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(key, data));
  }
}
