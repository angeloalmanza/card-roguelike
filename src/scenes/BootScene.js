import Phaser from 'phaser';
import { SoundManager } from '../managers/SoundManager.js';
import { LocaleManager } from '../managers/LocaleManager.js';

const T = {
  it: {
    caricamento: 'Caricamento...',
  },
  en: {
    caricamento: 'Loading...',
  },
};

/**
 * BootScene — Genera texture con stile moderno e carica asset audio.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const { width, height } = this.scale;
    const lang = LocaleManager.getLang();
    const t = k => (T[lang] || T.it)[k] ?? T.it[k];
    this.add.text(width / 2, height / 2, t('caricamento'), {
      fontFamily: 'Inter, sans-serif',
      fontSize: '22px',
      color: '#8c8c96'
    }).setOrigin(0.5);

    // Audio procedurale via Web Audio API — nessun file da caricare.
    // SoundManager è disponibile come singleton importabile da qualsiasi scena.

    // Dungeon backgrounds
    ['bg-menu', 'bg-map', 'bg-combat', 'bg-combat-elite', 'bg-combat-boss',
     'bg-reward', 'bg-classselect', 'bg-secondary'].forEach(key => {
      this.load.image(key, `assets/backgrounds/${key}.png`);
    });

    // Card assets (layered image approach)
    const cardTypes = ['attack', 'defend', 'skill', 'curse'];
    cardTypes.forEach(type => {
      this.load.image(`card-bg-${type}`,     `assets/cards/bg-${type}.png`);
      this.load.image(`card-border-${type}`, `assets/cards/border-${type}.png`);
      this.load.image(`card-textbox-${type}`,`assets/cards/textbox-${type}.png`);
      this.load.image(`card-gem-${type}`,    `assets/cards/gem-${type}.png`);
    });
    this.load.image('card-banner', 'assets/cards/banner.png');

    // Card type icons (dark RPG style)
    this.load.image('icon-attack', 'assets/icons/icon-attack.png');
    this.load.image('icon-defend', 'assets/icons/icon-defend.png');
    this.load.image('icon-skill',  'assets/icons/icon-skill.png');
    this.load.image('icon-curse',  'assets/icons/icon-curse.png');

    // Map node icons
    this.load.image('node-combat', 'assets/icons/node-combat.png');
    this.load.image('node-elite',  'assets/icons/node-elite.png');
    this.load.image('node-boss',   'assets/icons/node-boss.png');
    this.load.image('node-event',  'assets/icons/node-event.png');
    this.load.image('node-shop',   'assets/icons/node-shop.png');
    this.load.image('node-rest',   'assets/icons/node-rest.png');

    // HUD icons
    this.load.image('icon-heart',  'assets/icons/icon-heart.png');
    this.load.image('icon-gold',   'assets/icons/icon-gold.png');
    this.load.image('icon-might',  'assets/icons/icon-might.png');
    this.load.image('icon-poison', 'assets/icons/icon-poison.png');
    this.load.image('icon-potion', 'assets/icons/icon-potion.png');
    this.load.image('icon-broken', 'assets/icons/icon-broken.png');
    this.load.image('icon-luck',   'assets/icons/icon-luck.png');

    // Relic icons
    ['ironRing','redPotion','whetstone','shield','boots','healingHerb','poisonRing',
     'ironWill','luckyCharm','warHorn','energyCrystal','vampireFang','thornArmor',
     'warDrum','frostArmor','bloodPact','venomFang','battleScarred','energyOrb',
     'crown','demonHeart','infinityGauntlet','dragonScale','ancientTome',
     'berserkerHeart','fireAmulet','healingStone','thunderMask','poisonVial',
     'hunterTooth','bloodGem','warTrophy','killStreak','warriorCrest',
     'berserkerRage','shadowCloak','poisonedBlade','alchemistFlask','explosiveMixture',
    ].forEach(id => {
      this.load.image(`relic-${id}`, `assets/relics/${id}.png`);
    });

    // Potion icons
    this.load.image('potion-health',   'assets/potions/potion-red.png');
    this.load.image('potion-block',    'assets/potions/potion-blue.png');
    this.load.image('potion-strength', 'assets/potions/potion-yellow.png');
    this.load.image('potion-energy',   'assets/potions/potion-green.png');

    // Enemy sprites (pixel art portraits)
    [
      'enemy-slime', 'enemy-skeleton', 'enemy-goblin', 'enemy-bat',
      'enemy-spider', 'enemy-mushroom', 'enemy-witch', 'enemy-zombie',
      'enemy-troll', 'enemy-wraith', 'enemy-golem', 'enemy-darkKnight',
      'enemy-lich', 'enemy-necromancer', 'enemy-berserker',
      'enemy-lichKing', 'enemy-dragon', 'enemy-demonLord',
      'enemy-stonGolem', 'enemy-ancientVampire', 'enemy-poisonWitch',
    ].forEach(key => {
      this.load.image(key, `assets/enemies/${key}.png`);
    });
  }

  create() {
    // Rende SoundManager accessibile tramite Phaser registry (opzionale)
    this.game.registry.set('soundManager', SoundManager);
    this.createCardTextures();

    // Cursore personalizzato dorato
    const cur = document.createElement('canvas');
    cur.width = 20; cur.height = 20;
    const cx = cur.getContext('2d');
    cx.strokeStyle = '#c9a84c';
    cx.fillStyle = '#0a0c10';
    cx.lineWidth = 1.5;
    cx.beginPath();
    cx.moveTo(3, 1); cx.lineTo(3, 15);
    cx.lineTo(7, 11); cx.lineTo(10, 17);
    cx.lineTo(12, 16); cx.lineTo(9, 10);
    cx.lineTo(14, 10); cx.closePath();
    cx.fill(); cx.stroke();
    document.body.style.cursor = `url(${cur.toDataURL()}) 3 1, default`;

    this.scene.start('MainMenu');
  }

  createCardTextures() {
    const w = 150;
    const h = 200;

    // Attacco — pergamena con bordo cremisi
    this.buildCard('card-attack', w, h, {
      border: 0xb02020,
      borderBright: 0xe05050,
      base: 0xf0dca0,
      lighter: 0xfff4d8,
      artBg: 0xe0c478,
    });

    // Difesa — pergamena con bordo blu reale
    this.buildCard('card-defend', w, h, {
      border: 0x2050a0,
      borderBright: 0x5080d0,
      base: 0xf0dca0,
      lighter: 0xfff4d8,
      artBg: 0xd8c878,
    });

    // Skill — pergamena con bordo verde foresta
    this.buildCard('card-skill', w, h, {
      border: 0x226622,
      borderBright: 0x4a9a4a,
      base: 0xf0dca0,
      lighter: 0xfff4d8,
      artBg: 0xd8cc78,
    });

    // Maledizione — pergamena corrotta, scura
    this.buildCard('card-curse', w, h, {
      border: 0x6a1a8a,
      borderBright: 0xaa55cc,
      base: 0x2a1a3a,
      lighter: 0x3a2a4a,
      artBg: 0x1e1028,
    });
  }

  buildCard(key, w, h, c) {
    const g = this.make.graphics();
    const isDark = c.base < 0x888888; // carte maledizione hanno base scura

    // Ombra
    g.fillStyle(0x000000, 0.4);
    g.fillRoundedRect(4, 4, w, h, 8);

    // Base carta
    g.fillStyle(c.base);
    g.fillRoundedRect(0, 0, w, h, 8);

    // Highlight superiore
    g.fillStyle(c.lighter, isDark ? 0.2 : 0.5);
    g.fillRoundedRect(0, 0, w, h * 0.45, { tl: 8, tr: 8, bl: 0, br: 0 });

    // Tocco di luce diagonale
    g.fillStyle(0xffffff, isDark ? 0.04 : 0.12);
    g.fillTriangle(w * 0.08, 0, w * 0.55, 0, w * 0.08, h * 0.38);

    // Bordo esterno tipo colorato
    g.lineStyle(3, c.border, 0.9);
    g.strokeRoundedRect(0, 0, w, h, 8);

    // Bordo interno sottile
    g.lineStyle(1, c.border, isDark ? 0.3 : 0.2);
    g.strokeRoundedRect(5, 5, w - 10, h - 10, 5);

    // Area arte
    g.fillStyle(c.artBg, 0.85);
    g.fillRoundedRect(8, 14, w - 16, 74, 5);
    g.lineStyle(1.5, c.border, 0.5);
    g.strokeRoundedRect(8, 14, w - 16, 74, 5);

    // Separatore
    g.lineStyle(1, c.border, 0.6);
    g.lineBetween(14, 94, w - 14, 94);

    // Area testo — leggermente diversa dalla base
    g.fillStyle(isDark ? 0x1a0a2a : 0xfef8ec, 0.4);
    g.fillRoundedRect(8, 100, w - 16, 90, 5);

    // Righe di carta (effetto pergamena)
    if (!isDark) {
      g.lineStyle(1, 0x8b6030, 0.07);
      for (let ly = 108; ly < 188; ly += 9) {
        g.lineBetween(12, ly, w - 12, ly);
      }
    }

    // Cerchio costo — pieno del colore tipo
    g.fillStyle(0x000000, 0.5);
    g.fillCircle(23, 23, 17);
    g.fillStyle(c.border, 1);
    g.fillCircle(22, 22, 15);
    g.lineStyle(1.5, c.borderBright, 0.6);
    g.strokeCircle(22, 22, 15);
    // Highlight sul cerchio costo
    g.fillStyle(0xffffff, 0.25);
    g.fillCircle(18, 18, 5);

    g.generateTexture(key, w + 4, h + 4);
    g.destroy();
  }

  createCardIcons() {
    // Attack — spada medievale (scura, su pergamena)
    this._drawIcon('icon-attack', 36, 36, (g, cx, cy) => {
      // Lama
      g.fillStyle(0x5a3a1a, 1);
      g.fillTriangle(cx, cy - 15, cx - 4, cy + 4, cx + 4, cy + 4);
      // Riflesso lama
      g.fillStyle(0x8a6030, 0.6);
      g.fillTriangle(cx, cy - 15, cx - 1, cy + 4, cx + 2, cy + 4);
      // Guardia
      g.fillStyle(0x3a2a0a, 1);
      g.fillRect(cx - 9, cy + 3, 18, 4);
      g.fillStyle(0x7a5a1a, 0.8);
      g.fillRect(cx - 7, cy + 3, 5, 4);
      // Impugnatura
      g.fillStyle(0x5a3a1a, 1);
      g.fillRect(cx - 3, cy + 7, 6, 9);
      // Pomolo
      g.fillStyle(0x3a2a0a, 1);
      g.fillCircle(cx, cy + 17, 3.5);
    });

    // Defend — scudo araldico
    this._drawIcon('icon-defend', 36, 36, (g, cx, cy) => {
      // Scudo base
      g.fillStyle(0x2050a0, 1);
      g.fillTriangle(cx - 11, cy - 12, cx + 11, cy - 12, cx, cy + 14);
      g.fillRect(cx - 11, cy - 12, 22, 18);
      // Bordo scudo
      g.lineStyle(2, 0x102050, 1);
      g.strokeRect(cx - 11, cy - 12, 22, 18);
      g.lineBetween(cx - 11, cy + 6, cx, cy + 14);
      g.lineBetween(cx + 11, cy + 6, cx, cy + 14);
      // Croce araldica
      g.fillStyle(0xd4a820, 1);
      g.fillRect(cx - 1.5, cy - 10, 3, 22);
      g.fillRect(cx - 9, cy - 3, 18, 3);
      // Highlight
      g.fillStyle(0xffffff, 0.2);
      g.fillRect(cx - 9, cy - 10, 5, 12);
    });

    // Skill — cristallo magico
    this._drawIcon('icon-skill', 36, 36, (g, cx, cy) => {
      // Cristallo
      g.fillStyle(0x226622, 1);
      g.fillTriangle(cx, cy - 15, cx - 7, cy + 2, cx + 7, cy + 2);
      g.fillTriangle(cx, cy + 14, cx - 7, cy + 2, cx + 7, cy + 2);
      g.fillStyle(0x4a9a4a, 0.7);
      g.fillTriangle(cx, cy - 15, cx - 2, cy + 2, cx + 5, cy + 2);
      // Riflessi
      g.fillStyle(0xaaffaa, 0.5);
      g.fillTriangle(cx - 2, cy - 12, cx - 5, cy, cx, cy - 4);
      // Centro brillante
      g.fillStyle(0xd4ffd4, 0.8);
      g.fillCircle(cx, cy, 3.5);
    });

    // Curse — teschio arcano
    this._drawIcon('icon-curse', 36, 36, (g, cx, cy) => {
      // Cranio
      g.fillStyle(0x8833aa, 0.95);
      g.fillCircle(cx, cy - 4, 10);
      g.fillRect(cx - 7, cy + 4, 14, 7);
      // Occhi cavi
      g.fillStyle(0x0a0010, 1);
      g.fillCircle(cx - 4, cy - 5, 3.5);
      g.fillCircle(cx + 4, cy - 5, 3.5);
      // Pupille viola brillanti
      g.fillStyle(0xee88ff, 0.9);
      g.fillCircle(cx - 4, cy - 5, 1.5);
      g.fillCircle(cx + 4, cy - 5, 1.5);
      // Naso
      g.fillStyle(0x0a0010, 1);
      g.fillTriangle(cx, cy - 1, cx - 2, cy + 2, cx + 2, cy + 2);
      // Denti
      g.fillStyle(0xcc88ff, 0.8);
      g.fillRect(cx - 5, cy + 4, 3, 5);
      g.fillRect(cx - 1, cy + 4, 3, 5);
      g.fillRect(cx + 3, cy + 4, 3, 5);
      // Glow esterno
      g.lineStyle(1.5, 0xcc88ff, 0.4);
      g.strokeCircle(cx, cy - 4, 10);
    });
  }

  createNodeIcons() {
    // Combat — crossed swords
    this._drawIcon('node-combat', 28, 28, (g, cx, cy) => {
      g.lineStyle(3, 0xc83028, 1.0);
      g.lineBetween(cx - 8, cy - 8, cx + 8, cy + 8);
      g.lineBetween(cx + 8, cy - 8, cx - 8, cy + 8);
      g.fillStyle(0xff6644, 1);
      g.fillCircle(cx - 8, cy - 8, 2);
      g.fillCircle(cx + 8, cy - 8, 2);
    });

    // Elite — skull
    this._drawIcon('node-elite', 28, 28, (g, cx, cy) => {
      g.fillStyle(0xd4a820, 1);
      g.fillCircle(cx, cy - 2, 8);
      g.fillRect(cx - 5, cy + 3, 10, 5);
      g.fillStyle(0x1a1206);
      g.fillCircle(cx - 3, cy - 3, 2);
      g.fillCircle(cx + 3, cy - 3, 2);
      g.fillTriangle(cx, cy + 1, cx - 1.5, cy - 1, cx + 1.5, cy - 1);
      g.lineStyle(1, 0x1a1206);
      g.lineBetween(cx - 2, cy + 3, cx - 2, cy + 7);
      g.lineBetween(cx, cy + 3, cx, cy + 7);
      g.lineBetween(cx + 2, cy + 3, cx + 2, cy + 7);
    });

    // Event — question mark
    this._drawIcon('node-event', 28, 28, (g, cx, cy) => {
      g.fillStyle(0xc8a050, 1);
      g.fillRoundedRect(cx - 5, cy - 10, 10, 6, 3);
      g.fillRect(cx + 1, cy - 6, 4, 6);
      g.fillRect(cx - 1, cy - 2, 4, 5);
      g.fillRect(cx - 1, cy + 5, 4, 4);
    });

    // Shop — coin
    this._drawIcon('node-shop', 28, 28, (g, cx, cy) => {
      g.fillStyle(0xe8b84b, 0.9);
      g.fillCircle(cx, cy, 9);
      g.lineStyle(1.5, 0xc49a30);
      g.strokeCircle(cx, cy, 9);
      g.strokeCircle(cx, cy, 6);
      g.fillStyle(0x9a7520);
      g.fillRect(cx - 1, cy - 6, 2.5, 12);
    });

    // Rest — campfire
    this._drawIcon('node-rest', 28, 28, (g, cx, cy) => {
      g.fillStyle(0xe85d5d);
      g.fillTriangle(cx, cy - 10, cx - 6, cy + 3, cx + 6, cy + 3);
      g.fillStyle(0xe8b84b);
      g.fillTriangle(cx, cy - 5, cx - 3, cy + 3, cx + 3, cy + 3);
      g.lineStyle(3, 0x4a4a56);
      g.lineBetween(cx - 8, cy + 6, cx + 4, cy + 10);
      g.lineBetween(cx + 8, cy + 6, cx - 4, cy + 10);
    });

    // Boss — crown
    this._drawIcon('node-boss', 32, 32, (g, cx, cy) => {
      g.fillStyle(0xe8b84b, 0.95);
      g.fillRect(cx - 10, cy - 2, 20, 10);
      g.fillTriangle(cx - 10, cy - 2, cx - 6, cy - 2, cx - 10, cy - 10);
      g.fillTriangle(cx - 3, cy - 2, cx + 3, cy - 2, cx, cy - 12);
      g.fillTriangle(cx + 6, cy - 2, cx + 10, cy - 2, cx + 10, cy - 10);
      g.fillStyle(0xe85d5d);
      g.fillCircle(cx, cy + 2, 2.5);
      g.fillStyle(0x5b9bd5);
      g.fillCircle(cx - 6, cy + 2, 2);
      g.fillCircle(cx + 6, cy + 2, 2);
      g.fillStyle(0xffffff, 0.4);
      g.fillCircle(cx, cy - 10, 2);
    });
  }

  _drawIcon(key, w, h, drawFn) {
    const g = this.make.graphics();
    drawFn(g, w / 2, h / 2);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
