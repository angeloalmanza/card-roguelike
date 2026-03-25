import Phaser from 'phaser';
import { SaveManager } from '../managers/SaveManager.js';
import { MusicManager } from '../managers/MusicManager.js';
import { AscensionManager } from '../managers/AscensionManager.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';
import { LocaleManager } from '../managers/LocaleManager.js';

const T = {
  it: {
    subtitle:       'Un deckbuilder roguelike',
    continua:       'CONTINUA',
    nuovaPartita:   'NUOVA PARTITA',
    sfidaGiorno:    '⚔️  SFIDA DEL GIORNO',
    glossario:      'GLOSSARIO',
    abilita:        'ABILITÀ',
    statistiche:    'STATISTICHE',
    impostazioni:   '⚙ IMPOSTAZIONI',
    vittorie:       'Vittorie',
    pianoMax:       'Piano max',
    asc:            'Asc',
    ascensione:     'Ascensione',
    run:            'Run',
    fattoConPhaser: 'Fatto con Phaser 3',
  },
  en: {
    subtitle:       'A roguelike deckbuilder',
    continua:       'CONTINUE',
    nuovaPartita:   'NEW GAME',
    sfidaGiorno:    '⚔️  DAILY CHALLENGE',
    glossario:      'GLOSSARY',
    abilita:        'ABILITIES',
    statistiche:    'STATISTICS',
    impostazioni:   '⚙ SETTINGS',
    vittorie:       'Victories',
    pianoMax:       'Max floor',
    asc:            'Asc',
    ascensione:     'Ascension',
    run:            'Run',
    fattoConPhaser: 'Made with Phaser 3',
  },
};

/**
 * MainMenuScene — Redesign visivo con Theme.js
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;
    const lang = LocaleManager.getLang();
    const t = k => (T[lang] || T.it)[k] ?? T.it[k];

    MusicManager.start(this, 0.28);
    this._transitioning = false;
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Sfondo base ──────────────────────────────────────────────────────────
    this.add.image(width / 2, height / 2, 'bg-menu').setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45);

    // Linea accent superiore dorata
    this.add.rectangle(width / 2, 0, width, 2, C.borderGold).setOrigin(0.5, 0);

    // ── Decorazioni angoli (rombi) ────────────────────────────────────────────
    this._drawCornerDiamond(28, 28);
    this._drawCornerDiamond(width - 28, 28);
    this._drawCornerDiamond(28, height - 28);
    this._drawCornerDiamond(width - 28, height - 28);

    // ── Logo / Titolo ─────────────────────────────────────────────────────────
    const titleY = height / 2 - 150;

    const titleText = this.add.text(width / 2, titleY, 'IRONVEIL', {
      fontFamily: FONT_TITLE,
      fontSize: '52px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 5,
    }).setOrigin(0.5);


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
    this.add.text(width / 2, titleY + 58, t('subtitle'), {
      fontFamily: FONT_UI,
      fontSize: '14px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      letterSpacing: 1,
    }).setOrigin(0.5);

    // ── Bottoni ───────────────────────────────────────────────────────────────
    const hasSave = SaveManager.hasSave();
    let btnY = height / 2 - 30;

    if (hasSave) {
      createButton(this, width / 2, btnY, 270, 50, t('continua'), {
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

    createButton(this, width / 2, btnY, 270, 50, t('nuovaPartita'), {
      fill: C.btnDanger,
      hover: C.btnDangerHov,
      border: C.attack,
      fontSize: '16px',
      font: FONT_UI,
      letterSpacing: 3,
      onClick: () => this._go('ClassSelection', {}),
    });
    btnY += 64;

    createButton(this, width / 2, btnY, 270, 44, t('sfidaGiorno'), {
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

    createButton(this, rowX - smallW * 1.5 - smallGap * 1.5, btnY, smallW, smallH, t('glossario'), {
      fill: C.btnPrimary,
      hover: C.btnHover,
      border: 0x5b9bd5,
      fontSize: '12px',
      font: FONT_UI,
      letterSpacing: 1,
      onClick: () => this.scene.start('Glossary'),
    });

    createButton(this, rowX - smallW * 0.5 - smallGap * 0.5, btnY, smallW, smallH, t('abilita'), {
      fill: C.btnPrimary,
      hover: C.btnHover,
      border: C.borderGold,
      fontSize: '12px',
      font: FONT_UI,
      letterSpacing: 1,
      onClick: () => this._go('Perks', {}),
    });

    createButton(this, rowX + smallW * 0.5 + smallGap * 0.5, btnY, smallW, smallH, t('statistiche'), {
      fill: C.btnPrimary,
      hover: C.btnHover,
      border: C.borderSubtle,
      fontSize: '12px',
      font: FONT_UI,
      letterSpacing: 1,
      onClick: () => this.scene.start('Stats'),
    });

    createButton(this, rowX + smallW * 1.5 + smallGap * 1.5, btnY, smallW, smallH, t('impostazioni'), {
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

    if (stats.totalRuns > 0) {
      drawPanel(this, width / 2, footerY, width - 40, footerH, {
        fill: C.bgPanelDark,
        border: C.borderSubtle,
        borderWidth: 1,
        radius: 8,
      });
    }

    if (stats.totalRuns > 0) {
      const statsLine = [
        `${t('run')}: ${stats.totalRuns}`,
        `${t('vittorie')}: ${stats.victories}`,
        `${t('pianoMax')}: ${stats.highestFloor + 1}`,
        `${t('asc')}: ${ascLevel}`,
      ].join('   |   ');

      this.add.text(width / 2, footerY, statsLine, {
        fontFamily: FONT_BODY,
        fontSize: '11px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0.5);
    } else if (ascLevel > 0) {
      this.add.text(width / 2, footerY, `${t('ascensione')}: ${ascLevel}`, {
        fontFamily: FONT_BODY,
        fontSize: '11px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
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
