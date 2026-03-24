import Phaser from 'phaser';
import { STARTER_DECK, generateRewardCards } from '../data/cards.js';
import { RELICS, generateRelic } from '../data/relics.js';
import { CLASSES } from '../data/classes.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AchievementManager } from '../managers/AchievementManager.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider, CARD_COLORS } from '../ui/Theme.js';

/**
 * RewardScene — Schermata ricompensa post-combattimento.
 */
export class RewardScene extends Phaser.Scene {
  constructor() {
    super('Reward');
  }

  init(data) {
    this.runData = data.runData;
    this.nodeType = data.nodeType || 'combat';
    this.goldReward = data.goldReward || 0;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(350, 0, 0, 0);

    // Sfondo
    this.add.rectangle(width / 2, height / 2, width, height, C.bg);

    // Header panel
    drawPanel(this, width / 2, 44, width, 88, {
      radius: 0,
      fill: C.bgHeader,
      border: C.borderGold,
      borderWidth: 0,
    });

    // Linea dorata top
    this.add.rectangle(width / 2, 0, width, 3, C.borderGold).setOrigin(0.5, 0);

    // Titolo
    this.add.text(width / 2, 26, 'RICOMPENSA', {
      fontFamily: FONT_TITLE,
      fontSize: '36px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 4,
    }).setOrigin(0.5);

    // Linea divisoria sotto titolo
    drawDivider(this, width / 2, 52, 400, { color: C.borderGold, alpha: 0.6 });

    // Oro panel
    this._buildGoldPanel(width);

    let relicAreaHeight = 0;
    if (this.nodeType === 'elite' || this.nodeType === 'boss') {
      relicAreaHeight = this.createRelicReward();
    }

    const cardAreaY = 110 + relicAreaHeight;
    this.add.text(width / 2, cardAreaY, 'Scegli una carta da aggiungere al mazzo:', {
      fontFamily: FONT_UI,
      fontSize: '14px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      letterSpacing: 1,
    }).setOrigin(0.5);

    const rewardCards = generateRewardCards(3, this.nodeType);
    this.createCardChoices(rewardCards, cardAreaY + 30);

    // Bottone "Salta" — in basso a destra
    createButton(this, width - 120, height - 36, 180, 40, 'SALTA CARTA', {
      fill: C.bgPanelDark,
      hover: C.bgPanel,
      border: C.borderSubtle,
      borderWidth: 1,
      radius: 8,
      fontSize: '13px',
      font: FONT_UI,
      textColor: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      letterSpacing: 2,
      depth: 5,
      onClick: () => this.goToMap(),
    });

    // Deck info
    const deckSize = this.runData.deckCards ? this.runData.deckCards.length : 10;
    this.add.text(width / 2, height - 14, `Mazzo attuale: ${deckSize} carte`, {
      fontFamily: FONT_BODY,
      fontSize: '11px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);
  }

  _buildGoldPanel(width) {
    const goldHex = '#' + C.textGold.toString(16).padStart(6, '0');
    drawPanel(this, width / 2, 76, 220, 32, {
      radius: 8,
      fill: C.bgPanel,
      border: C.borderGoldDim,
      borderWidth: 1,
    });
    this.add.text(width / 2, 76, `💰  +${this.goldReward} oro`, {
      fontFamily: FONT_TITLE,
      fontSize: '15px',
      color: goldHex,
    }).setOrigin(0.5);
  }

  createRelicReward() {
    const { width } = this.scale;
    const y = 118;

    const ownedIds = (this.runData.relics || []).map(r => r.id);

    // 30% chance to offer a class-exclusive relic if available
    let relic = null;
    const classId = this.runData.classId;
    const classData = classId ? CLASSES.find(c => c.id === classId) : null;
    if (classData && classData.classRelicIds && Math.random() < 0.30) {
      const available = classData.classRelicIds
        .map(id => RELICS[id])
        .filter(r => r && !ownedIds.includes(r.id));
      if (available.length > 0) {
        relic = available[Math.floor(Math.random() * available.length)];
      }
    }

    if (!relic) {
      let attempts = 0;
      do {
        relic = generateRelic(this.nodeType);
        attempts++;
      } while (ownedIds.includes(relic.id) && attempts < 20);
    }

    const boxW = 440;
    const boxH = 72;

    drawPanel(this, width / 2, y, boxW, boxH, {
      radius: 12,
      fill: C.bgPanel,
      border: C.borderGold,
      borderWidth: 2,
    });

    // Emoji reliquia
    this.add.text(width / 2 - boxW / 2 + 42, y, relic.emoji, {
      fontSize: '28px',
    }).setOrigin(0.5);

    // Nome
    this.add.text(width / 2 - boxW / 2 + 90, y - 14, `Reliquia: ${relic.name}`, {
      fontFamily: FONT_TITLE,
      fontSize: '14px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
    }).setOrigin(0, 0.5);

    // Descrizione
    this.add.text(width / 2 - boxW / 2 + 90, y + 10, relic.description, {
      fontFamily: FONT_BODY,
      fontSize: '11px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      wordWrap: { width: boxW - 110 },
    }).setOrigin(0, 0.5);

    if (!this.runData.relics) this.runData.relics = [];
    if (!ownedIds.includes(relic.id)) {
      this.runData.relics.push(relic);
      SaveManager.trackRelic(relic.id);
      const unlockedRelic = AchievementManager.check({ type: 'relic_pickup' });
      if (unlockedRelic && unlockedRelic.length > 0) {
        const { width, height } = this.scale;
        unlockedRelic.forEach((ach, i) => {
          const t = this.add.text(width / 2, height - 60 - i * 30, `🏆 ${ach.name}`, {
            fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', color: '#f0d880', fontStyle: '700'
          }).setOrigin(0.5).setDepth(200).setAlpha(0);
          this.tweens.add({ targets: t, alpha: 1, duration: 300, yoyo: true, hold: 2000,
            onComplete: () => t.destroy() });
        });
      }
      try { if (this.cache.audio.exists('relic-pickup')) this.sound.play('relic-pickup', { volume: 0.6 }); } catch(e) {}

      if (relic.trigger === 'onPickup') {
        if (relic.effect.maxHp) {
          this.runData.maxHp += relic.effect.maxHp;
        }
        if (relic.effect.heal) {
          this.runData.playerHp = Math.min(
            this.runData.maxHp,
            this.runData.playerHp + relic.effect.heal
          );
        }
      }
    }

    return 95;
  }

  createCardChoices(rewardCards, startY) {
    const { width } = this.scale;

    const rarityStyles = {
      common:   { border: 0x8c8c96, label: 'COMUNE',      textColor: '#8c8c96' },
      uncommon: { border: 0x5b9bd5, label: 'NON COMUNE',  textColor: '#7bb5e8' },
      rare:     { border: 0xe8b84b, label: 'RARA',         textColor: '#e8b84b' },
    };

    const cardWidth  = 175;
    const cardHeight = 250;
    const spacing    = 215;
    const cardsStartX = width / 2 - spacing;
    const cardY = startY + cardHeight / 2 + 10;

    rewardCards.forEach((card, i) => {
      const x = cardsStartX + i * spacing;
      const rarity = rarityStyles[card.rarity];
      const cardColors = CARD_COLORS[card.type] || CARD_COLORS.curse;

      // Container per animazione stagger
      const container = this.add.container(x, cardY + 30).setAlpha(0);

      // Pannello carta disegnato come Graphics locale (coord relative al container)
      const panelG = this.add.graphics();
      panelG.fillStyle(0x000000, 0.35);
      panelG.fillRoundedRect(-cardWidth / 2 + 3, -cardHeight / 2 + 4, cardWidth, cardHeight, 12);
      panelG.fillStyle(cardColors.bg, 1);
      panelG.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);
      panelG.lineStyle(2, cardColors.border, 1);
      panelG.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);

      // Rect invisibile interattivo
      const cardHit = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x000000, 0)
        .setInteractive({ useHandCursor: true });

      // Banda colorata superiore
      const bandG = this.add.graphics();
      bandG.fillStyle(cardColors.border, 0.25);
      bandG.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, 34, { tl: 12, tr: 12, bl: 0, br: 0 });

      // Rarità label
      const rarityText = this.add.text(0, -cardHeight / 2 + 11, rarity.label, {
        fontFamily: FONT_UI,
        fontSize: '9px',
        color: rarity.textColor,
        fontStyle: '700',
        letterSpacing: 1,
      }).setOrigin(0.5);

      // Icona tipo
      const iconKey = `icon-${card.type}`;
      const iconImg = this.add.image(0, -72, iconKey).setScale(1.2);

      // Cerchio costo
      const typeColorsHex = { attack: C.attack, defend: C.defend, skill: C.skill, curse: C.curse };
      const costCircle = this.add.graphics();
      costCircle.fillStyle(typeColorsHex[card.type] || C.curse, 0.9);
      costCircle.fillCircle(-cardWidth / 2 + 20, -cardHeight / 2 + 20, 16);

      const costText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 20, String(card.cost), {
        fontFamily: FONT_TITLE,
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: '700',
      }).setOrigin(0.5);

      // Nome carta
      const nameText = this.add.text(0, -35, card.name, {
        fontFamily: FONT_TITLE,
        fontSize: '13px',
        color: cardColors.text,
        fontStyle: '700',
      }).setOrigin(0.5);

      // Valore grande
      const valueText = this.add.text(0, -8, String(card.value), {
        fontFamily: FONT_UI,
        fontSize: '28px',
        color: cardColors.text,
        fontStyle: '700',
      }).setOrigin(0.5);

      // Descrizione
      const descText = this.add.text(0, 44, card.description, {
        fontFamily: FONT_BODY,
        fontSize: '9px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        align: 'center',
        wordWrap: { width: cardWidth - 20 },
      }).setOrigin(0.5);

      // panelG va in fondo allo stack del container (primo elemento)
      container.add([panelG, bandG, cardHit, rarityText, iconImg, costCircle, costText, nameText, valueText, descText]);

      // Animazione stagger — tutto dentro container
      this.tweens.add({
        targets: container,
        y: cardY,
        alpha: 1,
        duration: 300,
        ease: 'Back.easeOut',
        delay: i * 100,
      });

      // Hover: scala sull'intero container + bordo bright sovrapposto
      const hoverG = this.add.graphics().setDepth(10);
      const drawHoverBorder = (active, cx, cy) => {
        hoverG.clear();
        if (active) {
          hoverG.lineStyle(3, C.borderBright, 1);
          hoverG.strokeRoundedRect(cx - cardWidth / 2, cy - cardHeight / 2, cardWidth, cardHeight, 12);
        }
      };

      cardHit.on('pointerover', () => {
        this.tweens.add({ targets: container, scaleX: 1.05, scaleY: 1.05, duration: 120, ease: 'Sine.easeOut' });
        drawHoverBorder(true, container.x, container.y);
      });
      cardHit.on('pointerout', () => {
        this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 120, ease: 'Sine.easeOut' });
        drawHoverBorder(false, container.x, container.y);
      });

      cardHit.on('pointerdown', () => this.chooseCard(card));
    });
  }

  chooseCard(card) {
    if (!this.runData.deckCards) {
      this.runData.deckCards = [...STARTER_DECK];
    }
    const { rarity, price, ...cardData } = card;
    this.runData.deckCards.push(cardData);
    SaveManager.trackCard(card.name);
    const unlocked = AchievementManager.check({ type: 'deck_size', deckSize: this.runData.deckCards.length });
    if (unlocked && unlocked.length > 0) {
      const { width, height } = this.scale;
      unlocked.forEach((ach, i) => {
        const t = this.add.text(width / 2, height - 60 - i * 30, `🏆 ${ach.name}`, {
          fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', color: '#f0d880', fontStyle: '700'
        }).setOrigin(0.5).setDepth(200).setAlpha(0);
        this.tweens.add({ targets: t, alpha: 1, duration: 300, yoyo: true, hold: 2000,
          onComplete: () => t.destroy() });
      });
    }
    this.goToMap();
  }

  goToMap() {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () =>
      this.scene.start('Map', { runData: this.runData })
    );
  }
}
