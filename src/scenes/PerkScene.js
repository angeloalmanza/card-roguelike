import Phaser from 'phaser';
import { PerkManager, PERK_DEFINITIONS } from '../managers/PerkManager.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';
import { LocaleManager } from '../managers/LocaleManager.js';

const T = {
  it: {
    header:        'ALBERO ABILITÀ',
    subheader:     'Sblocca abilità permanenti che persistono tra le run',
    indietro:      'INDIETRO',
    livello:       (n) => `LIVELLO ${n}`,
    footerNote:    'Guadagni 1 punto abilità alla fine di ogni run (vittoria o sconfitta)',
    puntiDisp:     (pts) => `${pts} punto${pts !== 1 ? 'i' : ''} disponibile${pts !== 1 ? 'i' : ''}`,
    sbloccato:     '✓ SBLOCCATO',
    bloccato:      '🔒 BLOCCATO',
    costo:         (pts) => `Costo: ${pts} punto${pts !== 1 ? 'i' : ''}`,
    puntiInsuff:   'Punti insufficienti!',
    sbloccatoMsg:  (emoji, name) => `${emoji} ${name} sbloccato!`,
  },
  en: {
    header:        'ABILITY TREE',
    subheader:     'Unlock permanent abilities that persist between runs',
    indietro:      'BACK',
    livello:       (n) => `LEVEL ${n}`,
    footerNote:    'Earn 1 ability point at the end of every run (win or loss)',
    puntiDisp:     (pts) => `${pts} point${pts !== 1 ? 's' : ''} available`,
    sbloccato:     '✓ UNLOCKED',
    bloccato:      '🔒 LOCKED',
    costo:         (pts) => `Cost: ${pts} point${pts !== 1 ? 's' : ''}`,
    puntiInsuff:   'Insufficient points!',
    sbloccatoMsg:  (emoji, name) => `${emoji} ${name} unlocked!`,
  },
};

/**
 * PerkScene — Albero abilità passivo (Perk System).
 * Redesign con Theme.js.
 */
export class PerkScene extends Phaser.Scene {
  constructor() {
    super('Perks');
  }

  create() {
    const { width, height } = this.scale;
    this._transitioning = false;
    this.cameras.main.fadeIn(400, 0, 0, 0);
    const lang = LocaleManager.getLang();
    const t = k => (T[lang] || T.it)[k] ?? T.it[k];
    this._t = t;

    // ── Sfondo ────────────────────────────────────────────────────────────────
    this.add.rectangle(width / 2, height / 2, width, height, C.bg);

    const bgGlow = this.add.graphics();
    bgGlow.fillStyle(0x1a1a30, 0.25);
    bgGlow.fillCircle(width / 2, height / 2, 360);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.4);
    vignette.fillRect(0, 0, width, height);
    vignette.fillStyle(C.bg, 1);
    vignette.fillCircle(width / 2, height / 2, Math.max(width, height) * 0.7);

    // Accent dorato superiore
    this.add.rectangle(width / 2, 0, width, 2, C.borderGold).setOrigin(0.5, 0);

    // ── Header ────────────────────────────────────────────────────────────────
    this.add.text(width / 2, 42, t('header'), {
      fontFamily: FONT_TITLE,
      fontSize: '28px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 5,
    }).setOrigin(0.5);

    this.add.text(width / 2, 74, t('subheader'), {
      fontFamily: FONT_UI,
      fontSize: '12px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);

    // Bottone indietro
    createButton(this, 90, 42, 140, 36, t('indietro'), {
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

    // Punti disponibili
    this._pointsText = this.add.text(width - 20, 42, '', {
      fontFamily: FONT_UI,
      fontSize: '14px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      fontStyle: '700',
    }).setOrigin(1, 0.5);
    this._refreshPointsText();

    // ── Livello 1 ─────────────────────────────────────────────────────────────
    this._drawLevelLabel(width / 2, 110, t('livello')(1));
    this._drawLevel(1, PERK_DEFINITIONS.filter(p => p.level === 1), 128, t);

    drawDivider(this, width / 2, 308, width - 100, { color: C.borderSubtle, alpha: 0.3 });
    this._drawLevelLabel(width / 2, 320, t('livello')(2));
    this._drawLevel(2, PERK_DEFINITIONS.filter(p => p.level === 2), 336, t);

    drawDivider(this, width / 2, 516, width - 100, { color: C.borderSubtle, alpha: 0.3 });
    this._drawLevelLabel(width / 2, 528, t('livello')(3));
    this._drawLevel(3, PERK_DEFINITIONS.filter(p => p.level === 3), 544, t);

    // Nota footer
    drawDivider(this, width / 2, height - 38, width - 80, { color: C.borderSubtle, alpha: 0.3 });
    this.add.text(width / 2, height - 20, t('footerNote'), {
      fontFamily: FONT_BODY,
      fontSize: '10px',
      color: '#' + C.borderSubtle.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);
  }

  _drawLevelLabel(x, y, label) {
    this.add.text(x, y, label, {
      fontFamily: FONT_UI,
      fontSize: '10px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      fontStyle: '700',
      letterSpacing: 3,
    }).setOrigin(0.5);
  }

  _refreshPointsText() {
    const pts = PerkManager.getPoints();
    const t = this._t;
    this._pointsText.setText(t('puntiDisp')(pts));
  }

  _drawLevel(level, defs, startY, t) {
    const { width } = this.scale;
    const cardW = 240;
    const cardH = 150;
    const gap = 40;
    const count = defs.length;
    const totalW = count * cardW + (count - 1) * gap;
    const startX = (width - totalW) / 2 + cardW / 2;

    defs.forEach((def, i) => {
      const cx = startX + i * (cardW + gap);
      const cy = startY + cardH / 2;
      this._drawPerkCard(cx, cy, cardW, cardH, def, t);
    });
  }

  _drawPerkCard(cx, cy, cw, ch, def, t) {
    const unlocked  = PerkManager.hasUnlocked(def.id);
    const available = PerkManager.isAvailable(def.id);
    const canAfford = PerkManager.getPoints() >= def.cost;

    let fillColor, borderColor, nameColor, subColor;

    if (unlocked) {
      fillColor   = C.bgPanelDark;
      borderColor = C.borderGold;
      nameColor   = '#' + C.textGoldBright.toString(16).padStart(6, '0');
      subColor    = '#' + C.textGold.toString(16).padStart(6, '0');
    } else if (available) {
      fillColor   = C.bgCard;
      borderColor = canAfford ? C.borderBright : C.borderSubtle;
      nameColor   = '#' + C.textPrimary.toString(16).padStart(6, '0');
      subColor    = '#' + C.textSecondary.toString(16).padStart(6, '0');
    } else {
      fillColor   = C.bgPanelDark;
      borderColor = C.btnDisabled;
      nameColor   = '#' + C.textSecondary.toString(16).padStart(6, '0');
      subColor    = '#' + C.borderSubtle.toString(16).padStart(6, '0');
    }

    drawPanel(this, cx, cy, cw, ch, {
      radius: 10,
      fill: fillColor,
      border: borderColor,
      borderWidth: 2,
    });

    const topY = cy - ch / 2;

    // Emoji
    this.add.text(cx, topY + 22, def.emoji, { fontSize: '24px' }).setOrigin(0.5);

    // Nome
    this.add.text(cx, topY + 52, LocaleManager.name(def).toUpperCase(), {
      fontFamily: FONT_UI,
      fontSize: '13px',
      color: nameColor,
      fontStyle: '700',
      letterSpacing: 1,
    }).setOrigin(0.5);

    // Descrizione
    this.add.text(cx, topY + 70, LocaleManager.desc(def), {
      fontFamily: FONT_BODY,
      fontSize: '10px',
      color: subColor,
      align: 'center',
      wordWrap: { width: cw - 24 },
    }).setOrigin(0.5, 0);

    // Stato / costo
    const botY = cy + ch / 2 - 18;
    if (unlocked) {
      this.add.text(cx, botY, t('sbloccato'), {
        fontFamily: FONT_UI, fontSize: '10px',
        color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
        fontStyle: '700', letterSpacing: 1,
      }).setOrigin(0.5);
    } else if (available) {
      const costColor = canAfford
        ? '#' + C.borderBright.toString(16).padStart(6, '0')
        : '#' + C.textSecondary.toString(16).padStart(6, '0');
      this.add.text(cx, botY, t('costo')(def.cost), {
        fontFamily: FONT_UI, fontSize: '10px', color: costColor, fontStyle: '700',
      }).setOrigin(0.5);

      if (canAfford) {
        const hitArea = this.add.rectangle(cx, cy, cw, ch, 0xffffff, 0)
          .setInteractive({ useHandCursor: true });
        hitArea.on('pointerover', () => {
          // Ridisegna pannello con hover color — abbastanza con alpha overlay
        });
        hitArea.on('pointerup', () => this._tryUnlock(def.id));
      }
    } else {
      this.add.text(cx, botY, t('bloccato'), {
        fontFamily: FONT_UI, fontSize: '10px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        fontStyle: '700',
      }).setOrigin(0.5);
    }
  }

  _tryUnlock(id) {
    const def = PERK_DEFINITIONS.find(p => p.id === id);
    if (!def) return;
    const t = this._t;

    const pts = PerkManager.getPoints();
    if (pts < def.cost) {
      this._showFeedback(t('puntiInsuff'), '#e85d5d');
      return;
    }

    const success = PerkManager.unlock(id);
    if (success) {
      this._showFeedback(t('sbloccatoMsg')(def.emoji, LocaleManager.name(def)), '#' + C.textGoldBright.toString(16).padStart(6, '0'));
      this.time.delayedCall(800, () => this.scene.restart());
    }
  }

  _showFeedback(msg, color) {
    const { width, height } = this.scale;
    const txt = this.add.text(width / 2, height / 2, msg, {
      fontFamily: FONT_UI,
      fontSize: '20px',
      color,
      fontStyle: '900',
      stroke: '#0a0c10',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(300).setAlpha(0);

    this.tweens.add({
      targets: txt,
      alpha: 1, y: height / 2 - 20,
      duration: 300, ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: txt, alpha: 0, duration: 500, delay: 400,
          onComplete: () => txt.destroy(),
        });
      },
    });
  }

  _go(key, data) {
    if (this._transitioning) return;
    this._transitioning = true;
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(key, data));
  }
}
