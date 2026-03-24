import Phaser from 'phaser';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, CARD_COLORS } from './Theme.js';

/**
 * CardSprite — Carta visiva stile moderno.
 * Supporta carte normali e maledizioni (isCurse).
 * Restyled per usare il design system Theme.js.
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
    const colors = CARD_COLORS[cardType] || CARD_COLORS.attack;

    const W = 120;
    const H = 170;

    // ── Grafica della carta (Graphics) ──────────────────────────────────
    this._cardGfx = scene.add.graphics();
    this._drawCardGfx(this._cardGfx, colors, W, H, false);
    this.add(this._cardGfx);

    // ── Banda superiore tipo (25% altezza) ──────────────────────────────
    const bandH = Math.floor(H * 0.25);
    this._bandGfx = scene.add.graphics();
    this._drawBand(this._bandGfx, colors, W, bandH);
    this.add(this._bandGfx);

    // ── Icona tipo nella banda ───────────────────────────────────────────
    const typeIcons = { attack: '⚔️', defend: '🛡️', skill: '✨', curse: '☠️' };
    const typeIcon = typeIcons[cardType] || '✨';
    const iconText = scene.add.text(0, -H / 2 + bandH / 2, typeIcon, {
      fontSize: '18px'
    }).setOrigin(0.5);
    this.add(iconText);

    // ── Nome carta (Cinzel bold, centro, sotto la banda) ─────────────────
    const nameText = scene.add.text(0, -H / 2 + bandH + 14, cardData.name, {
      fontFamily: FONT_TITLE,
      fontSize: '11px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: W - 12 }
    }).setOrigin(0.5, 0);
    this.add(nameText);

    // ── Costo (cerchio dorato top-right) ─────────────────────────────────
    const costCircle = scene.add.circle(W / 2 - 12, -H / 2 + 12, 12, C.bgHeader)
      .setStrokeStyle(2, C.borderGold);
    this.add(costCircle);

    const costText = scene.add.text(W / 2 - 12, -H / 2 + 12, String(cardData.cost), {
      fontFamily: FONT_TITLE,
      fontSize: '14px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add(costText);

    // ── Valore grande (Rajdhani bold, centro verticale) ───────────────────
    const valueY = -H / 2 + bandH + 52;
    const valueColor = isCurse ? '#c080e0' : colors.text;
    const valueDisplay = isCurse ? '☠' : String(cardData.value);
    const valueText = scene.add.text(0, valueY, valueDisplay, {
      fontFamily: FONT_UI,
      fontSize: '28px',
      color: valueColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add(valueText);

    // ── Descrizione (Inter 9px, secondario) ──────────────────────────────
    const descY = valueY + 38;
    const descText = scene.add.text(0, descY, cardData.description, {
      fontFamily: FONT_BODY,
      fontSize: '9px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      align: 'center',
      wordWrap: { width: W - 16 }
    }).setOrigin(0.5, 0);
    this.add(descText);

    // ── Badge carta upgraded (✦ stella dorata top-left) ──────────────────
    if (cardData.upgraded) {
      const starText = scene.add.text(-W / 2 + 8, -H / 2 + 8, '✦', {
        fontFamily: FONT_TITLE,
        fontSize: '11px',
        color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
        fontStyle: 'bold'
      }).setOrigin(0.5);
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

    // ── Interattività ────────────────────────────────────────────────────
    this.setSize(W, H);
    this.setInteractive({ useHandCursor: true });
    scene.input.setDraggable(this);

    // Hover
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
          duration: 150, ease: 'Power2'
        });
        this.setDepth(65);
        // Bordo hover luminoso
        this._drawCardGfx(this._cardGfx, colors, W, H, true);
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
          duration: 150, ease: 'Power2'
        });
        this.setDepth(this.handIndex || 0);
        // Ripristina bordo normale
        this._drawCardGfx(this._cardGfx, colors, W, H, false);
      }
    });

    scene.add.existing(this);
  }

  /**
   * Disegna lo sfondo + bordo della carta nel Graphics fornito.
   */
  _drawCardGfx(g, colors, W, H, hovered) {
    g.clear();
    const rx = -W / 2;
    const ry = -H / 2;
    const radius = 10;
    const borderColor = hovered ? C.borderBright : colors.border;
    const borderWidth = hovered ? 3 : 2;

    // Ombra
    g.fillStyle(0x000000, 0.5);
    g.fillRoundedRect(rx + 4, ry + 5, W, H, radius);

    // Sfondo carta
    g.fillStyle(colors.bg, 1);
    g.fillRoundedRect(rx, ry, W, H, radius);

    // Bordo
    g.lineStyle(borderWidth, borderColor, 1);
    g.strokeRoundedRect(rx, ry, W, H, radius);
  }

  /**
   * Disegna la banda superiore colorata del tipo.
   */
  _drawBand(g, colors, W, bandH) {
    g.clear();
    const rx = -W / 2;
    const ry = -170 / 2; // top della carta
    const radius = 10;
    g.fillStyle(colors.border, 0.8);
    // Top arrotondato, bottom piatto
    g.fillRoundedRect(rx, ry, W, bandH, { tl: radius, tr: radius, bl: 0, br: 0 });
  }

  /**
   * Aggiorna l'aspetto visivo in base alla giocabilità.
   */
  setPlayable(canPlay) {
    this._playable = canPlay;
    if (canPlay) {
      this.setAlpha(1);
    } else {
      this.setAlpha(0.45);
    }
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
      duration: 200, ease: 'Power2'
    });
    this.setDepth(this.handIndex || 0);
  }
}
