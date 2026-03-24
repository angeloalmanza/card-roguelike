import Phaser from 'phaser';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';

const CHALLENGES = [
  {
    id: 'iron_man',
    name: 'Uomo di Ferro',
    emoji: '🛡️',
    description: 'Nessun nodo riposo disponibile sulla mappa.\nBonus: +50% oro da combattimenti.',
    difficulty: '★★★',
    difficultyColor: '#e85d5d',
    flags: { noRest: true, goldBonus: 1.5 },
  },
  {
    id: 'glass_cannon',
    name: 'Cannone di Vetro',
    emoji: '💥',
    description: 'HP massimi dimezzati,\nma il danno è raddoppiato.',
    difficulty: '★★★★',
    difficultyColor: '#e85d5d',
    flags: { halfHp: true, doubleDamage: true },
  },
  {
    id: 'cursed_run',
    name: 'Run Maledetta',
    emoji: '💀',
    description: 'Inizi con 3 carte Maledizione nel mazzo.\nBonus: reliquie più rare.',
    difficulty: '★★★',
    difficultyColor: '#b07be8',
    flags: { startCursed: true, betterRelics: true },
  },
];

export class ChallengeScene extends Phaser.Scene {
  constructor() {
    super('Challenge');
  }

  create() {
    const { width, height } = this.scale;
    this._transitioning = false;
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // ── Sfondo ────────────────────────────────────────────────────────────────
    this.add.rectangle(width / 2, height / 2, width, height, C.bg);

    const bgGlow = this.add.graphics();
    bgGlow.fillStyle(0x2a1010, 0.25);
    bgGlow.fillCircle(width / 2, height / 2, 360);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.4);
    vignette.fillRect(0, 0, width, height);
    vignette.fillStyle(C.bg, 1);
    vignette.fillCircle(width / 2, height / 2, Math.max(width, height) * 0.7);

    // Accent rosso superiore
    this.add.rectangle(width / 2, 0, width, 2, C.attack).setOrigin(0.5, 0);

    // ── Header ────────────────────────────────────────────────────────────────
    this.add.text(width / 2, 42, 'MODALITÀ SFIDA', {
      fontFamily: FONT_TITLE,
      fontSize: '28px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 5,
    }).setOrigin(0.5);

    this.add.text(width / 2, 74, "Affronta la sfida del giorno per un'esperienza unica", {
      fontFamily: FONT_UI,
      fontSize: '12px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);

    // Bottone indietro
    createButton(this, 90, 42, 140, 36, 'INDIETRO', {
      fill: C.bgPanel,
      hover: C.btnHover,
      border: C.borderGold,
      borderWidth: 2,
      radius: 8,
      fontSize: '13px',
      font: FONT_UI,
      textColor: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      letterSpacing: 2,
      onClick: () => this._go('MainMenu', {}),
    });

    drawDivider(this, width / 2, 96, width - 80, { color: C.borderSubtle, alpha: 0.5 });

    // Etichetta sfida del giorno
    this.add.text(width / 2, 116, '— SFIDA DEL GIORNO —', {
      fontFamily: FONT_UI,
      fontSize: '11px',
      color: '#' + C.hp.toString(16).padStart(6, '0'),
      letterSpacing: 4,
    }).setOrigin(0.5);

    // ── Card sfida ────────────────────────────────────────────────────────────
    const dayIndex = new Date().getDate() % 3;
    const todayChallenge = CHALLENGES[dayIndex];

    const cardW = 500;
    const cardH = 250;
    const cardY = height / 2 - 20;

    // Pannello principale
    drawPanel(this, width / 2, cardY, cardW, cardH, {
      radius: 14,
      fill: C.bgCard,
      border: C.attack,
      borderWidth: 3,
    });

    // Glow animato
    const glowG = this.add.graphics();
    const drawGlow = (alpha) => {
      glowG.clear();
      glowG.lineStyle(8, C.attack, alpha);
      glowG.strokeRoundedRect(
        width / 2 - cardW / 2 - 10,
        cardY - cardH / 2 - 10,
        cardW + 20,
        cardH + 20,
        18,
      );
    };
    drawGlow(0.06);

    this.tweens.add({
      targets: { val: 0.06 },
      val: 0.14,
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => drawGlow(tween.getValue()),
    });

    const topY = cardY - cardH / 2;

    // Emoji + nome
    this.add.text(width / 2, topY + 40, todayChallenge.emoji, {
      fontSize: '38px',
    }).setOrigin(0.5);

    this.add.text(width / 2, topY + 86, todayChallenge.name.toUpperCase(), {
      fontFamily: FONT_TITLE,
      fontSize: '22px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 3,
    }).setOrigin(0.5);

    drawDivider(this, width / 2, topY + 106, cardW - 60, {
      color: C.borderGold, alpha: 0.4,
    });

    this.add.text(width / 2, topY + 120, todayChallenge.description, {
      fontFamily: FONT_BODY,
      fontSize: '12px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      align: 'center',
      wordWrap: { width: cardW - 60 },
    }).setOrigin(0.5, 0);

    this.add.text(width / 2, topY + cardH - 26, `Difficoltà: ${todayChallenge.difficulty}`, {
      fontFamily: FONT_UI,
      fontSize: '13px',
      color: todayChallenge.difficultyColor,
      fontStyle: '700',
    }).setOrigin(0.5);

    // ── Bottoni ───────────────────────────────────────────────────────────────
    const btnY = height / 2 + cardH / 2 + 44;

    createButton(this, width / 2 - 155, btnY, 240, 50, '⚔️  ACCETTA SFIDA', {
      fill: C.btnDanger,
      hover: C.btnDangerHov,
      border: C.attack,
      fontSize: '14px',
      font: FONT_UI,
      letterSpacing: 2,
      onClick: () => this._go('ClassSelection', { challengeData: todayChallenge }),
    });

    createButton(this, width / 2 + 155, btnY, 240, 50, '🎮  GIOCA NORMALE', {
      fill: C.btnPrimary,
      hover: C.btnHover,
      border: C.borderSubtle,
      fontSize: '14px',
      font: FONT_UI,
      letterSpacing: 2,
      onClick: () => this._go('ClassSelection', {}),
    });

    // Nota
    this.add.text(width / 2, height - 18, 'La sfida del giorno cambia ogni giorno', {
      fontFamily: FONT_BODY,
      fontSize: '10px',
      color: '#' + C.borderSubtle.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);
  }

  _go(key, data) {
    if (this._transitioning) return;
    this._transitioning = true;
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(key, data));
  }
}
