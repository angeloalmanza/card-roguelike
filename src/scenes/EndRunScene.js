import Phaser from 'phaser';
import { SaveManager } from '../managers/SaveManager.js';
import { CLASSES, CLASS_EMOJIS } from '../data/classes.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider, CARD_COLORS } from '../ui/Theme.js';

const TYPE_COLORS = {
  attack: '#e85d5d',
  defend: '#5d9fe8',
  skill:  '#c05de8',
  power:  '#e8b84b',
};

export class EndRunScene extends Phaser.Scene {
  constructor() {
    super('EndRun');
  }

  init(data) {
    this.runData = data.runData || {};
    this.result  = data.result  || 'defeat';
    this.stats   = data.stats   || {
      damageDealt:          0,
      damageTaken:          0,
      cardsPlayed:          0,
      enemiesKilled:        0,
      goldEarned:           0,
      turnsPlayed:          0,
      achievementsUnlocked: [],
    };
  }

  create() {
    const W = this.scale.width;   // 1280
    const H = this.scale.height;  // 720

    const isVictory = this.result === 'victory';

    // Sfondo
    this.add.rectangle(W / 2, H / 2, W, H, C.bg);

    // ----------------------------------------------------------------
    // HEADER BANNER
    // ----------------------------------------------------------------
    const bannerFill   = isVictory ? C.btnSuccess    : C.btnDanger;
    const bannerBorder = isVictory ? C.borderGold    : C.hp;
    const bannerText   = isVictory ? C.textGoldBright : C.hp;

    const bannerG = drawPanel(this, W / 2, 65, W - 40, 110, {
      radius: 12,
      fill: bannerFill,
      border: bannerBorder,
      borderWidth: 2,
      depth: 1,
    });
    bannerG.setAlpha(0);

    const resultText = this.add.text(W / 2, 52,
      isVictory ? '🏆 VITTORIA!' : '💀 SCONFITTA',
      {
        fontFamily: FONT_TITLE,
        fontSize: '52px',
        color: '#' + bannerText.toString(16).padStart(6, '0'),
        letterSpacing: 4,
      }
    ).setOrigin(0.5).setAlpha(0).setDepth(2);

    const floorNum = (this.runData.currentFloor != null ? this.runData.currentFloor : -1) + 1;
    const subText = this.add.text(W / 2, 100,
      `Run completata — Piano ${floorNum}`,
      {
        fontFamily: FONT_UI,
        fontSize: '14px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        letterSpacing: 1,
      }
    ).setOrigin(0.5).setAlpha(0).setDepth(2);

    // ----------------------------------------------------------------
    // COLONNA SINISTRA — Statistiche run
    // ----------------------------------------------------------------
    const LX         = 200;
    const statsStartY = 150;

    const leftContainer = this.add.container(0, 0).setAlpha(0);

    // Pannello colonna sinistra
    const leftPanelG = drawPanel(this, LX + 160, statsStartY + 165, 360, 360, {
      radius: 12,
      fill: C.bgPanel,
      border: C.borderSubtle,
      borderWidth: 1,
      depth: 1,
    });
    leftPanelG.setAlpha(0);

    const statsTitle = this.add.text(LX, statsStartY, 'STATISTICHE', {
      fontFamily: FONT_TITLE,
      fontSize: '13px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      letterSpacing: 3,
    }).setOrigin(0, 0.5);
    leftContainer.add(statsTitle);

    drawDivider(this, LX + 160, statsStartY + 14, 340, { color: C.borderGold, alpha: 0.3, depth: 2 });

    // Dati classe
    const classData   = CLASSES.find(c => c.id === this.runData.classId) || CLASSES[0];
    const classEmoji  = CLASS_EMOJIS[this.runData.classId] || '⚔️';
    const relicsCount = (this.runData.relics || []).length;
    const deckCount   = (this.runData.deckCards || []).length;

    const statRows = [
      { label: 'Classe',           value: `${classEmoji} ${classData.name}` },
      { label: 'HP finale',        value: `${this.runData.playerHp || 0} / ${this.runData.maxHp || classData.maxHp}` },
      { label: 'Piano raggiunto',  value: `${floorNum}` },
      { label: 'Reliquie raccolte',value: `${relicsCount}` },
      { label: 'Carte nel mazzo',  value: `${deckCount}` },
      null, // separatore
      { label: 'Danno inflitto',   value: `${this.stats.damageDealt}` },
      { label: 'Danno subito',     value: `${this.stats.damageTaken}` },
      { label: 'Carte giocate',    value: `${this.stats.cardsPlayed}` },
      { label: 'Nemici uccisi',    value: `${this.stats.enemiesKilled}` },
      { label: 'Turni giocati',    value: `${this.stats.turnsPlayed}` },
    ];

    let rowY = statsStartY + 26;
    statRows.forEach((row, idx) => {
      if (row === null) {
        const sep = this.add.rectangle(LX + 160, rowY + 4, 320, 1, C.borderSubtle);
        leftContainer.add(sep);
        rowY += 14;
        return;
      }
      const rowH = 30;

      // Riga alternata
      if (idx % 2 === 0) {
        const rowBg = this.add.graphics();
        rowBg.fillStyle(0xffffff, 0.02);
        rowBg.fillRect(LX - 8, rowY - rowH / 2, 340, rowH);
        leftContainer.add(rowBg);
      }

      const labelTxt = this.add.text(LX, rowY, row.label, {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0, 0.5);

      const valueTxt = this.add.text(LX + 320, rowY, row.value, {
        fontFamily: FONT_UI,
        fontSize: '14px',
        color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
        fontStyle: '700',
      }).setOrigin(1, 0.5);

      leftContainer.add([labelTxt, valueTxt]);
      rowY += rowH;
    });

    // ----------------------------------------------------------------
    // COLONNA DESTRA — Mazzo finale
    // ----------------------------------------------------------------
    const RX = 900;
    const rightContainer = this.add.container(0, 0).setAlpha(0);

    // Pannello colonna destra
    const rightPanelG = drawPanel(this, RX + 125, statsStartY + 165, 310, 360, {
      radius: 12,
      fill: C.bgPanel,
      border: C.borderSubtle,
      borderWidth: 1,
      depth: 1,
    });
    rightPanelG.setAlpha(0);

    const deckTitle = this.add.text(RX, statsStartY, 'MAZZO FINALE', {
      fontFamily: FONT_TITLE,
      fontSize: '13px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      letterSpacing: 3,
    }).setOrigin(0, 0.5);
    rightContainer.add(deckTitle);

    drawDivider(this, RX + 125, statsStartY + 14, 290, { color: C.borderGold, alpha: 0.3, depth: 2 });

    const isEndless = !!(this.runData.flags && this.runData.flags.endless);

    if (isEndless) {
      const endlessN = this.runData.flags.endlessCount || 1;
      const endlessTxt = this.add.text(RX, statsStartY + 28, `♾️  Endless x${endlessN}`, {
        fontFamily: FONT_UI,
        fontSize: '15px',
        color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
        fontStyle: '700',
      }).setOrigin(0, 0.5);
      rightContainer.add(endlessTxt);
    }

    const deckCards    = this.runData.deckCards || [];
    const displayCards = deckCards.slice(0, 10);
    let cardRowY = statsStartY + (isEndless ? 58 : 28);

    displayCards.forEach((card) => {
      const cardCC  = CARD_COLORS[card.type] || {};
      const typeStr = card.type ? card.type.toUpperCase() : '';

      const costTxt = this.add.text(RX, cardRowY, `[${card.cost}]`, {
        fontFamily: FONT_UI,
        fontSize: '12px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0, 0.5);

      const nameTxt = this.add.text(RX + 28, cardRowY, card.name || '?', {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      }).setOrigin(0, 0.5);

      const typeTxt = this.add.text(RX + 250, cardRowY, typeStr, {
        fontFamily: FONT_UI,
        fontSize: '11px',
        color: cardCC.text || TYPE_COLORS[card.type] || '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(1, 0.5);

      rightContainer.add([costTxt, nameTxt, typeTxt]);
      cardRowY += 27;
    });

    if (deckCards.length > 10) {
      const moreTxt = this.add.text(RX, cardRowY, `+ altre ${deckCards.length - 10} carte...`, {
        fontFamily: FONT_BODY,
        fontSize: '12px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0, 0.5);
      rightContainer.add(moreTxt);
    }

    if (deckCards.length === 0) {
      const emptyTxt = this.add.text(RX, statsStartY + 28, 'Mazzo vuoto', {
        fontFamily: FONT_BODY,
        fontSize: '13px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0, 0.5);
      rightContainer.add(emptyTxt);
    }

    // ----------------------------------------------------------------
    // ACHIEVEMENT SECTION — pill/badge dorati
    // ----------------------------------------------------------------
    const achieveContainer = this.add.container(0, 0).setAlpha(0);
    const achievements = this.stats.achievementsUnlocked || [];

    if (achievements.length > 0) {
      const achY = 530;
      drawDivider(this, W / 2, achY - 8, W - 100, { color: C.borderSubtle, alpha: 0.5 });

      const achLabel = this.add.text(60, achY + 8, '🏆 Achievement sbloccati:', {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: '#' + C.textGold.toString(16).padStart(6, '0'),
        fontStyle: '700',
      }).setOrigin(0, 0.5);
      achieveContainer.add(achLabel);

      // Pill/badge per ogni achievement
      let pillX = 220;
      const pillY = achY + 8;
      achievements.forEach((a) => {
        const achName = a.name || a;
        const pillW   = Math.max(achName.length * 8 + 24, 80);

        const pillG = this.add.graphics();
        pillG.fillStyle(C.bgPanel, 1);
        pillG.fillRoundedRect(pillX, pillY - 13, pillW, 26, 13);
        pillG.lineStyle(1, C.borderGold, 0.8);
        pillG.strokeRoundedRect(pillX, pillY - 13, pillW, 26, 13);
        achieveContainer.add(pillG);

        achieveContainer.add(
          this.add.text(pillX + pillW / 2, pillY, achName, {
            fontFamily: FONT_UI,
            fontSize: '11px',
            color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
            fontStyle: '700',
          }).setOrigin(0.5)
        );

        pillX += pillW + 10;
      });
    }

    // ----------------------------------------------------------------
    // FOOTER — Bottoni con createButton()
    // ----------------------------------------------------------------
    const footerY = 648;
    const footerContainer = this.add.container(0, 0).setAlpha(0);

    const menuBtnX = isVictory ? W / 2 - 145 : W / 2;
    const { bg: menuBg, txt: menuTxt } = createButton(
      this, menuBtnX, footerY, 240, 52, 'MENU PRINCIPALE', {
        fill: C.bgPanel,
        hover: C.btnHover,
        border: C.borderGold,
        borderWidth: 2,
        radius: 10,
        fontSize: '15px',
        font: FONT_UI,
        textColor: '#' + C.textPrimary.toString(16).padStart(6, '0'),
        letterSpacing: 2,
        depth: 5,
        onClick: () => {
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainMenu');
          });
        },
      }
    );
    footerContainer.add(menuBg);
    footerContainer.add(menuTxt);

    if (isVictory) {
      const { bg: newBg, txt: newTxt } = createButton(
        this, W / 2 + 145, footerY, 240, 52, 'NUOVA PARTITA', {
          fill: C.btnSuccess,
          hover: C.btnSuccessHov,
          border: C.poison,
          borderWidth: 2,
          radius: 10,
          fontSize: '15px',
          font: FONT_UI,
          textColor: '#' + C.poison.toString(16).padStart(6, '0'),
          letterSpacing: 2,
          depth: 5,
          onClick: () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
              this.scene.start('ClassSelection');
            });
          },
        }
      );
      footerContainer.add(newBg);
      footerContainer.add(newTxt);
    }

    // ----------------------------------------------------------------
    // ANIMAZIONI — Fade-in + slide-in sequenziale
    // ----------------------------------------------------------------
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Banner
    this.tweens.add({
      targets: [bannerG, resultText, subText],
      alpha: 1,
      duration: 400,
      delay: 100,
    });

    // Pannelli colonne
    this.tweens.add({
      targets: [leftPanelG, rightPanelG],
      alpha: 1,
      duration: 350,
      delay: 200,
    });

    // Colonna sinistra — slide in da sinistra
    leftContainer.setX(-60);
    this.tweens.add({
      targets: leftContainer,
      alpha: 1,
      x: 0,
      duration: 450,
      delay: 300,
      ease: 'Power2',
    });

    // Colonna destra — slide in da destra
    rightContainer.setX(60);
    this.tweens.add({
      targets: rightContainer,
      alpha: 1,
      x: 0,
      duration: 450,
      delay: 500,
      ease: 'Power2',
    });

    // Achievement
    this.tweens.add({
      targets: achieveContainer,
      alpha: 1,
      duration: 400,
      delay: 700,
    });

    // Footer
    this.tweens.add({
      targets: footerContainer,
      alpha: 1,
      duration: 400,
      delay: 900,
    });
  }
}
