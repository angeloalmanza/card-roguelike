import Phaser from 'phaser';
import { MapGenerator } from '../managers/MapGenerator.js';
import { STARTER_DECK, REWARD_CARDS, CURSES } from '../data/cards.js';
import { POTIONS } from '../data/potions.js';
import { generateRelic } from '../data/relics.js';
import { SaveManager } from '../managers/SaveManager.js';
import { MusicManager } from '../managers/MusicManager.js';
import { CLASS_EMOJIS } from '../data/classes.js';
import { ENEMIES } from '../data/enemies.js';
import { FLOOR_CONDITIONS } from '../data/floorConditions.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';
import { AchievementManager } from '../managers/AchievementManager.js';

const F = FONT_UI;

/**
 * MapScene — Mappa con stile moderno.
 */
export class MapScene extends Phaser.Scene {
  constructor() {
    super('Map');
  }

  init(data) {
    this.runData = data.runData || {
      playerHp: 80,
      maxHp: 80,
      gold: 0,
      deck: null,
      currentFloor: -1,
      currentCol: -1,
      map: null,
      relics: [],
      potions: [],
      permanentStrength: 0,
    };

    if (!this.runData.classId) this.runData.classId = 'warrior';
    if (!this.runData.map) {
      this.runData.map = MapGenerator.generate(15, 4);
    }
    if (!this.runData.potions) this.runData.potions = [];
    if (!this.runData.permanentStrength) this.runData.permanentStrength = 0;
    if (!this.runData.flags) this.runData.flags = {};
    if (!this.runData.relicStacks) this.runData.relicStacks = {};

    // Challenge noRest: sostituisce tutti i nodi rest con nodi combat
    const challenge = this.runData.challenge;
    if (challenge && challenge.flags && challenge.flags.noRest) {
      this.runData.map.floors.forEach(floor => {
        floor.forEach(node => {
          if (node.type === 'rest') {
            node.type = 'combat';
          }
        });
      });
    }
  }

  create() {
    const { width, height } = this.scale;

    MusicManager.start(this, 0.28);
    MusicManager.setVolume(this, 0.28);
    this.cameras.main.fadeIn(450, 0, 0, 0);

    delete this.runData.inCombat;
    SaveManager.saveRun(this.runData);

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, C.bg);

    // Dot grid per profondità
    const dotGrid = this.add.graphics().setDepth(1);
    dotGrid.fillStyle(0xffffff, 0.05);
    for (let gx = 0; gx < width; gx += 40) {
      for (let gy = 70; gy < height; gy += 40) {
        dotGrid.fillCircle(gx, gy, 1);
      }
    }

    // Node styles
    this.nodeStyles = {
      combat: { icon: 'node-combat', color: 0xe85d5d, label: 'Combattimento' },
      elite:  { icon: 'node-elite',  color: 0xe8b84b, label: 'Elite' },
      event:  { icon: 'node-event',  color: 0xb07be8, label: 'Evento' },
      shop:   { icon: 'node-shop',   color: 0xe8b84b, label: 'Negozio' },
      rest:   { icon: 'node-rest',   color: 0x5dc77a, label: 'Riposo' },
      boss:   { icon: 'node-boss',   color: 0xe85d5d, label: 'Boss' },
    };

    // Header panel
    this.add.rectangle(width / 2, 0, width, 70, C.bgHeader).setOrigin(0.5, 0).setDepth(50);
    this.add.rectangle(width / 2, 70, width, 1, C.borderSubtle, 0.8).setDepth(50);

    // Riga 1 (y=22): HP sinistra, MAPPA centro, ORO destra
    const classEmoji = CLASS_EMOJIS[this.runData.classId] || '⚔️';
    this.add.text(20, 22, classEmoji, { fontSize: '13px' }).setOrigin(0, 0.5).setDepth(51);
    this.add.text(36, 22, `HP ${this.runData.playerHp}/${this.runData.maxHp}`, {
      fontFamily: F, fontSize: '13px', color: '#e05555', fontStyle: '700'
    }).setOrigin(0, 0.5).setDepth(51);

    // Titolo mappa — mostra badge Endless se attivo
    const mapTitle = this.runData.endlessMode
      ? `MAPPA  \u267E Endless x${this.runData.endlessDepth || 1}`
      : 'MAPPA';
    const mapTitleColor = this.runData.endlessMode ? '#e8b84b' : '#f4e4c8';
    this.add.text(width / 2, 22, mapTitle, {
      fontFamily: FONT_TITLE, fontSize: '16px', color: '#c9a84c', fontStyle: '700', letterSpacing: 4
    }).setOrigin(0.5).setDepth(51);

    this.add.text(width - 20, 22, `${this.runData.gold} ORO`, {
      fontFamily: F, fontSize: '13px', color: '#c9a84c', fontStyle: '700'
    }).setOrigin(1, 0.5).setDepth(51);

    // Riga 2 (y=52): reliquie sinistra, pozioni centro-sinistra, bottone MAZZO destra
    const relics = this.runData.relics || [];
    relics.forEach((relic, i) => {
      const rx = 18 + i * 24;
      const ry = 52;
      const bg = this.add.circle(rx, ry, 10, C.bgPanelDark, 0.9)
        .setStrokeStyle(1.5, C.borderGoldDim).setDepth(51).setInteractive({ useHandCursor: true });
      this.add.text(rx, ry, relic.emoji, { fontSize: '11px' }).setOrigin(0.5).setDepth(52);

      let tooltipBg, tooltipText;
      bg.on('pointerover', () => {
        const label = `${relic.name}\n${relic.description}`;
        const tx = Math.min(rx + 110, width - 110);
        tooltipBg = this.add.rectangle(tx, ry + 35, 210, 46, C.bgPanelDark, 0.97)
          .setStrokeStyle(1, C.borderGoldDim).setDepth(200);
        tooltipText = this.add.text(tx, ry + 35, label, {
          fontFamily: F, fontSize: '10px', color: '#f4e4c8', align: 'center', wordWrap: { width: 195 }
        }).setOrigin(0.5).setDepth(201);
      });
      bg.on('pointerout', () => {
        tooltipBg?.destroy();
        tooltipText?.destroy();
      });
    });

    // Pozioni nella mappa (riga 2, centro-sinistra)
    const potions = this.runData.potions || [];
    if (potions.length > 0) {
      const potionStr = potions.map(p => p.emoji).join(' ');
      this.add.text(width / 2 - 80, 52, potionStr, { fontSize: '13px' }).setOrigin(0, 0.5).setDepth(51);
    }

    // Bottone Deck Preview (1C)
    const deckCards = this.runData.deckCards || STARTER_DECK;
    const deckBtn = this.add.text(width - 20, 52, `MAZZO (${deckCards.length})`, {
      fontFamily: F, fontSize: '11px', color: '#4a8aaf', fontStyle: '700'
    }).setOrigin(1, 0.5).setDepth(51).setInteractive({ useHandCursor: true });

    deckBtn.on('pointerover', () => deckBtn.setColor('#6aaacf'));
    deckBtn.on('pointerout', () => deckBtn.setColor('#4a8aaf'));
    deckBtn.on('pointerdown', () => this.showDeckOverlay());

    // Scrollable map container
    this.mapContainer = this.add.container(0, 0);

    const map = this.runData.map;
    const floorSpacing = 80;
    const totalMapHeight = map.floors.length * floorSpacing + 120;
    const mapStartY = 70;

    this.drawConnections(map, floorSpacing, mapStartY);
    this.nodeObjects = [];
    this.drawNodes(map, floorSpacing, mapStartY);

    // Tooltip
    this.tooltip = this.add.text(width / 2, height - 25, '', {
      fontFamily: F, fontSize: '13px', color: '#e2e2e6', fontStyle: '700'
    }).setOrigin(0.5).setDepth(100);

    // Scroll
    this.maxScroll = Math.max(0, totalMapHeight - height + 80);

    if (this.runData.currentFloor <= 0) {
      this.mapContainer.y = -(totalMapHeight - height + 40);
    } else {
      const targetY = mapStartY + (map.floors.length - 1 - this.runData.currentFloor) * floorSpacing;
      this.mapContainer.y = -targetY + height / 2;
    }
    this.clampScroll();

    // Burst particelle sull'ultimo nodo completato
    const cf = this.runData.currentFloor;
    const cc = this.runData.currentCol;
    if (cf >= 0 && cc >= 0) {
      const completedNode = this.runData.map?.floors?.[cf]?.[cc];
      if (completedNode?.completed) {
        const floor = this.runData.map.floors[cf];
        const nodeLocalX = this.getNodeX(cc, floor.length);
        const nodeLocalY = mapStartY + (map.floors.length - 1 - cf) * floorSpacing;
        const nodeSceneX = nodeLocalX + this.mapContainer.x;
        const nodeSceneY = nodeLocalY + this.mapContainer.y;
        this._burstParticles(nodeSceneX, nodeSceneY);
      }
    }

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      this.mapContainer.y -= deltaY * 0.5;
      this.clampScroll();
    });

    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        this.mapContainer.y += pointer.velocity.y * 0.3;
        this.clampScroll();
      }
    });

    // TASK 3: Bottone Undo ultimo nodo
    this._createUndoButton();

    // TASK 1: Tutorial primo avvio
    this._maybeShowTutorial();

    // ENDLESS MODE: controlla se l'utente vuole continuare dopo aver completato tutti i piani
    this._checkEndlessMode();
  }

  _showAchievementPopups(achievements) {
    if (!achievements || achievements.length === 0) return;
    const { width, height } = this.scale;
    achievements.forEach((ach, idx) => {
      const delay = idx * 3000;
      this.time.delayedCall(delay, () => {
        const px = width - 170, py = height - 70;
        const bg = this.add.graphics().setDepth(300);
        bg.fillStyle(C.bgPanel, 0.97);
        bg.fillRoundedRect(px - 140, py - 24, 290, 48, 8);
        bg.lineStyle(2, C.borderGold, 1);
        bg.strokeRoundedRect(px - 140, py - 24, 290, 48, 8);
        bg.setAlpha(0);
        const txt = this.add.text(px, py, `🏆 ${ach.name}`, {
          fontFamily: FONT_UI, fontSize: '13px', color: '#f0d880', fontStyle: '700'
        }).setOrigin(0.5).setDepth(301).setAlpha(0);
        this.tweens.add({ targets: [bg, txt], alpha: 1, duration: 300 });
        this.time.delayedCall(2500, () => {
          this.tweens.add({ targets: [bg, txt], alpha: 0, duration: 300,
            onComplete: () => { bg.destroy(); txt.destroy(); }
          });
        });
      });
    });
  }

  _burstParticles(x, y, color = 0xc9a84c, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 25 + Math.random() * 15;
      const dot = this.add.circle(x, y, 2 + Math.random() * 2, color, 1).setDepth(60);
      this.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0, scaleX: 0.3, scaleY: 0.3,
        duration: 500 + Math.random() * 200,
        ease: 'Power2',
        onComplete: () => dot.destroy()
      });
    }
  }

  clampScroll() {
    const { height } = this.scale;
    const map = this.runData.map;
    const floorSpacing = 80;
    const totalMapHeight = map.floors.length * floorSpacing + 140;

    const minY = -(totalMapHeight - height + 40);
    const maxY = 40;
    this.mapContainer.y = Phaser.Math.Clamp(this.mapContainer.y, minY, maxY);
  }

  drawDashedLine(g, x1, y1, x2, y2, dashLen = 6, gapLen = 5) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return;
    const ux = dx / dist;
    const uy = dy / dist;
    const steps = Math.floor(dist / (dashLen + gapLen));

    for (let i = 0; i <= steps; i++) {
      const sx = x1 + (dashLen + gapLen) * i * ux;
      const sy = y1 + (dashLen + gapLen) * i * uy;
      let ex = sx + dashLen * ux;
      let ey = sy + dashLen * uy;
      const d = Math.sqrt((ex - x1) ** 2 + (ey - y1) ** 2);
      if (d > dist) { ex = x2; ey = y2; }
      g.lineBetween(sx, sy, ex, ey);
    }
  }

  // 1B — Connessioni colorate in base allo stato
  drawConnections(map, floorSpacing, startY) {
    const g = this.add.graphics();
    this.mapContainer.add(g);

    map.connections.forEach(conn => {
      const fromFloor = map.floors[conn.from.floor];
      const toFloor = map.floors[conn.to.floor];

      const fromX = this.getNodeX(conn.from.col, fromFloor.length);
      const fromY = startY + (map.floors.length - 1 - conn.from.floor) * floorSpacing;
      const toX = this.getNodeX(conn.to.col, toFloor.length);
      const toY = startY + (map.floors.length - 1 - conn.to.floor) * floorSpacing;

      const isCompleted = map.floors[conn.from.floor][conn.from.col].completed &&
                          map.floors[conn.to.floor][conn.to.col].completed;
      const isAccessible = this.isConnectionAccessible(conn);

      if (isCompleted) {
        g.lineStyle(2, 0x5dc77a, 0.4);        // verde — completata
      } else if (isAccessible) {
        g.lineStyle(2, 0xe8b84b, 0.9);        // oro — accessibile
      } else {
        g.lineStyle(2, C.borderSubtle, 0.5);   // bordo sottile — non raggiungibile
      }

      this.drawDashedLine(g, fromX, fromY, toX, toY, 8, 4);
    });
  }

  drawNodes(map, floorSpacing, startY) {
    for (let f = 0; f < map.floors.length; f++) {
      const floor = map.floors[f];
      const y = startY + (map.floors.length - 1 - f) * floorSpacing;

      for (let c = 0; c < floor.length; c++) {
        const node = floor[c];
        const x = this.getNodeX(c, floor.length);
        const style = this.nodeStyles[node.type];

        const isAccessible = this.isNodeAccessible(f, c);
        const isCurrent = f === this.runData.currentFloor && c === this.runData.currentCol;

        const radius = node.type === 'boss' ? 26 : 20;
        const alpha = node.completed ? 0.3 : (isAccessible ? 1 : 0.45);

        if (isAccessible && !node.completed) {
          const glow = this.add.circle(x, y, radius + 8, style.color, 0.12);
          this.mapContainer.add(glow);
          this.tweens.add({
            targets: glow,
            scaleX: 1.4, scaleY: 1.4, alpha: 0,
            duration: 1200, repeat: -1, ease: 'Sine.easeOut'
          });
        }

        const nodeFills = {
          combat: C.attackDark,
          elite:  0x1a1500,
          event:  0x120a1a,
          shop:   0x1a1400,
          rest:   C.skillDark,
          boss:   0x1a0505,
        };
        const nodeStrokes = {
          combat: C.attack,
          elite:  C.borderGold,
          event:  0x9b59b6,
          shop:   C.borderGold,
          rest:   C.skill,
          boss:   C.attack,
        };
        const strokeW = node.type === 'boss' ? 3 : 2;
        const circle = this.add.circle(x, y, radius, nodeFills[node.type] ?? C.attackDark, alpha)
          .setStrokeStyle(strokeW, nodeStrokes[node.type] ?? style.color, alpha);
        this.mapContainer.add(circle);

        if (isCurrent) {
          const marker = this.add.circle(x, y, radius + 5, 0x000000, 0)
            .setStrokeStyle(2.5, 0xe8b84b);
          this.mapContainer.add(marker);
        }

        const icon = this.add.image(x, y, style.icon).setAlpha(alpha);
        if (node.type === 'boss') icon.setScale(1.3);
        this.mapContainer.add(icon);

        if (node.completed) {
          const check = this.add.text(x + radius - 2, y - radius + 2, '✓', {
            fontFamily: F, fontSize: '14px', color: '#5dc77a', fontStyle: '700'
          }).setOrigin(0.5);
          this.mapContainer.add(check);
        }

        if (isAccessible && !node.completed) {
          circle.setInteractive({ useHandCursor: true });

          let enemyTooltipBg = null;
          let enemyTooltipText = null;

          circle.on('pointerover', () => {
            circle.setStrokeStyle(2.5, 0xe8b84b);
            this.tooltip.setText(style.label);

            // Mostra tooltip nemico per nodi combat ed elite
            if (node.type === 'combat' || node.type === 'elite') {
              const info = this._getEnemyTooltipInfo(node.type, f);
              if (info) {
                const { width } = this.scale;
                const tooltipW = 200;
                const tooltipH = 68;
                const rawTx = x + this.mapContainer.x;
                const rawTy = y + this.mapContainer.y;
                // Posiziona il tooltip vicino al nodo, evitando i bordi
                const tx = Phaser.Math.Clamp(rawTx, tooltipW / 2 + 10, width - tooltipW / 2 - 10);
                const ty = rawTy - radius - tooltipH / 2 - 8;
                enemyTooltipBg = this.add.rectangle(tx, ty, tooltipW, tooltipH, 0x1a1a22, 0.97)
                  .setStrokeStyle(1.5, style.color).setDepth(300);
                enemyTooltipText = this.add.text(tx, ty, info, {
                  fontFamily: F, fontSize: '10px', color: '#e2e2e6',
                  align: 'center', wordWrap: { width: tooltipW - 16 }
                }).setOrigin(0.5).setDepth(301);
              }
            }
          });

          circle.on('pointerout', () => {
            circle.setStrokeStyle(2, style.color);
            this.tooltip.setText('');
            if (enemyTooltipBg) { enemyTooltipBg.destroy(); enemyTooltipBg = null; }
            if (enemyTooltipText) { enemyTooltipText.destroy(); enemyTooltipText = null; }
          });

          circle.on('pointerdown', () => {
            if (enemyTooltipBg) { enemyTooltipBg.destroy(); enemyTooltipBg = null; }
            if (enemyTooltipText) { enemyTooltipText.destroy(); enemyTooltipText = null; }
            this.selectNode(f, c, node);
          });
        }

        // Condizione di piano: badge sopra il nodo
        const condition = this.runData.map.floorConditions && this.runData.map.floorConditions[f];
        if (condition) {
          const condBadge = this.add.text(x + radius + 2, y - radius - 2, condition.badge, {
            fontSize: '11px'
          }).setOrigin(0.5).setDepth(62);
          this.mapContainer.add(condBadge);

          // Store condition on circle for tooltip
          if (typeof circle !== 'undefined') {
            circle.conditionInfo = condition;
          }
        }

        this.nodeObjects.push({ node, circle, icon });
      }
    }

    for (let f = 0; f < map.floors.length; f += 5) {
      const y = startY + (map.floors.length - 1 - f) * floorSpacing;
      const label = this.add.text(30, y, `${f + 1}`, {
        fontFamily: F, fontSize: '10px', color: '#55555f'
      }).setOrigin(0.5);
      this.mapContainer.add(label);
    }
  }

  /**
   * Restituisce una stringa con info sui nemici possibili per un nodo combat/elite.
   * Usata per il tooltip anteprima nemico.
   */
  _getEnemyTooltipInfo(nodeType, floor) {
    const tier = nodeType === 'elite' ? 'elite' : 'normal';
    const pool = Object.values(ENEMIES).filter(e => e.tier === tier);
    if (!pool.length) return null;

    // Calcola range HP e danno medio tra i nemici del pool
    let minHp = Infinity, maxHp = -Infinity;
    let totalDmg = 0, dmgCount = 0;
    const names = [];

    pool.forEach(enemy => {
      const hp = enemy.hp;
      if (hp < minHp) minHp = hp;
      if (hp > maxHp) maxHp = hp;
      names.push(`${enemy.emoji} ${enemy.name}`);

      const pattern = enemy.phases ? enemy.phases[0].pattern : (enemy.pattern || []);
      pattern.forEach(action => {
        if (action.type === 'attack' && action.value) {
          totalDmg += action.value;
          dmgCount++;
        }
      });
    });

    const avgDmg = dmgCount > 0 ? Math.round(totalDmg / dmgCount) : 0;
    const hpRange = minHp === maxHp ? `${minHp}` : `${minHp}–${maxHp}`;

    // Mostra fino a 3 nomi di nemici possibili
    const displayNames = names.slice(0, 3).join(', ') + (names.length > 3 ? '…' : '');

    return `${displayNames}\nHP: ${hpRange}  |  Dmg medio: ${avgDmg}`;
  }

  getNodeX(col, totalCols) {
    const { width } = this.scale;
    const margin = 320;
    const usableWidth = width - margin * 2;
    if (totalCols === 1) return width / 2;
    return margin + (col / (totalCols - 1)) * usableWidth;
  }

  isNodeAccessible(floor, col) {
    const { currentFloor, currentCol, map } = this.runData;
    if (currentFloor === -1 && floor === 0) return true;
    if (floor !== currentFloor + 1) return false;
    return map.connections.some(
      c => c.from.floor === currentFloor && c.from.col === currentCol &&
           c.to.floor === floor && c.to.col === col
    );
  }

  isConnectionAccessible(conn) {
    const { currentFloor, currentCol } = this.runData;
    if (currentFloor === -1 && conn.from.floor === 0) return true;
    return conn.from.floor === currentFloor && conn.from.col === currentCol;
  }

  selectNode(floor, col, node) {
    try { if (this.cache.audio.exists('menu-click')) this.sound.play('menu-click', { volume: 0.5 }); } catch(e) {}

    // TASK 3: salva posizione precedente per possibile undo
    const prevFloorIdx = this.runData.currentFloor;
    const prevColIdx = this.runData.currentCol;

    if (this.runData.currentFloor >= 0) {
      const prevFloor = this.runData.map.floors[this.runData.currentFloor];
      if (prevFloor && prevFloor[this.runData.currentCol]) {
        prevFloor[this.runData.currentCol].completed = true;
      }
    }

    this.runData.currentFloor = floor;
    this.runData.currentCol = col;

    // Attacca la condizione del piano corrente al runData
    const conditions = this.runData.map.floorConditions;
    this.runData.currentFloorCondition = (conditions && conditions[floor]) || null;

    switch (node.type) {
      case 'combat':
      case 'elite':
      case 'boss':
        // Per i combat NON salvare lastNode (non si può fare undo dei combattimenti)
        this.runData.lastNode = null;
        this.runData.inCombat = node.type;
        SaveManager.saveRun(this.runData);
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Combat', { runData: this.runData, nodeType: node.type });
        });
        break;
      case 'rest':
        // Salva lastNode per undo
        this.runData.lastNode = { floor: prevFloorIdx, col: prevColIdx, type: node.type, enteredFloor: floor, enteredCol: col };
        this.handleRest();
        break;
      case 'event':
        // Salva lastNode per undo
        this.runData.lastNode = { floor: prevFloorIdx, col: prevColIdx, type: node.type, enteredFloor: floor, enteredCol: col };
        this.handleEvent();
        break;
      case 'shop':
        // Salva lastNode per undo
        this.runData.lastNode = { floor: prevFloorIdx, col: prevColIdx, type: node.type, enteredFloor: floor, enteredCol: col };
        this.handleShop();
        break;
    }
  }

  handleRest() {
    this.runData.map.floors[this.runData.currentFloor][this.runData.currentCol].completed = true;

    const { width, height } = this.scale;
    const restGroup = this.add.group();
    const G = (obj) => { restGroup.add(obj); return obj; };

    // Sfondo scuro semi-trasparente
    G(this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)
      .setDepth(200).setInteractive());

    // Pannello centrale
    G(this.add.rectangle(width / 2, height / 2, 500, 220, C.bgPanel)
      .setStrokeStyle(2, C.borderGold).setDepth(201));

    G(this.add.text(width / 2, height / 2 - 75, 'Campo di Riposo', {
      fontFamily: FONT_TITLE, fontSize: '20px', color: '#e8b84b', fontStyle: '700'
    }).setOrigin(0.5).setDepth(202));

    G(this.add.text(width / 2, height / 2 - 48, 'Scegli come trascorrere la notte', {
      fontFamily: F, fontSize: '12px', color: '#c8a870'
    }).setOrigin(0.5).setDepth(202));

    // --- Bottone RIPOSA ---
    // Perk hp_recovery: 35% invece di 25%
    const healPct = this.runData.perkHpRecovery ? 0.35 : 0.25;
    const healAmount = Math.floor(this.runData.maxHp * healPct);
    const btnRiposa = G(this.add.rectangle(width / 2 - 120, height / 2 + 10, 200, 80, C.btnSuccess)
      .setStrokeStyle(2, 0x5dc77a).setInteractive({ useHandCursor: true }).setDepth(202));

    G(this.add.text(width / 2 - 120, height / 2 - 15, '🛌 Riposa', {
      fontFamily: F, fontSize: '15px', color: '#5dc77a', fontStyle: '700'
    }).setOrigin(0.5).setDepth(203));

    G(this.add.text(width / 2 - 120, height / 2 + 12, `Recupera ${healAmount} HP`, {
      fontFamily: F, fontSize: '11px', color: '#a0d0a0'
    }).setOrigin(0.5).setDepth(203));

    G(this.add.text(width / 2 - 120, height / 2 + 28, `(${this.runData.perkHpRecovery ? '35' : '25'}% dell'HP massimo)`, {
      fontFamily: F, fontSize: '9px', color: '#6a9a6a'
    }).setOrigin(0.5).setDepth(203));

    btnRiposa.on('pointerover', () => btnRiposa.setFillStyle(0x1e3f22));
    btnRiposa.on('pointerout', () => btnRiposa.setFillStyle(C.btnSuccess));
    btnRiposa.on('pointerdown', () => {
      this.runData.playerHp = Math.min(this.runData.maxHp, this.runData.playerHp + healAmount);
      SaveManager.saveRun(this.runData);
      restGroup.getChildren().forEach(c => c.destroy());
      restGroup.destroy(true);
      this._showRestResult(`+${healAmount} HP recuperati.\nBuon riposo, guerriero.`, 0x5dc77a);
    });

    // --- Bottone FORGIA ---
    const deckCards = this.runData.deckCards || STARTER_DECK;
    const upgradeable = deckCards.filter(c => !c.name.includes('✦') && !c.isCurse);
    const canForge = upgradeable.length > 0;

    const btnForja = G(this.add.rectangle(width / 2 + 120, height / 2 + 10, 200, 80,
      canForge ? C.bgPanel : C.bgPanelDark)
      .setStrokeStyle(2, canForge ? C.borderGold : 0x444450)
      .setInteractive({ useHandCursor: canForge }).setDepth(202));

    G(this.add.text(width / 2 + 120, height / 2 - 15, '⚒ Forgia', {
      fontFamily: F, fontSize: '15px', color: canForge ? '#e8b84b' : '#666670', fontStyle: '700'
    }).setOrigin(0.5).setDepth(203));

    G(this.add.text(width / 2 + 120, height / 2 + 12, 'Upgrada una carta', {
      fontFamily: F, fontSize: '11px', color: canForge ? '#d4c080' : '#555560'
    }).setOrigin(0.5).setDepth(203));

    G(this.add.text(width / 2 + 120, height / 2 + 28, canForge ? 'del tuo mazzo' : '(nessuna carta disponibile)', {
      fontFamily: F, fontSize: '9px', color: canForge ? '#a89040' : '#444450'
    }).setOrigin(0.5).setDepth(203));

    if (canForge) {
      btnForja.on('pointerover', () => btnForja.setFillStyle(0x1a2030));
      btnForja.on('pointerout', () => btnForja.setFillStyle(C.bgPanel));
      btnForja.on('pointerdown', () => {
        restGroup.getChildren().forEach(c => c.destroy());
        restGroup.destroy(true);
        this._showForgeScreen();
      });
    }
  }

  _showRestResult(msg, color = 0xe8b84b) {
    const { width, height } = this.scale;
    const colorHex = '#' + color.toString(16).padStart(6, '0');

    const overlay = this.add.rectangle(width / 2, height / 2, 400, 180, C.bgPanel, 0.97)
      .setStrokeStyle(2, color).setDepth(210).setInteractive();

    this.add.text(width / 2, height / 2 - 35, msg, {
      fontFamily: F, fontSize: '15px', color: colorHex, fontStyle: '700',
      align: 'center', wordWrap: { width: 360 }
    }).setOrigin(0.5).setDepth(211);

    this.add.text(width / 2, height / 2 + 50, 'Clicca per continuare', {
      fontFamily: F, fontSize: '11px', color: '#c8a870'
    }).setOrigin(0.5).setDepth(211);

    overlay.on('pointerdown', () => {
      this.scene.restart({ runData: this.runData });
    });
  }

  _showForgeScreen() {
    const { width, height } = this.scale;
    const forgeGroup = this.add.group();
    const G = (obj) => { forgeGroup.add(obj); return obj; };

    // Sfondo
    G(this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85)
      .setDepth(210).setInteractive());

    // Pannello titolo
    G(this.add.rectangle(width / 2, 40, width, 68, C.bgPanel, 1)
      .setStrokeStyle(0).setDepth(211));

    G(this.add.text(width / 2, 22, '⚒ FORGIA', {
      fontFamily: FONT_TITLE, fontSize: '20px', color: '#e8b84b', fontStyle: '700'
    }).setOrigin(0.5).setDepth(212));

    G(this.add.text(width / 2, 48, 'Scegli una carta da upgradare', {
      fontFamily: F, fontSize: '12px', color: '#c8a870'
    }).setOrigin(0.5).setDepth(212));

    const cards = this.runData.deckCards || STARTER_DECK;
    const typeColors = { attack: 0x3a1a1a, defend: 0x1a1a3a, skill: 0x1a2a1a, curse: 0x1a0a1e };
    const borderColors = { attack: 0xe85d5d, defend: 0x5b9bd5, skill: 0x5dc77a, curse: 0x8833aa };

    const cols = 5;
    const cardW = 210, cardH = 62, gapX = 220, gapY = 72;
    const visibleCards = Math.min(cols, cards.length);
    const startX = width / 2 - ((visibleCards - 1) * gapX) / 2;
    const startY = 100;

    cards.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * gapX;
      const y = startY + row * gapY;

      const isUpgraded = card.name.includes('✦');
      const isCurse = card.isCurse;
      const canUpgrade = !isUpgraded && !isCurse;

      const bgColor = canUpgrade ? (typeColors[card.type] || 0x1e1e28) : 0x1a1a1a;
      const borderColor = canUpgrade ? (borderColors[card.type] || 0xe8b84b) : 0x444450;

      const cardBg = G(this.add.rectangle(x, y, cardW, cardH, bgColor)
        .setStrokeStyle(1.5, borderColor)
        .setDepth(212));

      if (canUpgrade) {
        cardBg.setInteractive({ useHandCursor: true });
        cardBg.on('pointerover', () => cardBg.setFillStyle(
          card.type === 'attack' ? 0x5a2a2a :
          card.type === 'defend' ? 0x2a2a5a :
          card.type === 'skill'  ? 0x2a4a2a : 0x2a1a3a
        ));
        cardBg.on('pointerout', () => cardBg.setFillStyle(bgColor));
        cardBg.on('pointerdown', () => {
          this._applyForgeUpgrade(card);
          SaveManager.saveRun(this.runData);
          forgeGroup.getChildren().forEach(c => c.destroy());
          forgeGroup.destroy(true);
          this._showRestResult(`Carta upgradrata:\n${card.name}`, 0xe8b84b);
        });
      }

      const iconKey = isCurse ? 'icon-curse' : `icon-${card.type}`;
      G(this.add.image(x - cardW / 2 + 26, y, iconKey).setScale(0.65).setDepth(213));

      const nameColor = canUpgrade ? '#f4e4c8' : '#666670';
      G(this.add.text(x + 10, y - 12, card.name, {
        fontFamily: F, fontSize: '12px', color: nameColor, fontStyle: '700'
      }).setOrigin(0.5).setDepth(213));

      const typeLabel = { attack: 'Attacco', defend: 'Difesa', skill: 'Abilità', curse: 'Maledizione' };
      const valLabel = isCurse ? '' :
        card.type === 'skill' && card.extraStrength ? `Forza: ${card.extraStrength}` :
        card.type === 'skill' && card.drawCards   ? `Pesca: ${card.drawCards}` :
        `Valore: ${card.value}`;

      G(this.add.text(x + 10, y + 8, `${typeLabel[card.type] || card.type} | ${valLabel}`, {
        fontFamily: F, fontSize: '10px',
        color: canUpgrade ? (borderColors[card.type] ? '#' + borderColors[card.type].toString(16).padStart(6,'0') : '#e8b84b') : '#555560'
      }).setOrigin(0.5).setDepth(213));

      if (isUpgraded) {
        G(this.add.text(x + cardW / 2 - 14, y - cardH / 2 + 10, '✦', {
          fontFamily: F, fontSize: '13px', color: '#e8b84b'
        }).setOrigin(0.5).setDepth(214));
      }
    });

    // Pulsante annulla
    const cancelBtn = G(this.add.rectangle(width / 2, height - 38, 160, 36, C.bgPanel)
      .setStrokeStyle(1.5, C.borderGold).setInteractive({ useHandCursor: true }).setDepth(212));
    G(this.add.text(width / 2, height - 38, 'Annulla', {
      fontFamily: FONT_UI, fontSize: '13px', color: '#e8b84b', fontStyle: '700'
    }).setOrigin(0.5).setDepth(213));

    cancelBtn.on('pointerover', () => cancelBtn.setFillStyle(0x1a2030));
    cancelBtn.on('pointerout', () => cancelBtn.setFillStyle(C.bgPanel));
    cancelBtn.on('pointerdown', () => {
      forgeGroup.getChildren().forEach(c => c.destroy());
      forgeGroup.destroy(true);
      this.handleRest();
    });
  }

  _applyForgeUpgrade(card) {
    if (card.type === 'attack') {
      card.value += 3;
      card.name += ' ✦';
      card.description = card.description.replace(/(\d+) danni/, (m, n) => `${parseInt(n) + 3} danni`);
    } else if (card.type === 'defend') {
      card.value += 3;
      card.name += ' ✦';
      card.description = card.description.replace(/(\d+) blocco/, (m, n) => `${parseInt(n) + 3} blocco`);
    } else if (card.type === 'skill') {
      if (card.extraStrength !== undefined) {
        card.extraStrength += 2;
        card.description = card.description.replace(/\+(\d+) forza/, (m, n) => `+${parseInt(n) + 2} forza`);
      } else {
        card.drawCards = (card.drawCards || 0) + 1;
        card.description = card.description.replace(/Pesca (\d+) cart/, (m, n) => `Pesca ${parseInt(n) + 1} cart`);
        if (!card.description.includes('Pesca')) {
          card.description += `\nPesca 1 carta.`;
        }
      }
      card.name += ' ✦';
    }
  }

  // 2A — handleEvent con scelte multiple
  handleEvent() {
    this.runData.map.floors[this.runData.currentFloor][this.runData.currentCol].completed = true;

    const allEvents = this._buildEventList();
    const flagEvents = allEvents.filter(e => e.flagRequired && e.flagRequired(this.runData));
    const normalEvents = allEvents.filter(e => !e.flagRequired);

    let selectedEvent;
    if (flagEvents.length > 0 && Math.random() < 0.35) {
      selectedEvent = flagEvents[Math.floor(Math.random() * flagEvents.length)];
    } else {
      selectedEvent = normalEvents[Math.floor(Math.random() * normalEvents.length)];
    }
    this._showEventOverlay(selectedEvent);
  }

  _buildEventList() {
    return [
      // 1. Mercante Ambulante
      {
        title: 'Mercante Ambulante',
        text: 'Un mercante misterioso ti offre una reliquia in cambio di oro.',
        choices: [
          {
            label: '💰 Paga 20 oro',
            condition: (r) => r.gold >= 20,
            effect: (r) => {
              r.gold -= 20;
              if (!r.relics) r.relics = [];
              r.flags.helpedMerchant = true;
              try {
                const relic = generateRelic('normal');
                r.relics.push(relic);
                return `Hai ottenuto: ${relic.emoji} ${relic.name}`;
              } catch(e) {
                r.gold += 10;
                return 'Il mercante scappa con i tuoi soldi... (+10 oro recuperati)';
              }
            }
          },
          { label: '❌ Rifiuta', effect: () => 'Il mercante se ne va fischiettando.' }
        ]
      },

      // 2. Altare Sacrificale
      {
        title: 'Altare Sacrificale',
        text: 'Un altare oscuro promette potere in cambio di sangue versato.',
        choices: [
          {
            label: '🩸 Paga 15 HP (carta rara)',
            condition: (r) => r.playerHp > 20,
            effect: (r) => {
              r.playerHp -= 15;
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const card = REWARD_CARDS.rare[Math.floor(Math.random() * REWARD_CARDS.rare.length)];
              r.deckCards.push({ ...card });
              return `Sacrificio accettato!\n+1 carta rara: ${card.name}`;
            }
          },
          { label: '🚶 Ignora', effect: () => 'Passi oltre in silenzio.' }
        ]
      },

      // 3. Biblioteca Abbandonata
      {
        title: 'Biblioteca Abbandonata',
        text: 'Scaffali polverosi custodiscono antichi grimori di battaglia.',
        choices: [
          {
            label: '📖 Prendi una carta comune (gratis)',
            effect: (r) => {
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const card = REWARD_CARDS.common[Math.floor(Math.random() * REWARD_CARDS.common.length)];
              r.deckCards.push({ ...card });
              r.flags.visitedLibrary = true;
              return `Aggiunta al mazzo: ${card.name}`;
            }
          },
          {
            label: '📕 Paga 5 HP per una rara',
            condition: (r) => r.playerHp > 10,
            effect: (r) => {
              r.playerHp -= 5;
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const card = REWARD_CARDS.rare[Math.floor(Math.random() * REWARD_CARDS.rare.length)];
              r.deckCards.push({ ...card });
              r.flags.visitedLibrary = true;
              return `Aggiunta: ${card.name}\n(-5 HP)`;
            }
          }
        ]
      },

      // 4. Campeggio Abbandonato
      {
        title: 'Campeggio Abbandonato',
        text: 'Un vecchio accampamento. Puoi riposare o cercare risorse.',
        choices: [
          {
            label: '🛌 Riposa (+20% HP)',
            effect: (r) => {
              const heal = Math.floor(r.maxHp * 0.2);
              r.playerHp = Math.min(r.maxHp, r.playerHp + heal);
              return `+${heal} HP recuperati.`;
            }
          },
          {
            label: '🔍 Cerca risorse (+30 oro, rischio)',
            effect: (r) => {
              if (Math.random() < 0.5) {
                r.gold += 30;
                return '+30 oro trovati!';
              } else {
                const dmg = 10;
                r.playerHp = Math.max(1, r.playerHp - dmg);
                r.gold += 15;
                return `Trappola! -${dmg} HP ma +15 oro.`;
              }
            }
          }
        ]
      },

      // 5. Spirito della Foresta
      {
        title: 'Spirito della Foresta',
        text: 'Uno spirito antico offre di alleggerire il peso del tuo mazzo.',
        choices: [
          {
            label: '✨ Rimuovi carta casuale (gratis)',
            condition: (r) => (r.deckCards || STARTER_DECK).length > 6,
            effect: (r) => {
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const idx = Math.floor(Math.random() * r.deckCards.length);
              const removed = r.deckCards.splice(idx, 1)[0];
              r.flags.helpedSpirit = true;
              return `Lo spirito ha rimosso: ${removed.name}`;
            }
          },
          { label: '🚶 Ignora', effect: () => 'Lo spirito svanisce come nebbia.' }
        ]
      },

      // 6. Armaiolo
      {
        title: 'Armaiolo',
        text: 'Un armaiolo offre di rafforzare la tua armatura per un compenso.',
        choices: [
          {
            label: '🛡️ Paga 40 oro (+10 HP max)',
            condition: (r) => r.gold >= 40,
            effect: (r) => {
              r.gold -= 40;
              r.maxHp += 10;
              r.playerHp += 10;
              return '+10 HP massimi!\n(-40 oro)';
            }
          },
          { label: '🚶 Ignora', effect: () => 'Non ne hai bisogno adesso.' }
        ]
      },

      // 7. Alchimista Pazzo
      {
        title: 'Alchimista Pazzo',
        text: 'Un alchimista vorrrebbe trasformare una carta del tuo mazzo.',
        choices: [
          {
            label: '⚗️ Lascialo lavorare (rischio)',
            condition: (r) => (r.deckCards || []).length > 0,
            effect: (r) => {
              if (!r.deckCards || r.deckCards.length === 0) return 'Mazzo vuoto!';
              const idx = Math.floor(Math.random() * r.deckCards.length);
              const oldCard = r.deckCards[idx];
              if (Math.random() < 0.3) {
                const newCard = STARTER_DECK[Math.floor(Math.random() * STARTER_DECK.length)];
                r.deckCards[idx] = { ...newCard };
                return `${oldCard.name} → ${newCard.name}\n(peggiorata!)`;
              } else {
                const pool = Math.random() < 0.5 ? REWARD_CARDS.uncommon : REWARD_CARDS.rare;
                const newCard = pool[Math.floor(Math.random() * pool.length)];
                r.deckCards[idx] = { ...newCard };
                return `${oldCard.name} → ${newCard.name}\n(migliorata!)`;
              }
            }
          },
          { label: '🚶 Rifiuta', effect: () => 'Meglio non rischiare.' }
        ]
      },

      // 8. Tesoro Nascosto
      {
        title: 'Tesoro Nascosto',
        text: 'Intravvedi un forziere nascosto tra le rocce. Ha una trappola?',
        choices: [
          {
            label: '💎 Apri (+50 oro, -8 HP)',
            effect: (r) => {
              r.gold += 50;
              const dmg = 8;
              r.playerHp = Math.max(1, r.playerHp - dmg);
              return `+50 oro!\nScatta una trappola: -${dmg} HP.`;
            }
          },
          { label: '👁️ Lascia perdere', effect: () => 'Meglio non rischiare.' }
        ]
      },

      // 9. Oracolo
      {
        title: 'Oracolo',
        text: 'Un essere misterioso vede oltre il tempo. Chiedi consiglio?',
        choices: [
          {
            label: '🔮 Chiedi una visione',
            effect: (r) => {
              r.gold += 20;
              return 'L\'oracolo ti dona saggezza e 20 oro.';
            }
          },
          { label: '🚶 Ignora', effect: () => 'Alcune cose è meglio non sapere.' }
        ]
      },

      // 10. Mercenario
      {
        title: 'Mercenario',
        text: 'Un guerriero di ventura offre i suoi servizi.',
        choices: [
          {
            label: '⚔️ Ingaggialo (60 oro, +5 Forza)',
            condition: (r) => r.gold >= 60,
            effect: (r) => {
              r.gold -= 60;
              r.permanentStrength = (r.permanentStrength || 0) + 5;
              return '+5 Forza permanente!\n(-60 oro)';
            }
          },
          { label: '🚶 Rifiuta', effect: () => 'Il mercenario se ne va.' }
        ]
      },

      // 11. Pozza Magica
      {
        title: 'Pozza Magica',
        text: 'Un\'acqua luminosa e profumata promette guarigione.',
        choices: [
          {
            label: '💧 Bevi (+20 HP)',
            effect: (r) => {
              const heal = Math.min(20, r.maxHp - r.playerHp);
              r.playerHp = Math.min(r.maxHp, r.playerHp + heal);
              return `+${heal} HP recuperati.`;
            }
          },
          {
            label: '🍶 Bevi due volte (+10 HP + Maledizione)',
            effect: (r) => {
              const heal = Math.min(10, r.maxHp - r.playerHp);
              r.playerHp = Math.min(r.maxHp, r.playerHp + heal);
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              r.deckCards.push({ ...CURSES[1] }); // Affaticamento
              return `+${heal} HP.\nAffaticamento aggiunto al mazzo!`;
            }
          }
        ]
      },

      // 12. Contrabbandiere
      {
        title: 'Contrabbandiere',
        text: 'Un mercante dall\'aria sospetta vende pozioni a buon prezzo.',
        choices: [
          {
            label: '🧴 Pozione Salute (30 oro)',
            condition: (r) => r.gold >= 30 && (r.potions || []).length < 3,
            effect: (r) => {
              r.gold -= 30;
              if (!r.potions) r.potions = [];
              r.potions.push({ ...POTIONS.health });
              return 'Pozione Salute acquistata!\n(-30 oro)';
            }
          },
          {
            label: '🔋 Pozione Energia (30 oro)',
            condition: (r) => r.gold >= 30 && (r.potions || []).length < 3,
            effect: (r) => {
              r.gold -= 30;
              if (!r.potions) r.potions = [];
              r.potions.push({ ...POTIONS.energy });
              return 'Pozione Energia acquistata!\n(-30 oro)';
            }
          },
          { label: '🚶 No grazie', effect: () => 'Il contrabbandiere si nasconde.' }
        ]
      },

      // 13. Il Mercante Misterioso
      {
        title: 'Il Mercante Misterioso',
        text: 'Un mercante avvolto in un mantello scuro apre una valigetta piena di carte preziose.',
        choices: [
          {
            label: '🎴 Carta casuale gratis',
            effect: (r) => {
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const allPools = [...REWARD_CARDS.common, ...REWARD_CARDS.uncommon];
              const card = allPools[Math.floor(Math.random() * allPools.length)];
              r.deckCards.push({ ...card });
              return `Il mercante ti dona: ${card.name}`;
            }
          },
          {
            label: '💰 Paga 40 oro — carta rara casuale',
            condition: (r) => r.gold >= 40,
            effect: (r) => {
              r.gold -= 40;
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const pool = REWARD_CARDS.rare;
              const chosen = pool[Math.floor(Math.random() * pool.length)];
              r.deckCards.push({ ...chosen });
              return `Hai ottenuto: ${chosen.name}\n(-40 oro)`;
            }
          },
          { label: '🚶 Ignora', effect: () => 'Il mercante scompare tra le ombre.' }
        ]
      },

      // 14. Il Santuario Corrotto
      {
        title: 'Il Santuario Corrotto',
        text: "Un antico santuario emana un'energia oscura. Una voce promette potere in cambio di sacrificio.",
        choices: [
          {
            label: '🩸 Sacrifica 15 HP per una reliquia',
            condition: (r) => r.playerHp > 20,
            effect: (r) => {
              r.playerHp -= 15;
              if (!r.relics) r.relics = [];
              try {
                const relic = generateRelic('elite');
                r.relics.push(relic);
                return `Sacrificio accettato!\nHai ottenuto: ${relic.emoji} ${relic.name}\n(-15 HP)`;
              } catch(e) {
                return 'Il santuario assorbe il tuo sangue senza donare nulla.\n(-15 HP)';
              }
            }
          },
          { label: '🚶 Ignora', effect: () => "L'energia oscura si dissolve mentre ti allontani." }
        ]
      },

      // 15. Il Disertore
      {
        title: 'Il Disertore',
        text: 'Un soldato lacero ti si avvicina furtivamente. "Ho bisogno di soldi per fuggire. Ti do tutto quello che ho."',
        choices: [
          {
            label: '⚔️ Accetta — guadagna 50 oro (perdi una carta)',
            condition: (r) => (r.deckCards || STARTER_DECK).length > 5,
            effect: (r) => {
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const idx = Math.floor(Math.random() * r.deckCards.length);
              const removed = r.deckCards.splice(idx, 1)[0];
              r.gold += 50;
              return `Il disertore ti ha consegnato 50 oro.\nHa preso con sé: ${removed.name}`;
            }
          },
          { label: '🚶 Rifiuta', effect: () => 'Il soldato scompare nella foresta.' }
        ]
      },

      // 16. La Profezia
      {
        title: 'La Profezia',
        text: 'Una figura spettrale ti blocca il cammino. I suoi occhi sembrano vedere oltre il tempo.',
        choices: [
          {
            label: '🔮 Ascolta la visione (rivela i prossimi nodi)',
            effect: (r) => {
              const map = r.map;
              const nextFloor = (r.currentFloor || 0) + 1;
              const types = [];
              for (let f = nextFloor; f < Math.min(nextFloor + 3, map.floors.length); f++) {
                const floor = map.floors[f];
                const nodeTypes = [...new Set(floor.map(n => n.type))];
                types.push(`Piano ${f + 1}: ${nodeTypes.join('/')}`);
              }
              if (types.length === 0) return 'La profezia vede solo il vuoto — sei vicino alla fine.';
              return 'La profezia rivela:\n' + types.join('\n');
            }
          },
          {
            label: '❌ Rifiuta la visione (ricevi una maledizione)',
            effect: (r) => {
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const curse = CURSES[Math.floor(Math.random() * CURSES.length)];
              r.deckCards.push({ ...curse });
              return `La figura ti maledice per la tua arroganza.\n${curse.name} aggiunta al mazzo!`;
            }
          }
        ]
      },

      // 17. L'Altare del Sangue
      {
        title: "L'Altare del Sangue",
        text: 'Un altare antico e incrostato di sangue essiccato. Rune luminose promettono di potenziare le tue arti.',
        choices: [
          {
            label: '🩸 Sacrifica 20 HP per upgradare una carta',
            condition: (r) => r.playerHp > 25 && (r.deckCards || []).some(c => !c.name.includes('✦') && !c.isCurse),
            effect: (r) => {
              r.playerHp -= 20;
              if (!r.deckCards) r.deckCards = [...STARTER_DECK];
              const upgradeable = r.deckCards.filter(c => !c.name.includes('✦') && !c.isCurse);
              if (upgradeable.length === 0) return 'Nessuna carta da potenziare.\n(-20 HP)';
              const card = upgradeable[Math.floor(Math.random() * upgradeable.length)];
              if (card.type === 'attack') {
                card.value += 3;
                card.name += ' \u2746';
                card.description = card.description.replace(/(\d+) danni/, (m, n) => `${parseInt(n) + 3} danni`);
              } else if (card.type === 'defend') {
                card.value += 3;
                card.name += ' \u2746';
                card.description = card.description.replace(/(\d+) blocco/, (m, n) => `${parseInt(n) + 3} blocco`);
              } else if (card.type === 'skill') {
                if (card.extraStrength !== undefined) {
                  card.extraStrength += 2;
                  card.description = card.description.replace(/\+(\d+) forza/, (m, n) => `+${parseInt(n) + 2} forza`);
                } else {
                  card.drawCards = (card.drawCards || 0) + 1;
                  if (!card.description.includes('Pesca')) card.description += '\nPesca 1 carta.';
                }
                card.name += ' \u2746';
              }
              return `L'altare ha potenziato: ${card.name}\n(-20 HP)`;
            }
          },
          { label: '🚶 Passa oltre', effect: () => "L'altare si spegne mentre ti allontani." }
        ]
      },

      // --- EVENTI CON FLAG (appaiono solo se la condizione è vera) ---
      {
        title: 'Il Mercante Riconosce il Tuo Volto',
        text: 'Il mercante ambulante ti sorride. "Ti ricordo! Prendi qualcosa a metà prezzo."',
        flagRequired: (r) => r.flags && r.flags.helpedMerchant,
        choices: [
          {
            label: 'Acquista pozione (25 oro)',
            condition: (r) => r.gold >= 25 && (r.potions || []).length < 3,
            effect: (r) => {
              r.gold -= 25;
              if (!r.potions) r.potions = [];
              r.potions.push({ name: 'Pozione Salute', emoji: '🧴', effect: { heal: 30 }, price: 50 });
              return 'Hai acquistato una pozione a metà prezzo!';
            }
          },
          { label: 'Salutalo e vai', effect: (r) => 'Continui il tuo cammino.' }
        ]
      },
      {
        title: 'Lo Spirito Ricorda il Tuo Dono',
        text: 'Lo spirito della foresta appare di nuovo. La sua luce è più intensa.',
        flagRequired: (r) => r.flags && r.flags.helpedSpirit,
        choices: [
          {
            label: 'Chiedi guarigione',
            effect: (r) => {
              r.playerHp = Math.min(r.maxHp, r.playerHp + 25);
              return '+25 HP dallo spirito riconoscente.';
            }
          },
          { label: 'Ringrazia e vai', effect: (r) => 'Lo spirito annuisce con gratitudine.' }
        ]
      },
    ];
  }

  _showEventOverlay(event) {
    if (this.eventOverlayGroup) return;
    const { width, height } = this.scale;
    this.eventOverlayGroup = this.add.group();
    const G = (obj) => { this.eventOverlayGroup.add(obj); return obj; };

    // Sfondo scuro
    G(this.add.rectangle(width / 2, height / 2, width, height, 0x2a1206, 0.95)
      .setDepth(200).setInteractive());

    // Pannello
    const panelH = 120 + event.choices.length * 60;
    G(this.add.rectangle(width / 2, height / 2, 560, panelH, C.bgPanel, 0.98)
      .setStrokeStyle(2, 0xb07be8).setDepth(201));

    // Titolo
    G(this.add.text(width / 2, height / 2 - panelH / 2 + 30, event.title, {
      fontFamily: FONT_TITLE, fontSize: '20px', color: '#b07be8', fontStyle: '700'
    }).setOrigin(0.5).setDepth(202));

    // Testo
    G(this.add.text(width / 2, height / 2 - panelH / 2 + 65, event.text, {
      fontFamily: F, fontSize: '12px', color: '#a08060', align: 'center', wordWrap: { width: 500 }
    }).setOrigin(0.5).setDepth(202));

    // Bottoni scelte
    const choiceStartY = height / 2 - panelH / 2 + 105;
    event.choices.forEach((choice, i) => {
      const btnY = choiceStartY + i * 56;
      const canSelect = !choice.condition || choice.condition(this.runData);

      const btn = G(this.add.rectangle(width / 2, btnY, 490, 44,
        canSelect ? 0x4a2e10 : 0x2a1a08)
        .setStrokeStyle(2, canSelect ? 0xb07be8 : 0x3a1e08).setDepth(202));

      G(this.add.text(width / 2, btnY, choice.label, {
        fontFamily: F, fontSize: '13px', color: canSelect ? '#f4e4c8' : '#c8a870', fontStyle: '700'
      }).setOrigin(0.5).setDepth(203));

      if (canSelect) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setFillStyle(0x5a3e20));
        btn.on('pointerout', () => btn.setFillStyle(0x4a2e10));
        btn.on('pointerdown', () => {
          const resultText = choice.effect(this.runData);
          this._closeEventOverlay();
          this._showEventResult(resultText);
          // Achievement checks after event effect
          if (this.runData.relics) {
            const unlockedRelic = AchievementManager.check({ type: 'relic_pickup' });
            this._showAchievementPopups(unlockedRelic);
          }
          if (this.runData.deckCards) {
            const unlockedDeck = AchievementManager.check({ type: 'deck_size', deckSize: this.runData.deckCards.length });
            this._showAchievementPopups(unlockedDeck);
          }
          const unlockedGold = AchievementManager.check({ type: 'gold', gold: this.runData.gold });
          this._showAchievementPopups(unlockedGold);
        });
      }
    });
  }

  _closeEventOverlay() {
    if (this.eventOverlayGroup) {
      this.eventOverlayGroup.getChildren().forEach(c => c.destroy());
      this.eventOverlayGroup.destroy(true);
      this.eventOverlayGroup = null;
    }
  }

  _showEventResult(resultText) {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(width / 2, height / 2, 440, 220, C.bgPanel, 0.98)
      .setStrokeStyle(2, 0xb07be8).setDepth(210).setInteractive();

    this.add.text(width / 2, height / 2 - 45, 'Risultato', {
      fontFamily: F, fontSize: '16px', color: '#b07be8', fontStyle: '700'
    }).setOrigin(0.5).setDepth(211);

    this.add.text(width / 2, height / 2, resultText, {
      fontFamily: F, fontSize: '14px', color: '#d4a820', fontStyle: '700',
      align: 'center', wordWrap: { width: 400 }
    }).setOrigin(0.5).setDepth(211);

    this.add.text(width / 2, height / 2 + 70, 'Clicca per continuare', {
      fontFamily: F, fontSize: '11px', color: '#c8a870'
    }).setOrigin(0.5).setDepth(211);

    overlay.on('pointerdown', () => {
      this.scene.restart({ runData: this.runData });
    });
  }

  // 1C — Anteprima mazzo con filtri, ordinamento e contatore (TASK 2)
  showDeckOverlay() {
    if (this.deckOverlayGroup) return;
    const { width, height } = this.scale;
    this.deckOverlayGroup = this.add.group();
    const G = (obj) => { this.deckOverlayGroup.add(obj); return obj; };

    G(this.add.rectangle(width / 2, height / 2, width, height, 0x2a1206, 0.95)
      .setDepth(200).setInteractive());

    const allCards = this.runData.deckCards || STARTER_DECK;

    // Stato filtro e sort
    let activeFilter = 'all'; // 'all' | 'attack' | 'defend' | 'skill'
    let sortMode = 0; // 0 = tipo+costo asc, 1 = costo asc, 2 = costo desc

    const typeColors   = { attack: 0x4a2a10, defend: 0x1a1a2a, skill: 0x1a3a1a, curse: 0x1a0a1e };
    const borderColors = { attack: 0xe85d5d, defend: 0x5b9bd5, skill: 0x5dc77a, curse: 0x8833aa };
    const sortLabels   = ['Tipo+Costo ↑', 'Costo ↑', 'Costo ↓'];

    // ----- Helper: ordina e filtra -----
    const getFiltered = () => {
      let list = [...allCards];
      if (activeFilter !== 'all') list = list.filter(c => c.type === activeFilter);
      if (sortMode === 0) {
        const order = { attack: 0, defend: 1, skill: 2, curse: 3 };
        list.sort((a, b) => {
          const td = (order[a.type] || 4) - (order[b.type] || 4);
          return td !== 0 ? td : (a.cost || 0) - (b.cost || 0);
        });
      } else if (sortMode === 1) {
        list.sort((a, b) => (a.cost || 0) - (b.cost || 0));
      } else {
        list.sort((a, b) => (b.cost || 0) - (a.cost || 0));
      }
      return list;
    };

    // ----- Titolo -----
    const titleY = 28;
    const titleText = G(this.add.text(width / 2, titleY, `MAZZO`, {
      fontFamily: F, fontSize: '18px', color: '#f4e4c8', fontStyle: '700'
    }).setOrigin(0.5).setDepth(201));

    // ----- Contatore carte -----
    const counterText = G(this.add.text(width / 2, 50, `${allCards.length} carte`, {
      fontFamily: F, fontSize: '12px', color: '#c8a870'
    }).setOrigin(0.5).setDepth(201));

    // ----- Filtri per tipo -----
    const filterBtns = {};
    const filterDefs = [
      { key: 'all',    label: 'Tutti' },
      { key: 'attack', label: '⚔️ Attacco' },
      { key: 'defend', label: '🛡️ Difesa' },
      { key: 'skill',  label: '✨ Abilità' },
    ];
    const filterBarY = 72;
    const filterBtnW = 110;
    const filterGap  = 120;
    const filterStartX = width / 2 - ((filterDefs.length - 1) * filterGap) / 2;

    filterDefs.forEach((fd, idx) => {
      const fx = filterStartX + idx * filterGap;
      const isActive = () => activeFilter === fd.key;
      const getBorderColor = () => isActive() ? 0xe8b84b : 0x3a1e08;
      const getBgColor     = () => isActive() ? 0x4a3a10 : 0x2a1a08;

      const fbg = G(this.add.rectangle(fx, filterBarY, filterBtnW, 24, getBgColor())
        .setStrokeStyle(1.5, getBorderColor())
        .setInteractive({ useHandCursor: true }).setDepth(202));
      const ftxt = G(this.add.text(fx, filterBarY, fd.label, {
        fontFamily: F, fontSize: '10px', color: isActive() ? '#e8b84b' : '#c8a870', fontStyle: '700'
      }).setOrigin(0.5).setDepth(203));

      filterBtns[fd.key] = { bg: fbg, txt: ftxt };

      fbg.on('pointerover', () => { if (!isActive()) fbg.setFillStyle(0x3a2a10); });
      fbg.on('pointerout',  () => { if (!isActive()) fbg.setFillStyle(0x2a1a08); });
      fbg.on('pointerdown', () => {
        activeFilter = fd.key;
        // Aggiorna stili tutti i filtri
        filterDefs.forEach(f2 => {
          const b = filterBtns[f2.key];
          const active2 = f2.key === activeFilter;
          b.bg.setFillStyle(active2 ? 0x4a3a10 : 0x2a1a08);
          b.bg.setStrokeStyle(1.5, active2 ? 0xe8b84b : 0x3a1e08);
          b.txt.setColor(active2 ? '#e8b84b' : '#c8a870');
        });
        refreshCards();
      });
    });

    // ----- Bottone Ordina -----
    const sortBtnX = width - 100;
    const sortBtnY = filterBarY;
    const sortBg = G(this.add.rectangle(sortBtnX, sortBtnY, 150, 24, 0x2a1a08)
      .setStrokeStyle(1.5, 0x4a8aaf)
      .setInteractive({ useHandCursor: true }).setDepth(202));
    const sortTxt = G(this.add.text(sortBtnX, sortBtnY, `⇅ ${sortLabels[sortMode]}`, {
      fontFamily: F, fontSize: '10px', color: '#4a8aaf', fontStyle: '700'
    }).setOrigin(0.5).setDepth(203));

    sortBg.on('pointerover', () => sortBg.setFillStyle(0x3a2a10));
    sortBg.on('pointerout',  () => sortBg.setFillStyle(0x2a1a08));
    sortBg.on('pointerdown', () => {
      sortMode = (sortMode + 1) % 3;
      sortTxt.setText(`⇅ ${sortLabels[sortMode]}`);
      refreshCards();
    });

    // ----- Area carte (gruppo dinamico) -----
    const cardGroup = this.add.group();

    const refreshCards = () => {
      // Distruggi le carte precedenti
      cardGroup.getChildren().slice().forEach(c => c.destroy());
      cardGroup.clear(true, true);

      const cards = getFiltered();

      // Aggiorna contatore
      const total = allCards.length;
      const shown = cards.length;
      counterText.setText(shown === total ? `${total} carte` : `${shown} / ${total} carte`);

      if (cards.length === 0) {
        const noCards = this.add.text(width / 2, height / 2, 'Nessuna carta per questo filtro', {
          fontFamily: F, fontSize: '13px', color: '#c8a870'
        }).setOrigin(0.5).setDepth(201);
        cardGroup.add(noCards);
        return;
      }

      const cols  = 6;
      const cardW = 155, cardH = 60, padX = 12, padY = 10;
      const startX = width / 2 - ((Math.min(cols, cards.length) * (cardW + padX)) - padX) / 2;
      const startY = 92;

      cards.forEach((card, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardW + padX) + cardW / 2;
        const y = startY + row * (cardH + padY) + cardH / 2;

        const bg = this.add.rectangle(x, y, cardW, cardH, typeColors[card.type] || 0x4a2e10, 0.95)
          .setStrokeStyle(1, borderColors[card.type] || 0x3a1e08).setDepth(201);
        cardGroup.add(bg);

        const costT = this.add.text(x - cardW / 2 + 14, y, `${card.cost}`, {
          fontFamily: F, fontSize: '13px', color: '#d4a820', fontStyle: '700'
        }).setOrigin(0.5).setDepth(202);
        cardGroup.add(costT);

        const nameT = this.add.text(x + 8, y - 9, card.name, {
          fontFamily: F, fontSize: '11px', color: card.isCurse ? '#cc88ff' : '#f4e4c8', fontStyle: '700'
        }).setOrigin(0.5).setDepth(202);
        cardGroup.add(nameT);

        const descT = this.add.text(x + 8, y + 10, card.description.replace(/\n/g, ' '), {
          fontFamily: F, fontSize: '9px', color: '#a08060'
        }).setOrigin(0.5).setDepth(202);
        cardGroup.add(descT);

        // Stella dorata per carte upgraded (✦ nel nome)
        if (card.name && card.name.includes('✦')) {
          const star = this.add.text(x + cardW / 2 - 10, y - cardH / 2 + 8, '✦', {
            fontFamily: F, fontSize: '12px', color: '#e8b84b'
          }).setOrigin(0.5).setDepth(203);
          cardGroup.add(star);
        }
      });
    };

    // Prima visualizzazione
    refreshCards();

    // ----- Bottone CHIUDI -----
    const closeBtn = G(this.add.rectangle(width / 2, height - 40, 140, 36, 0x4a1a08)
      .setStrokeStyle(2, 0xe85d5d).setInteractive({ useHandCursor: true }).setDepth(201));
    G(this.add.text(width / 2, height - 40, 'CHIUDI', {
      fontFamily: F, fontSize: '13px', color: '#e2e2e6', fontStyle: '700'
    }).setOrigin(0.5).setDepth(202));

    closeBtn.on('pointerover', () => closeBtn.setFillStyle(0x6a2208));
    closeBtn.on('pointerout',  () => closeBtn.setFillStyle(0x4a1a08));
    closeBtn.on('pointerdown', () => {
      cardGroup.getChildren().slice().forEach(c => c.destroy());
      cardGroup.clear(true, true);
      this.deckOverlayGroup.getChildren().forEach(c => c.destroy());
      this.deckOverlayGroup.destroy(true);
      this.deckOverlayGroup = null;
    });
  }

  handleShop() {
    this.runData.map.floors[this.runData.currentFloor][this.runData.currentCol].completed = true;

    const { width, height } = this.scale;

    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x2a1206, 0.97)
      .setDepth(200);

    this.add.rectangle(width / 2, 0, width, 80, 0x3a1e08).setOrigin(0.5, 0).setDepth(201);
    this.add.rectangle(width / 2, 80, width, 1, 0x3a1e08, 0.6).setOrigin(0.5, 0).setDepth(201);
    this.add.text(width / 2, 25, 'NEGOZIO', {
      fontFamily: F, fontSize: '20px', color: '#d4a820', fontStyle: '700', letterSpacing: 3
    }).setOrigin(0.5).setDepth(202);

    this.shopGoldText = this.add.text(width / 2, 55, `${this.runData.gold} oro disponibili`, {
      fontFamily: F, fontSize: '13px', color: '#a08060'
    }).setOrigin(0.5).setDepth(202);

    // Shop cards
    const shopCards = [
      { ...this.randomFrom(REWARD_CARDS.common), rarity: 'common' },
      { ...this.randomFrom(REWARD_CARDS.common), rarity: 'common' },
      { ...this.randomFrom(REWARD_CARDS.uncommon), rarity: 'uncommon' },
      { ...this.randomFrom(REWARD_CARDS.rare), rarity: 'rare' },
    ];

    const seen = new Set();
    const uniqueCards = shopCards.filter(c => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });

    const rarityColors = { common: 0x8c8c96, uncommon: 0x5b9bd5, rare: 0xe8b84b };
    const rarityLabels = { common: 'COMUNE', uncommon: 'NON COMUNE', rare: 'RARA' };

    const cardWidth = 160;
    const spacing = 180;
    const startX = width / 2 - ((uniqueCards.length - 1) * spacing) / 2;
    const cardY = height / 2 - 60;

    uniqueCards.forEach((card, i) => {
      const x = startX + i * spacing;
      const rColor = rarityColors[card.rarity];

      const cardBg = this.add.rectangle(x, cardY, cardWidth, 220, 0x4a2e10)
        .setStrokeStyle(2, rColor)
        .setInteractive({ useHandCursor: true }).setDepth(201);

      this.add.text(x, cardY - 95, rarityLabels[card.rarity], {
        fontFamily: F, fontSize: '8px', color: '#c8a870', fontStyle: '700', letterSpacing: 1
      }).setOrigin(0.5).setDepth(202);

      const iconKey = `icon-${card.type}`;
      this.add.image(x, cardY - 65, iconKey).setScale(1.0).setDepth(202);

      const typeColors = { attack: 0xe85d5d, defend: 0x5b9bd5, skill: 0x5dc77a };
      this.add.circle(x - 60, cardY - 90, 14, typeColors[card.type] || 0x8c8c96, 0.85).setDepth(202);
      this.add.text(x - 60, cardY - 90, String(card.cost), {
        fontFamily: F, fontSize: '13px', color: '#ffffff', fontStyle: '700'
      }).setOrigin(0.5).setDepth(203);

      this.add.text(x, cardY - 35, card.name, {
        fontFamily: F, fontSize: '12px', color: '#1a0f00', fontStyle: '700'
      }).setOrigin(0.5).setDepth(202);

      const vc = { attack: '#a01818', defend: '#1a3a8a', skill: '#1a5a1a' };
      this.add.text(x, cardY - 10, String(card.value), {
        fontFamily: F, fontSize: '20px', color: vc[card.type] || '#d4a820', fontStyle: '900'
      }).setOrigin(0.5).setDepth(202);

      this.add.text(x, cardY + 30, card.description, {
        fontFamily: F, fontSize: '9px', color: '#5a3a18', align: 'center', wordWrap: { width: 130 }
      }).setOrigin(0.5).setDepth(202);

      const priceColor = this.runData.gold >= card.price ? '#d4a820' : '#e85d5d';
      const priceText = this.add.text(x, cardY + 80, `${card.price} oro`, {
        fontFamily: F, fontSize: '14px', color: priceColor, fontStyle: '700'
      }).setOrigin(0.5).setDepth(202);

      cardBg.on('pointerover', () => cardBg.setFillStyle(0x5a3e20));
      cardBg.on('pointerout', () => cardBg.setFillStyle(0x4a2e10));

      cardBg.on('pointerdown', () => {
        if (this.runData.gold >= card.price) {
          this.runData.gold -= card.price;
          if (!this.runData.deckCards) this.runData.deckCards = [...STARTER_DECK];
          this.runData.deckCards.push({
            name: card.name, type: card.type, cost: card.cost,
            value: card.value, description: card.description,
            hits: card.hits, drawCards: card.drawCards,
            heal: card.heal, giveEnergy: card.giveEnergy,
            extraStrength: card.extraStrength,
            applyPoison: card.applyPoison, applyBurn: card.applyBurn, applyStun: card.applyStun,
          });
          SaveManager.trackCard(card.name);
          priceText.setText('Comprata!');
          priceText.setColor('#5dc77a');
          cardBg.disableInteractive();
          cardBg.setAlpha(0.4);
          this.shopGoldText.setText(`${this.runData.gold} oro disponibili`);
          const unlockedDeck = AchievementManager.check({ type: 'deck_size', deckSize: this.runData.deckCards.length });
          this._showAchievementPopups(unlockedDeck);
          const unlockedGold = AchievementManager.check({ type: 'gold', gold: this.runData.gold });
          this._showAchievementPopups(unlockedGold);
        }
      });
    });

    // Sezione Pozioni (2C)
    const potionY = height - 180;
    this.add.text(width / 2, potionY - 15, '— POZIONI —', {
      fontFamily: F, fontSize: '11px', color: '#c8a870', fontStyle: '700', letterSpacing: 2
    }).setOrigin(0.5).setDepth(202);

    const potionList = Object.values(POTIONS);
    potionList.forEach((potion, i) => {
      const px = width / 2 - ((potionList.length - 1) * 130) / 2 + i * 130;
      const canBuy = this.runData.gold >= potion.price && (this.runData.potions || []).length < 3;
      const potionBg = this.add.rectangle(px, potionY + 25, 110, 56, 0x4a2e10)
        .setStrokeStyle(1.5, canBuy ? 0x5b9bd5 : 0x3a1e08)
        .setDepth(201);
      if (canBuy) potionBg.setInteractive({ useHandCursor: true });

      this.add.text(px - 28, potionY + 25, potion.emoji, { fontSize: '18px' }).setOrigin(0.5).setDepth(202);
      this.add.text(px + 16, potionY + 17, potion.name.replace('Pozione ', ''), {
        fontFamily: F, fontSize: '10px', color: '#f4e4c8', fontStyle: '700'
      }).setOrigin(0.5).setDepth(202);

      const potPriceText = this.add.text(px + 16, potionY + 33, `${potion.price} oro`, {
        fontFamily: F, fontSize: '10px', color: canBuy ? '#d4a820' : '#c8a870'
      }).setOrigin(0.5).setDepth(202);

      if (canBuy) {
        potionBg.on('pointerover', () => potionBg.setFillStyle(0x5a3e20));
        potionBg.on('pointerout', () => potionBg.setFillStyle(0x4a2e10));
        potionBg.on('pointerdown', () => {
          if (this.runData.gold >= potion.price && (this.runData.potions || []).length < 3) {
            this.runData.gold -= potion.price;
            if (!this.runData.potions) this.runData.potions = [];
            this.runData.potions.push({ ...potion });
            potPriceText.setText('Comprata!');
            potPriceText.setColor('#5dc77a');
            potionBg.disableInteractive();
            potionBg.setStrokeStyle(1.5, 0x4a2e10);
            this.shopGoldText.setText(`${this.runData.gold} oro disponibili`);
          }
        });
      }
    });

    // ── SEZIONE RIMUOVI DAL MAZZO ─────────────────────────────────────────
    const removeSectionY = height - 122;
    const removeCost = 75;
    const deckCards2 = this.runData.deckCards || STARTER_DECK;
    const canRemove = this.runData.gold >= removeCost && deckCards2.length > 5;
    const removableCards = deckCards2.filter(c => !c.isCurse);

    // Bordo sezione rosso scuro
    this.add.rectangle(width / 2, removeSectionY, width - 40, 70, 0x1a0a0a)
      .setStrokeStyle(2, 0x6a1a1a).setDepth(200);

    // Titolo sezione
    this.add.text(width / 2, removeSectionY - 22, '\uD83D\uDDD1\uFE0F RIMUOVI DAL MAZZO', {
      fontFamily: F, fontSize: '11px', color: '#aa3333', fontStyle: '700', letterSpacing: 2
    }).setOrigin(0.5).setDepth(202);

    // Messaggio di stato (costo o avviso)
    let removeStatusMsg = '';
    let removeStatusColor = '#e85d5d';
    if (deckCards2.length <= 5) {
      removeStatusMsg = 'Mazzo troppo piccolo (minimo 5 carte)';
      removeStatusColor = '#888898';
    } else if (removableCards.length === 0) {
      removeStatusMsg = 'Nessuna carta rimovibile';
      removeStatusColor = '#888898';
    } else if (this.runData.gold < removeCost) {
      removeStatusMsg = `${removeCost} oro  (oro insufficiente)`;
      removeStatusColor = '#e85d5d';
    } else {
      removeStatusMsg = `${removeCost} oro  —  clicca una carta per rimuoverla`;
      removeStatusColor = '#c85050';
    }

    this.add.text(width / 2, removeSectionY - 6, removeStatusMsg, {
      fontFamily: F, fontSize: '10px', color: removeStatusColor
    }).setOrigin(0.5).setDepth(202);

    // Mostra le prime N carte rimovibili in formato compatto
    const previewCount = Math.min(removableCards.length, 8);
    if (previewCount > 0 && canRemove) {
      const previewCardW = Math.min(110, (width - 80) / previewCount - 6);
      const previewStartX = width / 2 - ((previewCount - 1) * (previewCardW + 6)) / 2;
      const previewY = removeSectionY + 14;

      for (let pi = 0; pi < previewCount; pi++) {
        const pc = removableCards[pi];
        const px = previewStartX + pi * (previewCardW + 6);
        const miniCardBg = this.add.rectangle(px, previewY, previewCardW, 26, 0x2a0808)
          .setStrokeStyle(1, 0x8a2222)
          .setInteractive({ useHandCursor: true }).setDepth(202);

        this.add.text(px, previewY, pc.name, {
          fontFamily: F, fontSize: '9px', color: '#f0c0c0', fontStyle: '700'
        }).setOrigin(0.5).setDepth(203);

        miniCardBg.on('pointerover', () => miniCardBg.setFillStyle(0x5a1010));
        miniCardBg.on('pointerout',  () => miniCardBg.setFillStyle(0x2a0808));
        miniCardBg.on('pointerdown', () => {
          this.showCardRemovalScreen(removeCost);
        });
      }
    } else if (canRemove) {
      // Bottone fallback se nessuna carta da preview
      const removeBtn = this.add.rectangle(width / 2, removeSectionY + 12, 240, 28, 0x2a0808)
        .setStrokeStyle(1.5, 0x8a2222).setInteractive({ useHandCursor: true }).setDepth(202);
      this.add.text(width / 2, removeSectionY + 12, 'Scegli carta da rimuovere', {
        fontFamily: F, fontSize: '10px', color: '#c85050', fontStyle: '700'
      }).setOrigin(0.5).setDepth(203);
      removeBtn.on('pointerover', () => removeBtn.setFillStyle(0x4a1010));
      removeBtn.on('pointerout',  () => removeBtn.setFillStyle(0x2a0808));
      removeBtn.on('pointerdown', () => this.showCardRemovalScreen(removeCost));
    }

    // Exit button
    const exitBtn = this.add.rectangle(width / 2, height - 50, 180, 36, 0x4a2e10)
      .setStrokeStyle(1.5, 0x3a1e08).setInteractive({ useHandCursor: true }).setDepth(201);
    this.add.text(width / 2, height - 50, 'Esci dal negozio', {
      fontFamily: F, fontSize: '13px', color: '#a08060'
    }).setOrigin(0.5).setDepth(202);

    exitBtn.on('pointerover', () => exitBtn.setStrokeStyle(1.5, 0xd4a820));
    exitBtn.on('pointerout', () => exitBtn.setStrokeStyle(1.5, 0x3a1e08));
    exitBtn.on('pointerdown', () => {
      this.scene.restart({ runData: this.runData });
    });
  }

  showCardRemovalScreen(removeCost, onComplete = null) {
    const { width, height } = this.scale;
    const cards = this.runData.deckCards;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x2a1206, 0.98)
      .setDepth(300).setInteractive();

    this.add.text(width / 2, 28, 'SCEGLI UNA CARTA DA RIMUOVERE', {
      fontFamily: F, fontSize: '16px', color: '#e85d5d', fontStyle: '700', letterSpacing: 1
    }).setOrigin(0.5).setDepth(301);

    this.add.text(width / 2, 52, 'Clicca su una carta per rimuoverla dal mazzo', {
      fontFamily: F, fontSize: '11px', color: '#c8a870'
    }).setOrigin(0.5).setDepth(301);

    const cols = 6;
    const cardW = 140, cardH = 58, gapX = 155, gapY = 70;
    const startX = width / 2 - ((Math.min(cols, cards.length) - 1) * gapX) / 2;
    const startY = 90;

    const typeTextColors = { attack: '#ff7b7b', defend: '#7bb5e8', skill: '#7be896', curse: '#cc88ff' };
    const uiElements = [overlay];

    cards.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * gapX;
      const y = startY + row * gapY;

      const cardBg = this.add.rectangle(x, y, cardW, cardH, 0x4a2e10)
        .setStrokeStyle(1.5, 0x3a1e08)
        .setInteractive({ useHandCursor: true }).setDepth(301);

      const iconKey = card.isCurse ? 'icon-curse' : `icon-${card.type}`;
      const iconImg = this.add.image(x - 50, y, iconKey).setScale(0.7).setDepth(302);

      const nameT = this.add.text(x + 5, y - 10, card.name, {
        fontFamily: F, fontSize: '11px', color: '#f4e4c8', fontStyle: '700'
      }).setOrigin(0.5).setDepth(302);

      const descT = this.add.text(x + 5, y + 10, `${card.cost} en | ${card.value}`, {
        fontFamily: F, fontSize: '10px', color: typeTextColors[card.type] || '#8c8c96'
      }).setOrigin(0.5).setDepth(302);

      uiElements.push(cardBg, iconImg, nameT, descT);

      cardBg.on('pointerover', () => cardBg.setStrokeStyle(1.5, 0xe85d5d));
      cardBg.on('pointerout', () => cardBg.setStrokeStyle(1.5, 0x3a1e08));

      cardBg.on('pointerdown', () => {
        this.runData.deckCards.splice(i, 1);
        this.runData.gold -= removeCost;
        uiElements.forEach(el => el.destroy());
        cancelBtn.destroy();
        cancelText.destroy();
        if (this.shopGoldText) this.shopGoldText.setText(`${this.runData.gold} oro disponibili`);
        if (onComplete) onComplete();
      });
    });

    const cancelBtn = this.add.rectangle(width / 2, height - 40, 160, 35, 0x4a2e10)
      .setStrokeStyle(1.5, 0x3a1e08).setInteractive({ useHandCursor: true }).setDepth(301);
    const cancelText = this.add.text(width / 2, height - 40, 'Annulla', {
      fontFamily: F, fontSize: '13px', color: '#a08060'
    }).setOrigin(0.5).setDepth(302);

    cancelBtn.on('pointerdown', () => {
      uiElements.forEach(el => el.destroy());
      cancelBtn.destroy();
      cancelText.destroy();
    });
  }

  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ============================================================
  // TASK 3 — Bottone Undo ultimo nodo
  // ============================================================

  _createUndoButton() {
    const { width, height } = this.scale;

    const canUndo = this._canUndo();
    if (!canUndo) return;

    const relics = this.runData.relics || [];
    const undoBtnX = Math.max(60, 18 + relics.length * 24 + 50);
    const undoBtnY = 52;

    const undoBg = this.add.rectangle(undoBtnX, undoBtnY, 90, 20, C.bgPanelDark, 0.9)
      .setStrokeStyle(1.5, C.mana)
      .setInteractive({ useHandCursor: true }).setDepth(51);
    const undoTxt = this.add.text(undoBtnX, undoBtnY, '↩ Annulla', {
      fontFamily: F, fontSize: '10px', color: '#4a90d9', fontStyle: '700'
    }).setOrigin(0.5).setDepth(52);

    undoBg.on('pointerover', () => { undoBg.setFillStyle(0x1a2030); undoTxt.setColor('#6aaacf'); });
    undoBg.on('pointerout',  () => { undoBg.setFillStyle(C.bgPanelDark); undoTxt.setColor('#4a90d9'); });
    undoBg.on('pointerdown', () => this._showUndoConfirm());
  }

  _canUndo() {
    const { lastNode, currentFloor } = this.runData;
    if (!lastNode) return false;
    if (currentFloor < 0) return false;
    const undoableTypes = ['shop', 'event', 'rest'];
    return undoableTypes.includes(lastNode.type);
  }

  _showUndoConfirm() {
    if (this.undoOverlayGroup) return;
    const { width, height } = this.scale;
    this.undoOverlayGroup = this.add.group();
    const G = (obj) => { this.undoOverlayGroup.add(obj); return obj; };

    const lastNode = this.runData.lastNode;
    const typeLabels = { shop: 'Negozio 🛒', event: 'Evento 🟣', rest: 'Riposo 🟢' };
    const nodeLabel = typeLabels[lastNode.type] || lastNode.type;

    G(this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.65)
      .setDepth(310).setInteractive());

    G(this.add.rectangle(width / 2, height / 2, 440, 200, C.bgPanel)
      .setStrokeStyle(2, C.borderGold).setDepth(311));

    G(this.add.text(width / 2, height / 2 - 70, '↩ Annulla ultima azione?', {
      fontFamily: F, fontSize: '18px', color: '#e8b84b', fontStyle: '700'
    }).setOrigin(0.5).setDepth(312));

    G(this.add.text(width / 2, height / 2 - 38, `Nodo da annullare: ${nodeLabel}`, {
      fontFamily: F, fontSize: '13px', color: '#c8a870'
    }).setOrigin(0.5).setDepth(312));

    G(this.add.text(width / 2, height / 2 - 18, 'Tornerai alla posizione precedente sulla mappa.', {
      fontFamily: F, fontSize: '11px', color: '#a08060', align: 'center', wordWrap: { width: 400 }
    }).setOrigin(0.5).setDepth(312));

    const confirmBtn = G(this.add.rectangle(width / 2 - 80, height / 2 + 50, 140, 38, 0x3a1010)
      .setStrokeStyle(2, 0xe85d5d).setInteractive({ useHandCursor: true }).setDepth(311));
    G(this.add.text(width / 2 - 80, height / 2 + 50, 'CONFERMA', {
      fontFamily: F, fontSize: '13px', color: '#e85d5d', fontStyle: '700'
    }).setOrigin(0.5).setDepth(312));

    confirmBtn.on('pointerover', () => confirmBtn.setFillStyle(0x5a1a1a));
    confirmBtn.on('pointerout',  () => confirmBtn.setFillStyle(0x3a1010));
    confirmBtn.on('pointerdown', () => this._applyUndo());

    const cancelBtn = G(this.add.rectangle(width / 2 + 80, height / 2 + 50, 140, 38, 0x2a2a2a)
      .setStrokeStyle(2, 0x888898).setInteractive({ useHandCursor: true }).setDepth(311));
    G(this.add.text(width / 2 + 80, height / 2 + 50, 'ANNULLA', {
      fontFamily: F, fontSize: '13px', color: '#888898', fontStyle: '700'
    }).setOrigin(0.5).setDepth(312));

    cancelBtn.on('pointerover', () => cancelBtn.setFillStyle(0x3a3a3a));
    cancelBtn.on('pointerout',  () => cancelBtn.setFillStyle(0x2a2a2a));
    cancelBtn.on('pointerdown', () => {
      this.undoOverlayGroup.getChildren().forEach(c => c.destroy());
      this.undoOverlayGroup.destroy(true);
      this.undoOverlayGroup = null;
    });
  }

  _applyUndo() {
    const lastNode = this.runData.lastNode;
    if (!lastNode) return;

    const enteredFloor = lastNode.enteredFloor;
    const enteredCol   = lastNode.enteredCol;

    if (enteredFloor >= 0 && this.runData.map.floors[enteredFloor]) {
      const node = this.runData.map.floors[enteredFloor][enteredCol];
      if (node) node.completed = false;
    }

    this.runData.currentFloor = lastNode.floor;
    this.runData.currentCol   = lastNode.col;
    this.runData.lastNode     = null;

    SaveManager.saveRun(this.runData);
    this.scene.restart({ runData: this.runData });
  }

  // ============================================================
  // TASK 3 — Modalità Endless
  // ============================================================

  /**
   * Controlla se mostrare l'overlay Endless.
   * Viene triggerata quando il giocatore è al piano pre-boss
   * (currentFloor === map.floors.length - 2) e non ha già attivato l'endless.
   */
  _checkEndlessMode() {
    const map = this.runData.map;
    if (!map) return;

    const totalFloors = map.floors.length;
    const currentFloor = this.runData.currentFloor;

    // Mostra overlay solo quando siamo al piano che precede il boss
    // e l'endless non è stato ancora offerto per questo segmento
    const preBossFloor = totalFloors - 2;
    if (currentFloor !== preBossFloor) return;
    if (this.runData._endlessOfferedAt === preBossFloor) return;

    // Segna che l'offerta è stata mostrata per questo segmento
    this.runData._endlessOfferedAt = preBossFloor;

    const { width, height } = this.scale;
    const endlessGroup = this.add.group();
    const G = (obj) => { endlessGroup.add(obj); return obj; };

    G(this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75)
      .setDepth(400).setInteractive());

    G(this.add.rectangle(width / 2, height / 2, 520, 260, 0x1a1020)
      .setStrokeStyle(2.5, 0xe8b84b).setDepth(401));

    G(this.add.text(width / 2, height / 2 - 95, '\uD83C\uDFC6 Boss in vista!', {
      fontFamily: F, fontSize: '22px', color: '#e8b84b', fontStyle: '700'
    }).setOrigin(0.5).setDepth(402));

    G(this.add.text(width / 2, height / 2 - 58, 'Vuoi continuare la run dopo aver sconfitto il boss?', {
      fontFamily: F, fontSize: '12px', color: '#c8a870', align: 'center', wordWrap: { width: 460 }
    }).setOrigin(0.5).setDepth(402));

    const depth = (this.runData.endlessDepth || 0) + 1;
    G(this.add.text(width / 2, height / 2 - 35, `Difficolt\u00E0 Endless: ${Math.min(10, depth * 2 + 1)}/10`, {
      fontFamily: F, fontSize: '11px', color: '#a080c0'
    }).setOrigin(0.5).setDepth(402));

    // Bottone CONTINUA (Endless)
    const btnContinue = G(this.add.rectangle(width / 2 - 110, height / 2 + 35, 200, 54, 0x1a1a10)
      .setStrokeStyle(2, 0xe8b84b).setInteractive({ useHandCursor: true }).setDepth(401));
    G(this.add.text(width / 2 - 110, height / 2 + 22, '\u267E CONTINUA', {
      fontFamily: F, fontSize: '15px', color: '#e8b84b', fontStyle: '700'
    }).setOrigin(0.5).setDepth(402));
    G(this.add.text(width / 2 - 110, height / 2 + 42, '(Endless Mode)', {
      fontFamily: F, fontSize: '10px', color: '#a08040'
    }).setOrigin(0.5).setDepth(402));

    btnContinue.on('pointerover', () => btnContinue.setFillStyle(0x3a3a10));
    btnContinue.on('pointerout',  () => btnContinue.setFillStyle(0x1a1a10));
    btnContinue.on('pointerdown', () => {
      endlessGroup.getChildren().forEach(c => c.destroy());
      endlessGroup.destroy(true);
      this._activateEndlessMode();
    });

    // Bottone TERMINA LA RUN
    const btnEnd = G(this.add.rectangle(width / 2 + 110, height / 2 + 35, 200, 54, 0x100a0a)
      .setStrokeStyle(2, 0x888898).setInteractive({ useHandCursor: true }).setDepth(401));
    G(this.add.text(width / 2 + 110, height / 2 + 22, 'TERMINA', {
      fontFamily: F, fontSize: '15px', color: '#888898', fontStyle: '700'
    }).setOrigin(0.5).setDepth(402));
    G(this.add.text(width / 2 + 110, height / 2 + 42, 'la run dopo il boss', {
      fontFamily: F, fontSize: '10px', color: '#666670'
    }).setOrigin(0.5).setDepth(402));

    btnEnd.on('pointerover', () => btnEnd.setFillStyle(0x2a2222));
    btnEnd.on('pointerout',  () => btnEnd.setFillStyle(0x100a0a));
    btnEnd.on('pointerdown', () => {
      endlessGroup.getChildren().forEach(c => c.destroy());
      endlessGroup.destroy(true);
      SaveManager.saveRun(this.runData);
    });
  }

  /**
   * Attiva la modalità Endless:
   * - Cambia il boss attuale in 'elite' (non termina la run quando sconfitto)
   * - Genera 5 nuovi piani con difficoltà crescente
   * - Appende i nuovi piani alla mappa
   * - Imposta i flag endlessMode e endlessDepth
   */
  _activateEndlessMode() {
    const map = this.runData.map;
    const totalFloors = map.floors.length;
    const bossFloorIdx = totalFloors - 1;

    // Cambia il boss attuale in 'elite' — CombatScene non terminerà la run
    const bossFloor = map.floors[bossFloorIdx];
    bossFloor.forEach(node => {
      if (node.type === 'boss') node.type = 'elite';
    });

    // Aggiorna i flag endless
    this.runData.endlessMode = true;
    this.runData.endlessDepth = (this.runData.endlessDepth || 0) + 1;
    const difficulty = Math.min(10, this.runData.endlessDepth * 2 + 1);

    // Genera i nuovi piani
    const partial = MapGenerator.generateEndlessFloors(5, 4, difficulty);
    const offset = totalFloors; // I nuovi floor partono da questo indice

    // Aggiusta gli id e floor dei nuovi nodi
    partial.floors.forEach((floor, fi) => {
      floor.forEach(node => {
        node.floor = offset + fi;
        node.id = `${offset + fi}-${node.col}`;
      });
      map.floors.push(floor);
    });

    // Aggiusta le connessioni del partial (offset floor index)
    partial.connections.forEach(conn => {
      map.connections.push({
        from: { floor: offset + conn.from.floor, col: conn.from.col },
        to:   { floor: offset + conn.to.floor,   col: conn.to.col   }
      });
    });

    // Connetti l'ultimo nodo del vecchio boss floor al primo nodo dei nuovi piani
    bossFloor.forEach((node, ci) => {
      const newFirstFloor = map.floors[offset];
      const targetIdx = Math.round((ci / Math.max(bossFloor.length - 1, 1)) * (newFirstFloor.length - 1));
      MapGenerator.addConnection(map, bossFloorIdx, ci, offset, targetIdx);
    });

    // Aggiungi condizioni di piano per i nuovi piani
    if (!map.floorConditions) map.floorConditions = [];
    for (let fi = offset; fi < map.floors.length; fi++) {
      if (fi === map.floors.length - 1) {
        map.floorConditions.push(null); // boss — nessuna condizione
      } else if (Math.random() < 0.50) { // più condizioni in endless
        if (FLOOR_CONDITIONS && FLOOR_CONDITIONS.length > 0) {
          map.floorConditions.push(FLOOR_CONDITIONS[Math.floor(Math.random() * FLOOR_CONDITIONS.length)]);
        } else {
          map.floorConditions.push(null);
        }
      } else {
        map.floorConditions.push(null);
      }
    }

    SaveManager.saveRun(this.runData);
    this.scene.restart({ runData: this.runData });
  }

  // ============================================================
  // TASK 1 — Tutorial primo avvio
  // ============================================================

  _maybeShowTutorial() {
    const tutorialKey = 'cardRoguelike_tutorialDone';
    if (localStorage.getItem(tutorialKey)) return;

    const stats = SaveManager.getStats();
    if (stats.totalRuns > 0 || stats.victories > 0) {
      localStorage.setItem(tutorialKey, '1');
      return;
    }

    this._showTutorial();
  }

  _showTutorial() {
    const { width, height } = this.scale;
    const tutorialKey = 'cardRoguelike_tutorialDone';
    let currentStep = 0;

    const steps = [
      {
        highlightX: width / 2, highlightY: 35,
        highlightW: width, highlightH: 70,
        text: "Qui trovi i tuoi HP, oro e reliquie. Tienili d'occhio durante la run.",
      },
      {
        highlightX: width / 2, highlightY: height / 2,
        highlightW: width - 160, highlightH: height - 160,
        text: "Clicca sui nodi raggiungibili (luminosi) per avanzare.\n\u2694\uFE0F combattimento  \uD83D\uDFE1 elite  \uD83D\uDFE3 evento  \uD83D\uDED2 shop  \uD83D\uDFE2 riposo  \uD83D\uDC80 boss",
      },
      {
        highlightX: width - 60, highlightY: 52,
        highlightW: 140, highlightH: 26,
        text: 'Clicca MAZZO per vedere tutte le tue carte. Pi\u00F9 carte forti = pi\u00F9 chance di sopravvivere.',
      },
      {
        highlightX: null,
        text: 'Sei pronto! Costruisci il tuo mazzo e sconfiggi il boss. Buona fortuna!',
        isFinal: true,
      },
    ];

    const tutGroup = this.add.group();
    const G = (obj) => { tutGroup.add(obj); return obj; };

    const render = () => {
      tutGroup.getChildren().slice().forEach(c => c.destroy());
      tutGroup.clear(true, true);

      const step = steps[currentStep];

      G(this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
        .setDepth(300).setInteractive());

      if (step.highlightX !== null) {
        G(this.add.rectangle(step.highlightX, step.highlightY, step.highlightW, step.highlightH, 0xffffff, 0.08)
          .setStrokeStyle(2.5, 0xe8b84b, 0.9).setDepth(301));
      }

      const panelY = height - 100;
      G(this.add.rectangle(width / 2, panelY, 560, 90, C.bgPanel, 0.97)
        .setStrokeStyle(2, C.borderGold).setDepth(302));

      G(this.add.text(width / 2, panelY - 20, step.text, {
        fontFamily: F, fontSize: '12px', color: '#f4e4c8',
        align: 'center', wordWrap: { width: 500 }
      }).setOrigin(0.5).setDepth(303));

      G(this.add.text(width / 2 + 240, panelY - 38, `${currentStep + 1}/4`, {
        fontFamily: F, fontSize: '11px', color: '#a08060', fontStyle: '700'
      }).setOrigin(1, 0.5).setDepth(303));

      if (step.isFinal) {
        const startBtn = G(this.add.rectangle(width / 2, panelY + 30, 210, 32, 0x3a2a08)
          .setStrokeStyle(2, 0xe8b84b).setInteractive({ useHandCursor: true }).setDepth(302));
        G(this.add.text(width / 2, panelY + 30, "INIZIA L'AVVENTURA", {
          fontFamily: F, fontSize: '12px', color: '#e8b84b', fontStyle: '700'
        }).setOrigin(0.5).setDepth(303));

        startBtn.on('pointerover', () => startBtn.setFillStyle(0x5a4a10));
        startBtn.on('pointerout',  () => startBtn.setFillStyle(0x3a2a08));
        startBtn.on('pointerdown', () => {
          localStorage.setItem(tutorialKey, '1');
          tutGroup.getChildren().slice().forEach(c => c.destroy());
          tutGroup.clear(true, true);
        });
      } else {
        const nextBtn = G(this.add.rectangle(width / 2 + 80, panelY + 30, 120, 28, 0x3a2a08)
          .setStrokeStyle(1.5, 0xe8b84b).setInteractive({ useHandCursor: true }).setDepth(302));
        G(this.add.text(width / 2 + 80, panelY + 30, 'AVANTI \u2192', {
          fontFamily: F, fontSize: '11px', color: '#e8b84b', fontStyle: '700'
        }).setOrigin(0.5).setDepth(303));

        nextBtn.on('pointerover', () => nextBtn.setFillStyle(0x5a4a10));
        nextBtn.on('pointerout',  () => nextBtn.setFillStyle(0x3a2a08));
        nextBtn.on('pointerdown', () => {
          currentStep++;
          render();
        });

        const skipBtn = G(this.add.rectangle(width / 2 - 80, panelY + 30, 100, 28, 0x1e1e28)
          .setStrokeStyle(1.5, 0x555560).setInteractive({ useHandCursor: true }).setDepth(302));
        G(this.add.text(width / 2 - 80, panelY + 30, 'SALTA', {
          fontFamily: F, fontSize: '11px', color: '#888898'
        }).setOrigin(0.5).setDepth(303));

        skipBtn.on('pointerover', () => skipBtn.setFillStyle(0x2e2e3a));
        skipBtn.on('pointerout',  () => skipBtn.setFillStyle(0x1e1e28));
        skipBtn.on('pointerdown', () => {
          localStorage.setItem(tutorialKey, '1');
          tutGroup.getChildren().slice().forEach(c => c.destroy());
          tutGroup.clear(true, true);
        });
      }
    };

    render();
  }
}
