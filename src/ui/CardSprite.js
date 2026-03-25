import Phaser from 'phaser';
import { C, FONT_TITLE, FONT_UI, FONT_BODY } from './Theme.js';

/**
 * CardSprite — Carta visiva con asset layerati (Magic streak BG + Border + Banner + Textbox + Gem).
 */
export class CardSprite extends Phaser.GameObjects.Container {
  constructor(scene, x, y, cardData) {
    super(scene, x, y);

    this.cardData = cardData;
    this.originalX = x;
    this.originalY = y;
    this.originalRotation = 0;
    this.isHovered = false;
    this.handIndex = 0;
    this._playable = true;

    const isCurse = cardData.isCurse || false;
    const cardType = isCurse ? 'curse' : (cardData.type || 'attack');

    const W = 120;
    const H = 170;

    // ── Ombra ────────────────────────────────────────────────────────────
    const shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.45);
    shadow.fillRoundedRect(-W / 2 + 5, -H / 2 + 6, W, H, 12);
    this.add(shadow);

    // ── Background (Magic streak gradient) ───────────────────────────────
    const bg = scene.add.image(0, 0, `card-bg-${cardType}`)
      .setDisplaySize(W, H);
    this.add(bg);

    // ── Border frame overlay ──────────────────────────────────────────────
    const border = scene.add.image(0, 0, `card-border-${cardType}`)
      .setDisplaySize(W, H);
    this.add(border);

    // ── Banner (nome carta) ───────────────────────────────────────────────
    // Posizionato nel quarto superiore, sopra l'area arte/valore
    const bannerY = -H / 2 + 22;
    const banner = scene.add.image(0, bannerY, 'card-banner')
      .setDisplaySize(W - 16, 28);
    this.add(banner);

    // ── Nome carta ────────────────────────────────────────────────────────
    const nameText = scene.add.text(0, bannerY, cardData.name, {
      fontFamily: FONT_TITLE,
      fontSize: '10px',
      color: '#1a0a00',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: W - 30 },
    }).setOrigin(0.5);
    this.add(nameText);

    // ── Icona tipo (emoji, zona centrale) ────────────────────────────────
    const typeIcons = { attack: '⚔️', defend: '🛡️', skill: '✨', curse: '☠️' };
    const iconText = scene.add.text(0, -H / 2 + 60, typeIcons[cardType] || '✨', {
      fontSize: '22px',
    }).setOrigin(0.5);
    this.add(iconText);

    // ── Valore grande ─────────────────────────────────────────────────────
    const valueDisplay = isCurse ? '☠' : String(cardData.value);
    const valueText = scene.add.text(0, -H / 2 + 88, valueDisplay, {
      fontFamily: FONT_UI,
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add(valueText);

    // ── Text box (zona descrizione) ────────────────────────────────────────
    const textboxY = H / 2 - 44;
    const textbox = scene.add.image(0, textboxY, `card-textbox-${cardType}`)
      .setDisplaySize(W - 10, 56);
    this.add(textbox);

    // ── Descrizione ────────────────────────────────────────────────────────
    const descText = scene.add.text(0, textboxY - 2, cardData.description, {
      fontFamily: FONT_BODY,
      fontSize: '8px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: W - 24 },
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.add(descText);

    // ── Gem costo (top-left) ───────────────────────────────────────────────
    const gemX = -W / 2 + 16;
    const gemY = -H / 2 + 16;
    const gem = scene.add.image(gemX, gemY, `card-gem-${cardType}`)
      .setDisplaySize(28, 28);
    this.add(gem);

    const costText = scene.add.text(gemX, gemY, String(cardData.cost), {
      fontFamily: FONT_TITLE,
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add(costText);

    // ── Badge carta upgraded (✦ stella dorata top-right) ─────────────────
    if (cardData.upgraded) {
      const starBg = scene.add.graphics();
      starBg.fillStyle(0x000000, 0.5);
      starBg.fillCircle(W / 2 - 12, -H / 2 + 12, 9);
      const starText = scene.add.text(W / 2 - 12, -H / 2 + 12, '✦', {
        fontFamily: FONT_TITLE,
        fontSize: '11px',
        color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add(starBg);
      this.add(starText);
    }

    // ── Badge carta trattenuta ────────────────────────────────────────────
    if (cardData.retain) {
      const retainBg = scene.add.circle(W / 2 - 12, -H / 2 + 36, 9, C.gold, 0.9).setDepth(1);
      const retainIcon = scene.add.text(W / 2 - 12, -H / 2 + 36, '🔒', { fontSize: '9px' })
        .setOrigin(0.5).setDepth(2);
      this.add(retainBg);
      this.add(retainIcon);
    }

    // ── Overlay oscurato quando non giocabile ─────────────────────────────
    this._dimOverlay = scene.add.graphics();
    this._dimOverlay.fillStyle(0x000000, 0.5);
    this._dimOverlay.fillRoundedRect(-W / 2, -H / 2, W, H, 12);
    this._dimOverlay.setVisible(false);
    this.add(this._dimOverlay);

    // ── Interattività ─────────────────────────────────────────────────────
    this.setSize(W, H);
    this.setInteractive({ useHandCursor: true });
    scene.input.setDraggable(this);

    this.on('pointerover', () => {
      if (this.isEntering) return;
      if (!scene.input.activePointer.isDown && !scene.isAnimating) {
        this.isHovered = true;
        scene.tweens.killTweensOf(this);
        scene.tweens.add({
          targets: this,
          y: this.originalY - 70,
          scaleX: 1.4, scaleY: 1.4,
          rotation: 0,
          duration: 150, ease: 'Power2',
        });
        this.setDepth(65);
      }
    });

    this.on('pointerout', () => {
      if (this.isEntering) return;
      if (!scene.input.activePointer.isDown && !scene.isAnimating) {
        this.isHovered = false;
        scene.tweens.killTweensOf(this);
        scene.tweens.add({
          targets: this,
          y: this.originalY,
          scaleX: 1, scaleY: 1,
          rotation: this.originalRotation,
          duration: 150, ease: 'Power2',
        });
        this.setDepth(this.handIndex || 0);
      }
    });

    scene.add.existing(this);
  }

  setPlayable(canPlay) {
    this._playable = canPlay;
    this._dimOverlay.setVisible(!canPlay);
    this.setAlpha(canPlay ? 1 : 0.7);
  }

  savePosition() {
    this.originalX = this.x;
    this.originalY = this.y;
  }

  returnToPosition() {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      x: this.originalX, y: this.originalY,
      scaleX: 1, scaleY: 1,
      rotation: this.originalRotation,
      duration: 200, ease: 'Power2',
    });
    this.setDepth(this.handIndex || 0);
  }
}
