import Phaser from 'phaser';
import { CLASSES } from '../data/classes.js';
import { RELICS, generateRelic } from '../data/relics.js';
import { REWARD_CARDS, CURSES } from '../data/cards.js';
import { SaveManager } from '../managers/SaveManager.js';
import { MapGenerator } from '../managers/MapGenerator.js';
import { PerkManager } from '../managers/PerkManager.js';
import { AscensionManager } from '../managers/AscensionManager.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';
import { LocaleManager } from '../managers/LocaleManager.js';

const T = {
  it: {
    header:            'SCEGLI LA TUA CLASSE',
    subheader:         'Ogni classe offre uno stile di gioco diverso',
    runNormale:        'Run Normale',
    indietro:          '← INDIETRO',
    mazzoIniziale:     'MAZZO INIZIALE',
    seleziona:         'SELEZIONA',
    vinciRun:          'Vinci una run per sbloccare nuove classi',
    vittorieTotali:    'Vittorie totali',
    vinciN:            (n) => `Vinci ${n} volt${n === 1 ? 'a' : 'e'}`,
    ascensione:        (lvl, desc) => `⚡ ASCENSIONE ${lvl}   ${desc}`,
    asc10:             'Boss con HP extra, 2 maledizioni, nessuna cura',
    asc9:              '2 Maledizioni iniziali, nessuna cura tra combattimenti',
    asc8:              '+6 danno nemici, nessuna cura tra combattimenti',
    asc7:              '+30% HP nemici, nessuna cura tra combattimenti',
    asc6:              'Nessun recupero HP tra combattimenti',
    asc5:              'Elite dal piano 3, shop più caro',
    asc4:              'Shop +25%, 1 Maledizione iniziale',
    asc3:              '1 Maledizione iniziale, nemici +2 danno',
    asc2:              'Nemici +10% HP, +2 danno',
    asc1:              'Nemici +10% HP',
  },
  en: {
    header:            'SELECT YOUR CLASS',
    subheader:         'Each class offers a different playstyle',
    runNormale:        'Normal Run',
    indietro:          '← BACK',
    mazzoIniziale:     'STARTER DECK',
    seleziona:         'SELECT',
    vinciRun:          'Win a run to unlock new classes',
    vittorieTotali:    'Total victories',
    vinciN:            (n) => `Win ${n} more time${n === 1 ? '' : 's'}`,
    ascensione:        (lvl, desc) => `⚡ ASCENSION ${lvl}   ${desc}`,
    asc10:             'Boss with extra HP, 2 curses, no healing',
    asc9:              '2 starting curses, no healing between combats',
    asc8:              '+6 enemy damage, no healing between combats',
    asc7:              '+30% enemy HP, no healing between combats',
    asc6:              'No HP recovery between combats',
    asc5:              'Elites from floor 3, shop costs more',
    asc4:              'Shop +25%, 1 starting curse',
    asc3:              '1 starting curse, enemies +2 damage',
    asc2:              'Enemies +10% HP, +2 damage',
    asc1:              'Enemies +10% HP',
  },
};

// Colori banda superiore per classe
const CLASS_BAND_COLORS = {
  warrior:   0x7a1a1a,
  rogue:     0x4a1a6a,
  alchemist: 0x1a4a2a,
};

export class ClassSelectionScene extends Phaser.Scene {
  constructor() {
    super('ClassSelection');
  }

  init(data) {
    this.challengeData = data && data.challengeData ? data.challengeData : null;
  }

  create() {
    const { width, height } = this.scale;
    this._transitioning = false;
    this.cameras.main.fadeIn(400, 0, 0, 0);
    const lang = LocaleManager.getLang();
    const t = k => (T[lang] || T.it)[k] ?? T.it[k];

    const victories = SaveManager.getStats().victories || 0;

    // ── Sfondo ────────────────────────────────────────────────────────────────
    this.add.rectangle(width / 2, height / 2, width, height, C.bg);

    const bgGlow = this.add.graphics();
    bgGlow.fillStyle(0x1a2040, 0.2);
    bgGlow.fillCircle(width / 2, height / 2, 380);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.4);
    vignette.fillRect(0, 0, width, height);
    vignette.fillStyle(C.bg, 1);
    vignette.fillCircle(width / 2, height / 2, Math.max(width, height) * 0.7);

    // Linea accent superiore
    this.add.rectangle(width / 2, 0, width, 2, C.borderGold).setOrigin(0.5, 0);

    // ── Header ────────────────────────────────────────────────────────────────
    this.add.text(width / 2, 42, t('header'), {
      fontFamily: FONT_TITLE,
      fontSize: '28px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 5,
    }).setOrigin(0.5);

    this.add.text(width / 2, 76, t('subheader'), {
      fontFamily: FONT_UI,
      fontSize: '13px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);

    // Ascensione
    const ascLevel = AscensionManager.getLevel();
    if (ascLevel === 0) {
      this.add.text(width / 2, 100, t('runNormale'), {
        fontFamily: FONT_UI, fontSize: '12px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        fontStyle: '700',
      }).setOrigin(0.5);
    } else {
      let modDesc = '';
      if (ascLevel >= 10) modDesc = t('asc10');
      else if (ascLevel >= 9) modDesc = t('asc9');
      else if (ascLevel >= 8) modDesc = t('asc8');
      else if (ascLevel >= 7) modDesc = t('asc7');
      else if (ascLevel >= 6) modDesc = t('asc6');
      else if (ascLevel >= 5) modDesc = t('asc5');
      else if (ascLevel >= 4) modDesc = t('asc4');
      else if (ascLevel >= 3) modDesc = t('asc3');
      else if (ascLevel >= 2) modDesc = t('asc2');
      else modDesc = t('asc1');

      this.add.text(width / 2, 100, t('ascensione')(ascLevel, modDesc), {
        fontFamily: FONT_UI, fontSize: '12px', color: '#e8681a', fontStyle: '700',
      }).setOrigin(0.5);
    }

    // Bottone indietro
    const backBtn = this.add.text(30, 42, t('indietro'), {
      fontFamily: FONT_UI, fontSize: '12px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'), fontStyle: '700',
    }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerover', () => backBtn.setColor('#' + C.textPrimary.toString(16).padStart(6, '0')));
    backBtn.on('pointerout',  () => backBtn.setColor('#' + C.textSecondary.toString(16).padStart(6, '0')));
    backBtn.on('pointerup',   () => this._go('MainMenu', {}));

    drawDivider(this, width / 2, 118, width - 80, { color: C.borderSubtle, alpha: 0.5 });

    // ── Cards classi ──────────────────────────────────────────────────────────
    const cardW = 220;
    const cardH = 360;
    const gap = 28;
    const totalW = cardW * 3 + gap * 2;
    const startX = (width - totalW) / 2 + cardW / 2;
    const cardY = height / 2 + 30;

    CLASSES.forEach((cls, i) => {
      const cx = startX + i * (cardW + gap);
      const unlocked = victories >= cls.unlockRequirement;
      this._drawClassCard(cx, cardY, cardW, cardH, cls, unlocked, victories, ascLevel, t);
    });

    // Footer
    drawDivider(this, width / 2, height - 42, width - 80, { color: C.borderSubtle, alpha: 0.4 });
    if (victories === 0) {
      this.add.text(width / 2, height - 24, t('vinciRun'), {
        fontFamily: FONT_BODY, fontSize: '11px',
        color: '#' + C.borderSubtle.toString(16).padStart(6, '0'),
      }).setOrigin(0.5);
    } else {
      this.add.text(width / 2, height - 24, `${t('vittorieTotali')}: ${victories}`, {
        fontFamily: FONT_BODY, fontSize: '11px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0.5);
    }
  }

  _drawClassCard(cx, cy, cw, ch, cls, unlocked, victories, ascLevel, t) {
    const bandH = 46;
    const bandColor = CLASS_BAND_COLORS[cls.id] || 0x1a1a2a;
    const topY = cy - ch / 2;

    // Pannello principale
    drawPanel(this, cx, cy, cw, ch, {
      radius: 14,
      fill: unlocked ? C.bgCard : C.bgPanelDark,
      border: unlocked ? C.borderGold : C.borderSubtle,
      borderWidth: unlocked ? 2 : 1,
    });

    // Banda colorata superiore
    const bandG = this.add.graphics();
    bandG.fillStyle(bandColor, 1);
    bandG.fillRoundedRect(cx - cw / 2, topY, cw, bandH, { tl: 14, tr: 14, bl: 0, br: 0 });

    // Emoji classe nella banda
    this.add.text(cx, topY + bandH / 2, cls.emoji, {
      fontSize: '28px',
    }).setOrigin(0.5);

    // Badge ascensione
    if (ascLevel > 0 && unlocked) {
      const badgeG = this.add.graphics();
      badgeG.fillStyle(C.rare, 1);
      badgeG.fillRoundedRect(cx + cw / 2 - 36, topY + 4, 32, 18, 4);
      this.add.text(cx + cw / 2 - 20, topY + 13, `A${ascLevel}`, {
        fontFamily: FONT_UI, fontSize: '10px', color: '#111', fontStyle: '700',
      }).setOrigin(0.5);
    }

    // Nome classe
    this.add.text(cx, topY + bandH + 18, LocaleManager.name(cls).toUpperCase(), {
      fontFamily: FONT_TITLE,
      fontSize: '16px',
      color: unlocked ? '#' + C.textGoldBright.toString(16).padStart(6, '0') : '#' + C.textSecondary.toString(16).padStart(6, '0'),
      letterSpacing: 2,
    }).setOrigin(0.5);

    // Separatore dorato
    drawDivider(this, cx, topY + bandH + 34, cw - 30, {
      color: unlocked ? C.borderGold : C.borderSubtle,
      alpha: unlocked ? 0.6 : 0.3,
    });

    // Stats HP + energia
    this.add.text(cx - 30, topY + bandH + 50, `❤️ ${cls.maxHp}`, {
      fontFamily: FONT_UI, fontSize: '12px',
      color: unlocked ? '#e87070' : '#' + C.borderSubtle.toString(16).padStart(6, '0'),
      fontStyle: '700',
    }).setOrigin(0.5);

    this.add.text(cx + 30, topY + bandH + 50, '⚡ 3', {
      fontFamily: FONT_UI, fontSize: '12px',
      color: unlocked ? '#6aaad9' : '#' + C.borderSubtle.toString(16).padStart(6, '0'),
      fontStyle: '700',
    }).setOrigin(0.5);

    // Reliquia
    const relic = RELICS[cls.starterRelicId];
    if (relic) {
      this.add.text(cx, topY + bandH + 70, `${relic.emoji} ${LocaleManager.name(relic)}`, {
        fontFamily: FONT_UI, fontSize: '11px',
        color: unlocked ? '#' + C.textGold.toString(16).padStart(6, '0') : '#' + C.borderSubtle.toString(16).padStart(6, '0'),
        fontStyle: '700',
      }).setOrigin(0.5);
    }

    // Separatore 2
    drawDivider(this, cx, topY + bandH + 86, cw - 30, {
      color: C.borderSubtle,
      alpha: unlocked ? 0.5 : 0.2,
    });

    // Mazzo label
    this.add.text(cx, topY + bandH + 100, t('mazzoIniziale'), {
      fontFamily: FONT_UI, fontSize: '9px',
      color: unlocked ? '#' + C.textSecondary.toString(16).padStart(6, '0') : '#333',
      letterSpacing: 2,
    }).setOrigin(0.5);

    // Lista carte
    const deckSummary = this._summarizeDeck(cls.starterDeck);
    const maxDeckLines = 6;
    deckSummary.slice(0, maxDeckLines).forEach((entry, idx) => {
      this.add.text(cx, topY + bandH + 116 + idx * 14, `• ${entry}`, {
        fontFamily: FONT_BODY, fontSize: '9px',
        color: unlocked ? '#' + C.textSecondary.toString(16).padStart(6, '0') : '#2a2a35',
        align: 'center',
      }).setOrigin(0.5);
    });

    // Footer SELEZIONA / lock
    if (!unlocked) {
      // Overlay scuro
      const lockG = this.add.graphics();
      lockG.fillStyle(0x000000, 0.6);
      lockG.fillRoundedRect(cx - cw / 2, cy - ch / 2, cw, ch, 14);

      this.add.text(cx, cy - 14, '🔒', { fontSize: '26px' }).setOrigin(0.5);
      const needed = cls.unlockRequirement - victories;
      this.add.text(cx, cy + 18, t('vinciN')(needed), {
        fontFamily: FONT_UI, fontSize: '12px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'), fontStyle: '700',
      }).setOrigin(0.5);
    } else {
      // Footer dorato
      drawDivider(this, cx, cy + ch / 2 - 32, cw - 20, {
        color: C.borderGold, alpha: 0.4,
      });

      this.add.text(cx, cy + ch / 2 - 18, t('seleziona'), {
        fontFamily: FONT_TITLE, fontSize: '11px',
        color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
        letterSpacing: 3,
      }).setOrigin(0.5);

      // Interattività con hover glow
      const hitArea = this.add.rectangle(cx, cy, cw, ch, 0xffffff, 0)
        .setInteractive({ useHandCursor: true });

      // Rettangolo glow per hover
      const glowG = this.add.graphics();
      glowG.setVisible(false);

      hitArea.on('pointerover', () => {
        glowG.clear();
        glowG.lineStyle(4, C.borderBright, 0.4);
        glowG.strokeRoundedRect(cx - cw / 2 - 4, cy - ch / 2 - 4, cw + 8, ch + 8, 16);
        glowG.setVisible(true);
      });
      hitArea.on('pointerout', () => {
        glowG.setVisible(false);
      });
      hitArea.on('pointerup', () => this._selectClass(cls));
    }
  }

  _summarizeDeck(deck) {
    const counts = {};
    deck.forEach(c => {
      const displayName = LocaleManager.name(c);
      counts[displayName] = (counts[displayName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, n]) => n > 1 ? `${name} ×${n}` : name);
  }

  _selectClass(cls) {
    if (this._transitioning) return;
    SaveManager.clearRun();

    const relic = RELICS[cls.starterRelicId];
    const runData = {
      classId: cls.id,
      playerHp: cls.maxHp,
      maxHp: cls.maxHp,
      gold: 0,
      deckCards: cls.starterDeck.map((c, i) => ({ ...c, id: i })),
      relics: relic ? [{ ...relic }] : [],
      potions: [],
      permanentStrength: 0,
      flags: {},
      relicStacks: {},
      map: MapGenerator.generate(15, 4),
      currentFloor: -1,
      currentCol: -1,
    };

    PerkManager.applyToRunData(runData, { rewardCards: REWARD_CARDS, generateRelic });

    const ascLevel = AscensionManager.getLevel();
    const mods = AscensionManager.getModifiers(ascLevel);
    runData.ascensionLevel = ascLevel;
    runData.ascensionMods = mods;

    if (mods.startCurses > 0) {
      for (let i = 0; i < mods.startCurses; i++) {
        const curse = CURSES[Math.floor(Math.random() * CURSES.length)];
        runData.deckCards.push({ ...curse, id: Date.now() + i + Math.random() });
      }
    }

    if (this.challengeData) {
      runData.challenge = this.challengeData;
      const f = this.challengeData.flags || {};

      if (f.halfHp) {
        runData.maxHp = Math.floor(runData.maxHp / 2);
        runData.playerHp = runData.maxHp;
      }

      if (f.startCursed) {
        for (let i = 0; i < 3; i++) {
          const curse = CURSES[Math.floor(Math.random() * CURSES.length)];
          runData.deckCards.push({ ...curse, id: Date.now() + i + Math.random() });
        }
      }
    }

    this._go('Map', { runData });
  }

  _go(key, data) {
    if (this._transitioning) return;
    this._transitioning = true;
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(key, data));
  }
}
