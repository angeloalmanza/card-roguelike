import Phaser from 'phaser';
import { SaveManager } from '../managers/SaveManager.js';
import { REWARD_CARDS } from '../data/cards.js';
import { RELICS } from '../data/relics.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider, CARD_COLORS } from '../ui/Theme.js';
import { LocaleManager } from '../managers/LocaleManager.js';

const T = {
  it: {
    title:       'GLOSSARIO',
    tabCarte:    'CARTE',
    tabReliquie: 'RELIQUIE',
    indietro:    'INDIETRO',
    scoperte:    (f, tot) => `${f} / ${tot} scoperte`,
    comuni:      'COMUNI',
    nonComuni:   'NON COMUNI',
    rare:        'RARE',
  },
  en: {
    title:       'GLOSSARY',
    tabCarte:    'CARDS',
    tabReliquie: 'RELICS',
    indietro:    'BACK',
    scoperte:    (f, tot) => `${f} / ${tot} discovered`,
    comuni:      'COMMON',
    nonComuni:   'UNCOMMON',
    rare:        'RARE',
  },
};

export class GlossaryScene extends Phaser.Scene {
  constructor() {
    super('Glossary');
  }

  create() {
    const { width, height } = this.scale;

    const lang = LocaleManager.getLang();
    this._t = k => (T[lang] || T.it)[k] ?? T.it[k];

    // Sfondo
    this.add.image(width / 2, height / 2, 'bg-secondary').setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.65);

    // Header panel
    drawPanel(this, width / 2, 40, width, 80, {
      radius: 0,
      fill: C.bgHeader,
      border: C.borderGold,
      borderWidth: 0,
    });

    // Linea dorata top
    this.add.rectangle(width / 2, 0, width, 3, C.borderGold).setOrigin(0.5, 0);

    // Titolo
    this.add.text(width / 2, 24, this._t('title'), {
      fontFamily: FONT_TITLE,
      fontSize: '32px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 4,
    }).setOrigin(0.5).setDepth(55);


    this.collection = SaveManager.getCollection();
    this.currentTab = 'cards';

    // Scrollable container
    this.contentContainer = this.add.container(0, 0);
    this.scrollY  = 0;
    this.maxScrollY = 0;

    this.createTabs();
    this.buildCards();

    // Fixed bottom bar con bottone INDIETRO
    const barH = 60;
    drawPanel(this, width / 2, height - barH / 2, width, barH, {
      radius: 0,
      fill: C.bg,
      border: C.borderSubtle,
      borderWidth: 0,
      depth: 50,
    });
    // linea sopra il footer
    const footerLine = this.add.graphics().setDepth(50);
    footerLine.lineStyle(1, C.borderSubtle, 0.6);
    footerLine.lineBetween(0, height - barH, width, height - barH);

    createButton(this, width / 2, height - barH / 2, 200, 40, this._t('indietro'), {
      fill: C.bgPanel,
      hover: C.btnHover,
      border: C.borderGold,
      borderWidth: 2,
      radius: 8,
      fontSize: '14px',
      font: FONT_UI,
      textColor: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      letterSpacing: 2,
      depth: 51,
      onClick: () => this.scene.start('MainMenu'),
    });

    // Top bar per coprire lo scroll
    const topBar = this.add.graphics().setDepth(49);
    topBar.fillStyle(C.bgHeader, 1);
    topBar.fillRect(0, 0, width, 65);

    // Scroll con rotellina
    this.input.on('wheel', (pointer, gos, dx, dy) => {
      this.scrollY = Phaser.Math.Clamp(this.scrollY + dy * 0.5, 0, this.maxScrollY);
      this.contentContainer.y = -this.scrollY;
    });
  }

  createTabs() {
    const { width } = this.scale;
    const tabY = 58;
    const tabW = 200;
    const tabH = 34;

    // Tab Carte
    const tabCardG = this.add.graphics().setDepth(50).setInteractive(
      new Phaser.Geom.Rectangle(width / 2 - 115 - tabW / 2, tabY - tabH / 2, tabW, tabH),
      Phaser.Geom.Rectangle.Contains
    );
    this.tabCardsText = this.add.text(width / 2 - 115, tabY, this._t('tabCarte'), {
      fontFamily: FONT_UI,
      fontSize: '14px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      fontStyle: '700',
      letterSpacing: 2,
    }).setOrigin(0.5).setDepth(51);

    // Tab Reliquie
    const tabRelicG = this.add.graphics().setDepth(50).setInteractive(
      new Phaser.Geom.Rectangle(width / 2 + 115 - tabW / 2, tabY - tabH / 2, tabW, tabH),
      Phaser.Geom.Rectangle.Contains
    );
    this.tabRelicsText = this.add.text(width / 2 + 115, tabY, this._t('tabReliquie'), {
      fontFamily: FONT_UI,
      fontSize: '14px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      fontStyle: '700',
      letterSpacing: 2,
    }).setOrigin(0.5).setDepth(51);

    this.tabCardG  = tabCardG;
    this.tabRelicG = tabRelicG;

    const drawTabStyle = (g, x, active) => {
      g.clear();
      g.fillStyle(active ? C.bgPanel : C.bgPanelDark, 1);
      g.fillRoundedRect(x - tabW / 2, tabY - tabH / 2, tabW, tabH, { tl: 8, tr: 8, bl: 0, br: 0 });
      g.lineStyle(active ? 2 : 1, active ? C.borderGold : C.borderSubtle, 1);
      g.strokeRoundedRect(x - tabW / 2, tabY - tabH / 2, tabW, tabH, { tl: 8, tr: 8, bl: 0, br: 0 });
    };

    this._drawTabCard  = () => drawTabStyle(tabCardG,  width / 2 - 115, this.currentTab === 'cards');
    this._drawTabRelic = () => drawTabStyle(tabRelicG, width / 2 + 115, this.currentTab === 'relics');

    this._drawTabCard();
    this._drawTabRelic();

    tabCardG.on('pointerdown', () => {
      if (this.currentTab === 'cards') return;
      this.currentTab = 'cards';
      this.scrollY = 0;
      this.contentContainer.y = 0;
      this.updateTabStyle();
      this.rebuildContent();
    });

    tabRelicG.on('pointerdown', () => {
      if (this.currentTab === 'relics') return;
      this.currentTab = 'relics';
      this.scrollY = 0;
      this.contentContainer.y = 0;
      this.updateTabStyle();
      this.rebuildContent();
    });
  }

  updateTabStyle() {
    this._drawTabCard();
    this._drawTabRelic();
    const goldBright = '#' + C.textGoldBright.toString(16).padStart(6, '0');
    const secondary  = '#' + C.textSecondary.toString(16).padStart(6, '0');
    if (this.currentTab === 'cards') {
      this.tabCardsText.setColor(goldBright);
      this.tabRelicsText.setColor(secondary);
    } else {
      this.tabRelicsText.setColor(goldBright);
      this.tabCardsText.setColor(secondary);
    }
  }

  rebuildContent() {
    this.contentContainer.removeAll(true);
    if (this.currentTab === 'cards') {
      this.buildCards();
    } else {
      this.buildRelics();
    }
  }

  buildCards() {
    const { width, height } = this.scale;
    const allCards   = this.getAllCards();
    const discovered = this.collection.cards;

    const startY  = 80;
    const cols    = 4;
    const cardW   = 280;
    const cardH   = 72;
    const padX    = 14;
    const padY    = 10;
    const totalW  = cols * cardW + (cols - 1) * padX;
    const originX = (width - totalW) / 2;

    const rarityOrder = { common: 0, uncommon: 1, rare: 2 };
    const sorted = [...allCards].sort((a, b) => {
      const ra = rarityOrder[a.rarity] ?? 0;
      const rb = rarityOrder[b.rarity] ?? 0;
      if (ra !== rb) return ra - rb;
      const to = { attack: 0, defend: 1, skill: 2 };
      return (to[a.type] || 0) - (to[b.type] || 0);
    });

    // Counter
    const total = allCards.length;
    const found  = allCards.filter(c => discovered.includes(c.name)).length;
    this.contentContainer.add(
      this.add.text(width / 2, startY, this._t('scoperte')(found, total), {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0.5)
    );

    const rarityLabels = { common: this._t('comuni'), uncommon: this._t('nonComuni'), rare: this._t('rare') };
    const rarityColors = {
      common:   '#' + C.textSecondary.toString(16).padStart(6, '0'),
      uncommon: '#' + C.textGold.toString(16).padStart(6, '0'),
      rare:     '#' + C.hp.toString(16).padStart(6, '0'),
    };

    let lastRarity  = null;
    let row = 0;
    let col = 0;
    const sectionStartY = startY + 24;

    sorted.forEach((card) => {
      if (card.rarity !== lastRarity) {
        if (col > 0) { row++; col = 0; }
        lastRarity = card.rarity;
        const labelY = sectionStartY + row * (cardH + padY);
        this.contentContainer.add(
          this.add.text(originX, labelY, rarityLabels[card.rarity] || '', {
            fontFamily: FONT_TITLE,
            fontSize: '11px',
            color: rarityColors[card.rarity] || '#' + C.textSecondary.toString(16).padStart(6, '0'),
            letterSpacing: 2,
          })
        );
        row++;
        col = 0;
      }

      const x = originX + col * (cardW + padX);
      const y = sectionStartY + row * (cardH + padY);

      this.addCardEntry(x, y, cardW, cardH, card, discovered.includes(card.name));

      col++;
      if (col >= cols) { col = 0; row++; }
    });

    const lastY = sectionStartY + (row + 1) * (cardH + padY);
    this.maxScrollY = Math.max(0, lastY - height + 70);
  }

  addCardEntry(x, y, w, h, card, unlocked) {
    const cardColors  = CARD_COLORS[card.type] || CARD_COLORS.curse;
    const borderColor = unlocked ? cardColors.border : C.borderSubtle;
    const bgColor     = unlocked ? C.bgPanel : C.bgPanelDark;
    const alpha       = unlocked ? 1 : 0.4;

    // Pannello riga carta
    const g = this.add.graphics().setAlpha(alpha);
    g.fillStyle(bgColor, 1);
    g.fillRoundedRect(x, y, w, h, 8);
    g.lineStyle(1, borderColor, 1);
    g.strokeRoundedRect(x, y, w, h, 8);
    // Banda sinistra colorata per tipo
    if (unlocked) {
      g.fillStyle(cardColors.border, 0.4);
      g.fillRoundedRect(x, y, 4, h, { tl: 8, tr: 0, bl: 8, br: 0 });
    }
    this.contentContainer.add(g);

    if (!unlocked) {
      this.contentContainer.add(
        this.add.text(x + w / 2, y + h / 2, '?', {
          fontFamily: FONT_TITLE,
          fontSize: '24px',
          color: '#' + C.borderSubtle.toString(16).padStart(6, '0'),
          fontStyle: '700',
        }).setOrigin(0.5)
      );
      return;
    }

    // Cerchio costo
    const costX = x + 22;
    const costY = y + h / 2;
    const typeColorsHex = { attack: C.attack, defend: C.defend, skill: C.skill, curse: C.curse };
    const cg = this.add.graphics();
    cg.fillStyle(typeColorsHex[card.type] || C.curse, 0.25);
    cg.fillCircle(costX, costY, 14);
    cg.lineStyle(1, typeColorsHex[card.type] || C.curse, 0.8);
    cg.strokeCircle(costX, costY, 14);
    this.contentContainer.add(cg);

    this.contentContainer.add(
      this.add.text(costX, costY, String(card.cost), {
        fontFamily: FONT_TITLE,
        fontSize: '13px',
        color: '#ffffff',
        fontStyle: '700',
      }).setOrigin(0.5)
    );

    // Nome
    const nameText = this.add.text(x + 44, y + 14, LocaleManager.name(card), {
      fontFamily: FONT_TITLE,
      fontSize: '13px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: '700',
    });
    this.contentContainer.add(nameText);

    // Dot rarità
    const dotColors = {
      common:   '#' + C.textSecondary.toString(16).padStart(6, '0'),
      uncommon: '#' + C.textGold.toString(16).padStart(6, '0'),
      rare:     '#' + C.hp.toString(16).padStart(6, '0'),
    };
    this.contentContainer.add(
      this.add.text(x + 44 + nameText.width + 8, y + 15, '\u25CF', {
        fontFamily: FONT_BODY,
        fontSize: '9px',
        color: dotColors[card.rarity] || '#' + C.textSecondary.toString(16).padStart(6, '0'),
      })
    );

    // Descrizione
    this.contentContainer.add(
      this.add.text(x + 44, y + 34, LocaleManager.desc(card).replace(/\n/g, ' '), {
        fontFamily: FONT_BODY,
        fontSize: '10px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        wordWrap: { width: w - 55 },
      })
    );

    // Valore
    if (card.value > 0) {
      this.contentContainer.add(
        this.add.text(x + w - 12, y + h / 2, String(card.value), {
          fontFamily: FONT_UI,
          fontSize: '16px',
          color: cardColors.text,
          fontStyle: '700',
        }).setOrigin(1, 0.5)
      );
    }
  }

  buildRelics() {
    const { width, height } = this.scale;
    const allRelics  = Object.values(RELICS);
    const discovered = this.collection.relics;

    const startY  = 80;
    const cols    = 3;
    const relicW  = 380;
    const relicH  = 68;
    const padX    = 14;
    const padY    = 10;
    const totalW  = cols * relicW + (cols - 1) * padX;
    const originX = (width - totalW) / 2;

    const rarityOrder = { common: 0, uncommon: 1, rare: 2 };
    const sorted = [...allRelics].sort((a, b) => {
      return (rarityOrder[a.rarity] ?? 0) - (rarityOrder[b.rarity] ?? 0);
    });

    // Counter
    const total = allRelics.length;
    const found  = allRelics.filter(r => discovered.includes(r.id)).length;
    this.contentContainer.add(
      this.add.text(width / 2, startY, this._t('scoperte')(found, total), {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0.5)
    );

    const rarityLabels = { common: this._t('comuni'), uncommon: this._t('nonComuni'), rare: this._t('rare') };
    const rarityColors = {
      common:   '#' + C.textSecondary.toString(16).padStart(6, '0'),
      uncommon: '#' + C.textGold.toString(16).padStart(6, '0'),
      rare:     '#' + C.hp.toString(16).padStart(6, '0'),
    };

    let lastRarity  = null;
    let row = 0;
    let col = 0;
    const sectionStartY = startY + 24;

    sorted.forEach((relic) => {
      if (relic.rarity !== lastRarity) {
        if (col > 0) { row++; col = 0; }
        lastRarity = relic.rarity;
        const labelY = sectionStartY + row * (relicH + padY);
        this.contentContainer.add(
          this.add.text(originX, labelY, rarityLabels[relic.rarity] || '', {
            fontFamily: FONT_TITLE,
            fontSize: '11px',
            color: rarityColors[relic.rarity] || '#' + C.textSecondary.toString(16).padStart(6, '0'),
            letterSpacing: 2,
          })
        );
        row++;
        col = 0;
      }

      const x = originX + col * (relicW + padX);
      const y = sectionStartY + row * (relicH + padY);

      this.addRelicEntry(x, y, relicW, relicH, relic, discovered.includes(relic.id));

      col++;
      if (col >= cols) { col = 0; row++; }
    });

    const lastY = sectionStartY + (row + 1) * (relicH + padY);
    this.maxScrollY = Math.max(0, lastY - height + 70);
  }

  addRelicEntry(x, y, w, h, relic, unlocked) {
    const rarityBorders = {
      common:   C.borderSubtle,
      uncommon: C.borderGold,
      rare:     C.hp,
    };
    const borderColor = unlocked ? (rarityBorders[relic.rarity] || C.borderSubtle) : C.borderSubtle;
    const bgColor     = unlocked ? C.bgPanel : C.bgPanelDark;
    const alpha       = unlocked ? 1 : 0.4;

    const g = this.add.graphics().setAlpha(alpha);
    g.fillStyle(bgColor, 1);
    g.fillRoundedRect(x, y, w, h, 8);
    g.lineStyle(1, borderColor, 1);
    g.strokeRoundedRect(x, y, w, h, 8);
    this.contentContainer.add(g);

    if (!unlocked) {
      this.contentContainer.add(
        this.add.text(x + w / 2, y + h / 2, '?', {
          fontFamily: FONT_TITLE,
          fontSize: '24px',
          color: '#' + C.borderSubtle.toString(16).padStart(6, '0'),
          fontStyle: '700',
        }).setOrigin(0.5)
      );
      return;
    }

    this.contentContainer.add(
      this.add.text(x + 28, y + h / 2, relic.emoji, { fontSize: '24px' }).setOrigin(0.5)
    );

    this.contentContainer.add(
      this.add.text(x + 56, y + 16, LocaleManager.name(relic), {
        fontFamily: FONT_TITLE,
        fontSize: '14px',
        color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
        fontStyle: '700',
      })
    );

    this.contentContainer.add(
      this.add.text(x + 56, y + 38, LocaleManager.desc(relic), {
        fontFamily: FONT_BODY,
        fontSize: '11px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        wordWrap: { width: w - 70 },
      })
    );
  }

  getAllCards() {
    const all = [];
    for (const rarity of ['common', 'uncommon', 'rare']) {
      const cards = REWARD_CARDS[rarity];
      if (cards) {
        cards.forEach(c => all.push({ ...c, rarity }));
      }
    }
    return all;
  }
}
