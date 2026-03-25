import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { CombatManager } from '../managers/CombatManager.js';
import { DeckManager } from '../managers/DeckManager.js';
import { CardSprite } from '../ui/CardSprite.js';
import { STARTER_DECK } from '../data/cards.js';
import { ENEMIES, getRandomEnemy } from '../data/enemies.js';
import { RelicManager } from '../managers/RelicManager.js';
import { SaveManager } from '../managers/SaveManager.js';
import { MusicManager } from '../managers/MusicManager.js';
import { FLOOR_CONDITIONS } from '../data/floorConditions.js';
import { AchievementManager } from '../managers/AchievementManager.js';
import { PerkManager } from '../managers/PerkManager.js';
import { AscensionManager } from '../managers/AscensionManager.js';
import { CLASSES } from '../data/classes.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider, CARD_COLORS } from '../ui/Theme.js';
import { LocaleManager } from '../managers/LocaleManager.js';

const F = FONT_BODY;

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  it: {
    // Top bar
    energia:          'ENERGIA',
    mazzo:            'MAZZO',
    scarti:           'SCARTI',
    turno:            'Turno',
    fineTurno:        'FINE TURNO',
    spazio:           '[SPAZIO]',
    // Pile overlay
    mazzoPesca:       'Mazzo di Pesca',
    pilaScartati:     'Pila degli Scarti',
    nessunaCarta:     'Nessuna carta',
    chiudi:           'CHIUDI',
    carte:            'carte',
    // Legend overlay
    guidaEffetti:     'Guida agli Effetti',
    atkDesc:          'ATK  Attacco',
    atkBody:          'Infligge danni al nemico. Trascina sulla zona nemico.',
    defDesc:          'DEF  Difesa / Blocco',
    defBody:          'Riduce i danni subiti questo turno. Si azzera ad ogni turno.',
    strDesc:          'STR  Forza',
    strBody:          'Ogni punto di forza aggiunge +1 danno ad ogni attacco.',
    enDesc:           'EN   Energia',
    enBody:           'Serve per giocare le carte. Si ripristina ad ogni turno.',
    slancioDesc:      '⚡ Slancio',
    slancioBody:      'Ogni carta attacco giocata di fila aumenta lo Slancio. Il danno dell\'attacco successivo viene moltiplicato per lo Slancio. Si azzera se giochi una carta non-attacco.',
    caricaDesc:       '💥 Carica',
    caricaBody:       'Alcune carte accumlano punti Carica. Clicca il badge CARICA per attivarlo: il prossimo attacco infligge +5 danni per ogni punto accumulato.',
    velenoDesc:       '☠ Veleno',
    velenoBody:       'Infligge N danni a fine turno al nemico, poi si riduce di 1.',
    bruciDesc:        '🔥 Bruciatura',
    bruciBody:        'Infligge N danni fissi a fine turno al nemico, poi si azzera.',
    stordDesc:        '💫 Stordimento',
    stordBody:        'Il nemico salta il prossimo turno.',
    malDesc:          '☠  Maledizione',
    malBody:          'Carta negativa nel mazzo. Ha effetti dannosi quando giocata.',
    pescaDesc:        'Pesca carte',
    pescaBody:        'Pesca carte extra dal mazzo di pesca nella mano.',
    colpiDesc:        'Colpi multipli',
    colpiBody:        'La carta colpisce più volte. Il blocco nemico riduce ogni colpo.',
    relicDesc:        'Reliquie',
    relicBody:        'Bonus passivi raccolti da elite e boss. Visibili in alto a destra.',
    // Pause menu
    inPausa:          'IN PAUSA',
    riprendi:         '▶ RIPRENDI',
    impostazioni:     '⚙ IMPOSTAZIONI',
    abbandonaRun:     '✕ ABBANDONA RUN',
    pausaBadge:       '⏸ PAUSA',
    // Abandon confirm
    abbandonareTitolo: 'Abbandonare la run?',
    abbandonareSub:   'I progressi andranno persi.',
    si:               'SÌ',
    no:               'NO',
    // Victory / Defeat
    vittoria:         'VITTORIA!',
    sconfitta:        'SCONFITTA',
    sconfittoLabel:   'SCONFITTO!',
    clickContinua:    'Clicca per continuare',
    clickRicomincia:  'Clicca per ricominciare',
    runFinita:        'La tua run è finita.',
    // Intent
    stordito:         '💫 STORDITO',
    difende:          (name, val) => `${name} si difende! +${val} blocco`,
    siCura:           (name, val) => `${name} si cura! +${val} HP`,
    eStordito:        (name) => `${name} è stordito! Salta il turno.`,
    danniBloccati:    (val) => `${val} danni bloccati!`,
    indebolito:       (name) => `${name} è indebolito! -30% danni.`,
    defIntent:        (val) => `DEF  +${val} blocco`,
    healIntent:       (val) => `💚 Cura +${val}`,
    statoIntent:      'Stato',
    // Card messages
    energiaInsufficiente: 'Energia insufficiente!',
    abilitaUsata:     'Abilità già usata!',
    // Status messages
    slancioTooltip:   '⚡ Attacchi consecutivi moltiplicano il danno.\nSi azzera giocando carte non-attacco.',
    caricaTooltip:    '💥 Clicca per attivare: il prossimo attacco\ninfligge +5 danni per ogni punto accumulato.',
    slancioLabel:     'SLANCIO',
    caricaLabel:      'CARICA',
    // Class ability
    abilitaGiaUsata:  '✓ USATA',
    // showCardEffect
    blocco:           'Blocco',
    forza:            'Forza',
    forzaTurno:       (val) => `+${val} Forza (turno)`,
    forzaPerm:        (val) => `+${val} Forza`,
    maledizione:      '☠ Maledizione!',
    scartaCarta:      (n) => `Scarta ${n} carta!`,
    nemicoBlocko:     (n) => `Nemico +${n} blocco`,
    // Piano
    pianoLabel:       (n) => `Piano ${n}`,
    // Achievement
    achievementLabel: '🏆 Achievement sbloccato!',
    // relicTooltip actions
    relicClicca:      '[Clicca per attivare]',
    relicUsata:       '[Già usata]',
    stackInfo:        (n) => `\nStack: ${n}`,
    // useClassAbility messages
    gridoDiGuerra:    '⚔️ Grido di Guerra! +10 Blocco, +2 Forza',
    ombra:            '🗡️ Ombra! Pescate 3 carte.',
    fialaTossica:     '⚗️ Fiala Tossica! +8 Veleno al nemico.',
    // relic ability
    relicGiaUsata:    (name) => `${name} già usata!`,
    relicMsg:         (name, msgs) => `${name}: ${msgs}`,
    // Victory gold
    oro:              'oro',
    // enemy turn messages
    danniRitorno:     (n) => `${n} danni di ritorno!`,
    // status inline
    veleno:           'Veleno',
    bruciatura:       'Bruciatura',
    stordimento:      'Stordito!',
    debolezza:        'Deb',
    danni:            'danni',
    carte:            'carte',
    piano:            'piano',
  },
  en: {
    // Top bar
    energia:          'ENERGY',
    mazzo:            'DECK',
    scarti:           'DISCARD',
    turno:            'Turn',
    fineTurno:        'END TURN',
    spazio:           '[SPACE]',
    // Pile overlay
    mazzoPesca:       'Draw Pile',
    pilaScartati:     'Discard Pile',
    nessunaCarta:     'No cards',
    chiudi:           'CLOSE',
    carte:            'cards',
    // Legend overlay
    guidaEffetti:     'Effects Guide',
    atkDesc:          'ATK  Attack',
    atkBody:          'Deals damage to the enemy. Drag onto the enemy zone.',
    defDesc:          'DEF  Defense / Block',
    defBody:          'Reduces damage taken this turn. Resets each turn.',
    strDesc:          'STR  Strength',
    strBody:          'Each Strength point adds +1 damage to every attack.',
    enDesc:           'EN   Energy',
    enBody:           'Used to play cards. Restored at the start of each turn.',
    slancioDesc:      '⚡ Momentum',
    slancioBody:      'Each consecutive attack card played increases Momentum. The next attack\'s damage is multiplied by Momentum. Resets if you play a non-attack card.',
    caricaDesc:       '💥 Charge',
    caricaBody:       'Some cards accumulate Charge points. Click the CHARGE badge to activate it: the next attack deals +5 damage per accumulated point.',
    velenoDesc:       '☠ Poison',
    velenoBody:       'Deals N damage at end of turn to the enemy, then decreases by 1.',
    bruciDesc:        '🔥 Burn',
    bruciBody:        'Deals N fixed damage at end of turn to the enemy, then clears.',
    stordDesc:        '💫 Stun',
    stordBody:        'The enemy skips their next turn.',
    malDesc:          '☠  Curse',
    malBody:          'A negative card in your deck. Has harmful effects when played.',
    pescaDesc:        'Draw cards',
    pescaBody:        'Draw extra cards from the draw pile into your hand.',
    colpiDesc:        'Multiple hits',
    colpiBody:        'The card hits multiple times. Enemy block reduces each hit.',
    relicDesc:        'Relics',
    relicBody:        'Passive bonuses collected from elites and bosses. Visible top-right.',
    // Pause menu
    inPausa:          'PAUSED',
    riprendi:         '▶ RESUME',
    impostazioni:     '⚙ SETTINGS',
    abbandonaRun:     '✕ ABANDON RUN',
    pausaBadge:       '⏸ PAUSE',
    // Abandon confirm
    abbandonareTitolo: 'Abandon the run?',
    abbandonareSub:   'Your progress will be lost.',
    si:               'YES',
    no:               'NO',
    // Victory / Defeat
    vittoria:         'VICTORY!',
    sconfitta:        'DEFEAT',
    sconfittoLabel:   'DEFEATED!',
    clickContinua:    'Click to continue',
    clickRicomincia:  'Click to restart',
    runFinita:        'Your run is over.',
    // Intent
    stordito:         '💫 STUNNED',
    difende:          (name, val) => `${name} defends! +${val} block`,
    siCura:           (name, val) => `${name} heals! +${val} HP`,
    eStordito:        (name) => `${name} is stunned! Skips turn.`,
    danniBloccati:    (val) => `${val} damage blocked!`,
    indebolito:       (name) => `${name} is weakened! -30% damage.`,
    defIntent:        (val) => `DEF  +${val} block`,
    healIntent:       (val) => `💚 Heal +${val}`,
    statoIntent:      'Status',
    // Card messages
    energiaInsufficiente: 'Not enough energy!',
    abilitaUsata:     'Ability already used!',
    // Status messages
    slancioTooltip:   '⚡ Consecutive attacks multiply damage.\nResets when you play a non-attack card.',
    caricaTooltip:    '💥 Click to activate: next attack\ndeals +5 damage per accumulated point.',
    slancioLabel:     'MOMENTUM',
    caricaLabel:      'CHARGE',
    // Class ability
    abilitaGiaUsata:  '✓ USED',
    // showCardEffect
    blocco:           'Block',
    forza:            'Strength',
    forzaTurno:       (val) => `+${val} Strength (turn)`,
    forzaPerm:        (val) => `+${val} Strength`,
    maledizione:      '☠ Curse!',
    scartaCarta:      (n) => `Discard ${n} card!`,
    nemicoBlocko:     (n) => `Enemy +${n} block`,
    // Piano
    pianoLabel:       (n) => `Floor ${n}`,
    // Achievement
    achievementLabel: '🏆 Achievement unlocked!',
    // relicTooltip actions
    relicClicca:      '[Click to activate]',
    relicUsata:       '[Already used]',
    stackInfo:        (n) => `\nStack: ${n}`,
    // useClassAbility messages
    gridoDiGuerra:    '⚔️ War Cry! +10 Block, +2 Strength',
    ombra:            '🗡️ Shadow! Draw 3 cards.',
    fialaTossica:     '⚗️ Toxic Vial! +8 Poison to enemy.',
    // relic ability
    relicGiaUsata:    (name) => `${name} already used!`,
    relicMsg:         (name, msgs) => `${name}: ${msgs}`,
    // Victory gold
    oro:              'gold',
    // enemy turn messages
    danniRitorno:     (n) => `${n} return damage!`,
    // status inline
    veleno:           'Poison',
    bruciatura:       'Burn',
    stordimento:      'Stunned!',
    debolezza:        'Wk',
    danni:            'damage',
    carte:            'cards',
    piano:            'floor',
  },
};

/**
 * CombatScene — Layout moderno.
 *
 * Layout (720px):
 *   0-48     Top bar (energy, deck, discard, turn, end turn)
 *  55-260    Zona nemico (pannello centrato)
 * 260-280    Messaggio combattimento
 * 285-330    HP giocatore
 * 340-700    Mano di carte (baseY ~550)
 */
export class CombatScene extends Phaser.Scene {
  constructor() {
    super('Combat');
  }

  init(data) {
    this.runData = data.runData || null;
    this.nodeType = data.nodeType || 'combat';
  }

  create() {
    const { width, height } = this.scale;
    this.isAnimating = false;
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // ── i18n ────────────────────────────────────────────────────────────────
    const lang = LocaleManager.getLang();
    const t = k => (T[lang] || T.it)[k] ?? T.it[k];
    this._t = t;

    MusicManager.start(this, 0.12);
    MusicManager.setVolume(this, 0.12);

    // --- LOGIC ---
    this.potionGroup = null;
    this.damageTakenThisCombat = 0;
    this.player = new Player();
    // Reset class ability per ogni combattimento
    if (this.runData) this.runData.classAbilityUsed = false;
    if (this.runData) {
      this.player.hp = this.runData.playerHp;
      this.player.maxHp = this.runData.maxHp;
    }

    const enemyData = this.pickEnemy();
    this.enemy = new Enemy(enemyData);

    // Applica modificatori di ascensione al nemico
    const ascMods = this.runData && this.runData.ascensionMods;
    if (ascMods) {
      let hpMult = ascMods.enemyHpMultiplier || 1.0;
      // L10: boss hanno 50% HP extra aggiuntivo
      if (ascMods.bossHpMultiplier && this.nodeType === 'boss') {
        hpMult = hpMult * ascMods.bossHpMultiplier;
      }
      if (hpMult !== 1.0) {
        this.enemy.hp = Math.floor(this.enemy.hp * hpMult);
        this.enemy.maxHp = this.enemy.hp;
      }
      if (ascMods.enemyDamageBonus) {
        this.enemy.damage = (this.enemy.damage || 0) + ascMods.enemyDamageBonus;
        // Applica anche agli attacchi nella pattern se esiste
        if (this.enemy.pattern) {
          this.enemy.pattern = this.enemy.pattern.map(p =>
            p.type === 'attack' ? { ...p, value: (p.value || 0) + ascMods.enemyDamageBonus } : p
          );
        }
        if (this.enemy.phases) {
          this.enemy.phases = this.enemy.phases.map(ph => ({
            ...ph,
            pattern: ph.pattern.map(p =>
              p.type === 'attack' ? { ...p, value: (p.value || 0) + ascMods.enemyDamageBonus } : p
            )
          }));
        }
      }
    }

    this.combat = new CombatManager(this.player, this.enemy);
    this.deck = new DeckManager();
    const deckToUse = (this.runData && this.runData.deckCards) ? this.runData.deckCards : STARTER_DECK;
    this.deck.initDeck(deckToUse);

    const relicsList = (this.runData && this.runData.relics) ? this.runData.relics : [];
    const relicStacksData = (this.runData && this.runData.relicStacks) ? this.runData.relicStacks : {};
    this.relicManager = new RelicManager(relicsList, relicStacksData);
    this.relicManager.resetCombat();

    const passives = this.relicManager.getPassiveEffects();
    this.player.maxEnergy += passives.maxEnergy;
    this.player.energy = this.player.maxEnergy;
    this.extraDraw = passives.drawCards;

    // Applica bonus hunterTooth (danni extra per nemici uccisi nella run)
    const hunterTooth = this.relicManager.relics.find(r => r.id === 'hunterTooth');
    if (hunterTooth) {
      const htStacks = this.relicManager.getStack('hunterTooth');
      this.player.combatStrength += htStacks;
      this.player.strength += htStacks;
    }

    // Applica bonus killStreak (+3 danno ogni 2 uccisioni)
    const killStreak = this.relicManager.relics.find(r => r.id === 'killStreak');
    if (killStreak) {
      const ksStacks = this.relicManager.getStack('killStreak');
      const ksThreshold = killStreak.stackThreshold || 2;
      const ksGrant = Math.floor(ksStacks / ksThreshold) * (killStreak.effect.bonusDamagePerAttack || 3);
      this.player.combatStrength += ksGrant;
      this.player.strength += ksGrant;
    }

    const combatStartEffects = this.relicManager.trigger('onCombatStart');
    this._pendingCombatStartPoison = 0;
    combatStartEffects.forEach(({ effect }) => {
      if (effect.heal) this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.heal);
      if (effect.block) this.player.addBlock(effect.block);
      if (effect.strength) this.player.strength += effect.strength;
      if (effect.applyEnemyPoison) this._pendingCombatStartPoison += effect.applyEnemyPoison;
    });

    // Condizione di piano
    this.floorCondition = null;
    this.extraCost = 0;
    if (this.runData && this.runData.currentFloorCondition) {
      const fcData = this.runData.currentFloorCondition;
      const fcId = typeof fcData === 'string' ? fcData : fcData.id;
      this.floorCondition = FLOOR_CONDITIONS.find(c => c.id === fcId) || null;
      if (this.floorCondition) {
        if (this.floorCondition.effect === 'cardCostIncrease') {
          this.extraCost = this.floorCondition.value;
          this.deck.drawPile.forEach(c => { c.cost = Math.max(0, c.cost + this.extraCost); });
        }
        if (this.floorCondition.effect === 'startDamage') {
          this.player.hp = Math.max(1, this.player.hp - this.floorCondition.value);
        }
      }
    }
    this.caricaActive = false;

    // --- UI ---
    this.createBackground();
    this.createTopBar();
    this.createEnemyPanel(enemyData);
    this.createPlayerUI();
    this.setupDragAndDrop();

    // Combat message
    this.combatMessage = this.add.text(width / 2, 270, '', {
      fontFamily: FONT_UI, fontSize: '15px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setAlpha(0).setDepth(80);

    this.handSprites = [];


    this.createRelicDisplay();
    this.createPotionUI();
    this.createSlancioUI();
    this.createCaricaUI();
    this.createFloorConditionUI();
    this.createClassAbilityUI();

    // ── Pausa ────────────────────────────────────────────────────────────
    this._paused = false;
    this._pauseGroup = [];
    this.input.keyboard.on('keydown-ESC', () => this._togglePause());

    // ── Scorciatoie tastiera ─────────────────────────────────────────────
    // Spazio = Fine Turno
    this.input.keyboard.on('keydown-SPACE', () => {
      if (!this.isAnimating && !this._paused) this.endTurn();
    });

    // Tasti 1-5 = gioca carta nella posizione corrispondente
    ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'].forEach((key, i) => {
      this.input.keyboard.on(`keydown-${key}`, () => {
        if (this.isAnimating || this._paused) return;
        const sprites = this.handSprites;
        if (sprites?.[i]?.active) this.playCard(sprites[i]);
      });
    });

    this.startTurn();
  }

  pickEnemy() {
    let base;
    switch (this.nodeType) {
      case 'elite': base = getRandomEnemy('elite'); break;
      case 'boss':  base = getRandomEnemy('boss');  break;
      default:      base = getRandomEnemy('normal'); break;
    }

    const floor = (this.runData && this.runData.currentFloor > 0) ? this.runData.currentFloor : 0;
    if (floor === 0) return base;

    const s = 1 + floor * 0.07; // +7% per piano
    const scalePattern = p => p.type === 'attack'
      ? { ...p, value: Math.round(p.value * s) }
      : { ...p };

    const scaled = { ...base, hp: Math.round(base.hp * s) };
    if (base.pattern) scaled.pattern = base.pattern.map(scalePattern);
    if (base.phases) {
      scaled.phases = base.phases.map(ph => ({
        ...ph,
        hpThreshold: Math.round(ph.hpThreshold * s),
        pattern: ph.pattern.map(scalePattern)
      }));
    }
    return scaled;
  }

  // =============================================
  // BACKGROUND
  // =============================================

  createBackground() {
    const { width, height } = this.scale;

    // Sfondo principale
    this.add.rectangle(width / 2, height / 2, width, height, C.bg).setDepth(-2);

    const g = this.add.graphics().setDepth(-1);

    // Zona nemico — pannello scuro
    g.fillStyle(C.bgPanelDark, 0.85);
    g.fillRect(0, 52, width, 250);

    // Zona giocatore — leggermente più chiara
    g.fillStyle(C.bgPanel, 0.5);
    g.fillRect(0, 275, width, height - 275);

    // Vignette laterali
    g.fillGradientStyle(C.bg, C.bg, C.bg, C.bg, 0.8, 0, 0, 0.8);
    g.fillRect(0, 0, 70, height);
    g.fillGradientStyle(C.bg, C.bg, C.bg, C.bg, 0, 0.8, 0.8, 0);
    g.fillRect(width - 70, 0, 70, height);

    // Linea separatrice dorata
    drawDivider(this, width / 2, 270, width - 80, { color: C.borderGoldDim, alpha: 0.6, depth: 0 });
    drawDivider(this, width / 2, 272, width - 80, { color: C.borderGold, alpha: 0.15, depth: 0 });
  }

  // =============================================
  // TOP BAR
  // =============================================

  createTopBar() {
    const { width } = this.scale;
    const barY = 26;

    // Header background
    this.add.rectangle(width / 2, 0, width, 52, C.bgHeader).setOrigin(0.5, 0).setDepth(70);
    // Bordo inferiore sottile
    this.add.rectangle(width / 2, 52, width, 1, C.borderSubtle).setOrigin(0.5, 0).setDepth(70);

    // ── Energia: cerchi dorati ────────────────────────────────────────────
    this._energyDots = [];
    this._energyDotsX = 38;
    this._energyDotsY = barY;
    // I cerchi sono disegnati in updateEnergyUI()
    this.energyText = this.add.text(this._energyDotsX, barY + 1, '', {
      fontFamily: FONT_UI, fontSize: '15px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(72).setVisible(false); // manteniamo per compatibilità

    // Label ENERGIA
    this.add.text(this._energyDotsX, barY + 18, this._t('energia'), {
      fontFamily: FONT_UI, fontSize: '7px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      fontStyle: '700', letterSpacing: 1
    }).setOrigin(0.5).setDepth(71);

    // Container per i cerchi energia (disegnati su Graphics)
    this._energyGfx = this.add.graphics().setDepth(72);
    this._energyLabel = this.add.text(this._energyDotsX, barY + 1, '', {
      fontFamily: FONT_UI, fontSize: '13px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(73);

    // ── Mazzo di pesca ────────────────────────────────────────────────────
    const drawPileBg = this.add.rectangle(110, barY, 54, 32, C.bgPanel)
      .setStrokeStyle(1, C.borderGoldDim).setDepth(71)
      .setInteractive({ useHandCursor: true });

    this.add.text(96, barY - 7, '🃏', { fontSize: '11px' }).setDepth(72);
    this.drawPileText = this.add.text(116, barY - 1, '', {
      fontFamily: FONT_UI, fontSize: '15px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0, 0.5).setDepth(72);
    this.add.text(110, barY + 14, this._t('mazzo'), {
      fontFamily: FONT_UI, fontSize: '7px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      fontStyle: '700', letterSpacing: 1
    }).setOrigin(0.5).setDepth(71);

    drawPileBg.on('pointerover', () => drawPileBg.setStrokeStyle(1, C.borderGold));
    drawPileBg.on('pointerout',  () => drawPileBg.setStrokeStyle(1, C.borderGoldDim));
    drawPileBg.on('pointerdown', () => this.showPileOverlay(this._t('mazzoPesca'), this.deck.drawPile));

    // ── Pila scarti ───────────────────────────────────────────────────────
    const discardPileBg = this.add.rectangle(175, barY, 54, 32, C.bgPanel)
      .setStrokeStyle(1, C.borderGoldDim).setDepth(71)
      .setInteractive({ useHandCursor: true });

    this.add.text(161, barY - 7, '🗑', { fontSize: '11px' }).setDepth(72);
    this.discardPileText = this.add.text(181, barY - 1, '', {
      fontFamily: FONT_UI, fontSize: '15px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0, 0.5).setDepth(72);
    this.add.text(175, barY + 14, this._t('scarti'), {
      fontFamily: FONT_UI, fontSize: '7px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      fontStyle: '700', letterSpacing: 1
    }).setOrigin(0.5).setDepth(71);

    discardPileBg.on('pointerover', () => discardPileBg.setStrokeStyle(1, C.borderGold));
    discardPileBg.on('pointerout',  () => discardPileBg.setStrokeStyle(1, C.borderGoldDim));
    discardPileBg.on('pointerdown', () => this.showPileOverlay(this._t('pilaScartati'), this.deck.discardPile));

    // ── Guida ─────────────────────────────────────────────────────────────
    const legendBg = this.add.rectangle(240, barY, 32, 32, C.bgPanel)
      .setStrokeStyle(1, C.borderGoldDim).setDepth(71)
      .setInteractive({ useHandCursor: true });
    this.add.text(240, barY, '?', {
      fontFamily: FONT_TITLE, fontSize: '15px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(72);

    legendBg.on('pointerover', () => legendBg.setStrokeStyle(1, C.borderGold));
    legendBg.on('pointerout',  () => legendBg.setStrokeStyle(1, C.borderGoldDim));
    legendBg.on('pointerdown', () => this.showLegendOverlay());

    // ── Turno (centrato) ──────────────────────────────────────────────────
    this.turnText = this.add.text(width / 2, barY, `${this._t('turno')} 1`, {
      fontFamily: FONT_UI, fontSize: '13px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      letterSpacing: 2
    }).setOrigin(0.5).setDepth(71);

    // ── Fine turno — createButton ─────────────────────────────────────────
    const { bg: etBg, txt: etTxt } = createButton(
      this, width - 80, barY, 120, 34, this._t('fineTurno'),
      {
        fill: C.btnPrimary,
        hover: C.btnHover,
        border: C.borderGold,
        borderWidth: 2,
        radius: 6,
        depth: 71,
        fontSize: '11px',
        font: FONT_UI,
        fontStyle: '700',
        letterSpacing: 2,
        onDown: () => { if (!this.isAnimating) this.endTurn(); }
      }
    );
    this.endTurnBtn = etBg;
    // Compatibilità: mantieni setFillStyle per dragend, ecc.
    this.endTurnBtn._fill = C.btnPrimary;

    // Hint tastiera [SPAZIO]
    this.add.text(width - 80, barY + 22, this._t('spazio'), {
      fontFamily: FONT_UI, fontSize: '9px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
    }).setOrigin(0.5).setDepth(70);

    this.updateEnergyUI();
    this.updateDeckCounters();
  }

  // =============================================
  // POZIONI UI (M2C)
  // =============================================

  createPotionUI() {
    if (this.potionGroup) {
      this.potionGroup.destroy(true);
      this.potionGroup = null;
    }
    this.potionGroup = this.add.group();

    const potions = (this.runData && this.runData.potions) ? this.runData.potions : [];
    if (potions.length === 0) return;

    const barY = 24;
    const startX = 310;

    potions.forEach((potion, i) => {
      const x = startX + i * 40;
      const bg = this.add.circle(x, barY, 16, C.bgPanel, 0.9)
        .setStrokeStyle(1.5, C.mana)
        .setInteractive({ useHandCursor: true })
        .setDepth(71);
      const emoji = this.add.text(x, barY, potion.emoji, { fontSize: '14px' })
        .setOrigin(0.5).setDepth(72);

      this.potionGroup.add(bg);
      this.potionGroup.add(emoji);

      bg.on('pointerover', () => {
        bg.setStrokeStyle(1.5, C.borderGold);
        this.showMessage(LocaleManager.name(potion), '#5b9bd5');
      });
      bg.on('pointerout', () => bg.setStrokeStyle(1.5, C.mana));
      bg.on('pointerdown', () => {
        if (!this.isAnimating) this.usePotion(potion, i);
      });
    });
  }

  usePotion(potion, index) {
    if (this._paused) return;
    const effect = potion.effect;
    const msgs = [];

    if (effect.heal) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.heal);
      msgs.push(`+${effect.heal} HP`);
    }
    if (effect.block) {
      this.player.addBlock(effect.block);
      msgs.push(`+${effect.block} ${this._t('blocco')}`);
    }
    if (effect.strength) {
      this.player.strength += effect.strength;
      msgs.push(`+${effect.strength} ${this._t('forza')}`);
    }
    if (effect.energy) {
      this.player.energy += effect.energy;
      msgs.push(`+${effect.energy} ${this._t('energia')}`);
    }

    if (msgs.length > 0) this.showMessage(msgs.join('  '), '#5b9bd5');

    if (this.runData) this.runData.potions.splice(index, 1);

    this.createPotionUI();
    this.updatePlayerUI();
    this.updateEnergyUI();
    this.refreshHandPlayability();
  }

  createRelicDisplay() {
    const relics = this.relicManager.relics;
    if (relics.length === 0) return;

    const { width } = this.scale;
    const startX = width - 160;
    const y = 24;

    this.relicBgs = {};
    this.relicStackTexts = {};

    relics.forEach((relic, i) => {
      const x = startX - i * 34;
      const isActivatable = relic.activatable === true;
      const isStacking = relic.stacking === true;

      const strokeColor = isActivatable ? C.borderGold : C.bgPanelDark;
      const bg = this.add.circle(x, y, 14, C.bgPanel, 0.9)
        .setStrokeStyle(1.5, strokeColor)
        .setInteractive({ useHandCursor: isActivatable }).setDepth(71);
      this.add.text(x, y, relic.emoji, { fontSize: '13px' }).setOrigin(0.5).setDepth(72);

      this.relicBgs[relic.id] = bg;

      // Mostra stack count per reliquie a stack
      if (isStacking) {
        const stack = this.relicManager.getStack(relic.id);
        const stackText = this.add.text(x + 9, y - 10, stack > 0 ? String(stack) : '', {
          fontFamily: F, fontSize: '9px', color: '#e8b84b', fontStyle: '700'
        }).setDepth(73);
        this.relicStackTexts[relic.id] = stackText;
      }

      if (isActivatable) {
        bg.on('pointerdown', () => {
          if (!this.isAnimating) this.activateRelicAbility(relic);
        });
        bg.on('pointerover', () => {
          if (this.relicManager.isRelicCharged(relic.id)) bg.setFillStyle(0x6a4e20, 0.9);
          this.relicTooltip?.destroy();
          this.relicTooltipBg?.destroy();
          const charged = this.relicManager.isRelicCharged(relic.id);
          const extra = charged ? `\n${this._t('relicClicca')}` : `\n${this._t('relicUsata')}`;
          this.relicTooltipBg = this.add.rectangle(x - 65, y + 34, 190, 56, C.bgPanel, 0.97)
            .setStrokeStyle(1, C.borderGold).setDepth(150);
          this.relicTooltip = this.add.text(x - 65, y + 34, `${LocaleManager.name(relic)}\n${LocaleManager.desc(relic)}${extra}`, {
            fontFamily: F, fontSize: '9px', color: '#e2e2e6', align: 'center', wordWrap: { width: 175 }
          }).setOrigin(0.5).setDepth(151);
        });
        bg.on('pointerout', () => {
          bg.setFillStyle(C.bgPanel, 0.9);
          this.relicTooltip?.destroy();
          this.relicTooltipBg?.destroy();
        });
      } else {
        bg.on('pointerover', () => {
          this.relicTooltip?.destroy();
          this.relicTooltipBg?.destroy();
          const stackInfo = isStacking ? this._t('stackInfo')(this.relicManager.getStack(relic.id)) : '';
          this.relicTooltipBg = this.add.rectangle(x - 65, y + 32, 190, 48, C.bgPanel, 0.97)
            .setStrokeStyle(1, C.bgPanelDark).setDepth(150);
          this.relicTooltip = this.add.text(x - 65, y + 32, `${LocaleManager.name(relic)}\n${LocaleManager.desc(relic)}${stackInfo}`, {
            fontFamily: F, fontSize: '10px', color: '#e2e2e6', align: 'center', wordWrap: { width: 175 }
          }).setOrigin(0.5).setDepth(151);
        });
        bg.on('pointerout', () => {
          this.relicTooltip?.destroy();
          this.relicTooltipBg?.destroy();
        });
      }
    });
  }

  updateRelicUI(relicId) {
    const relic = this.relicManager.relics.find(r => r.id === relicId);
    if (!relic) return;
    const bg = this.relicBgs && this.relicBgs[relicId];
    if (!bg) return;

    if (relic.activatable) {
      const charged = this.relicManager.isRelicCharged(relicId);
      bg.setStrokeStyle(1.5, charged ? C.borderGold : 0x555555);
      bg.setFillStyle(charged ? C.bgPanel : C.bgPanelDark, 0.9);
    }
    if (relic.stacking && this.relicStackTexts && this.relicStackTexts[relicId]) {
      const stack = this.relicManager.getStack(relicId);
      this.relicStackTexts[relicId].setText(stack > 0 ? String(stack) : '');
    }
  }

  activateRelicAbility(relic) {
    if (!this.relicManager.isRelicCharged(relic.id)) {
      this.showMessage(this._t('relicGiaUsata')(LocaleManager.name(relic)), '#8c8c96');
      return;
    }

    const effect = this.relicManager.activateRelic(relic.id);
    if (!effect) return;

    const msgs = [];

    if (effect.directDamage && this.enemy.isAlive()) {
      const dmgResult = this.enemy.takeDamage(effect.directDamage);
      msgs.push(`${effect.directDamage} ${this._t('danni')}`);
      this.shakeEnemySprite();
      this.cameras.main.shake(120, 0.008);
      const dmgText = this.add.text(this.enemyCenter.x, this.enemyCenter.y - 25, `-${effect.directDamage}`, {
        fontFamily: FONT_UI, fontSize: '26px',
        color: '#' + C.hp.toString(16).padStart(6, '0'),
        fontStyle: '900', stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5).setDepth(100);
      this.tweens.add({
        targets: dmgText, y: this.enemyCenter.y - 70, alpha: 0,
        duration: 900, ease: 'Power2', onComplete: () => dmgText.destroy()
      });
      if (dmgResult.phaseTransition) this.onPhaseTransition(LocaleManager.name(dmgResult.phaseTransition));
      if (!this.enemy.isAlive()) {
        const killEffects = this.relicManager.trigger('onKill');
        killEffects.forEach(({ effect: ke }) => {
          if (ke.heal) this.player.hp = Math.min(this.player.maxHp, this.player.hp + ke.heal);
          if (ke.gold && this.runData) this.runData.gold = (this.runData.gold || 0) + ke.gold;
          if (ke.giveEnergy) { this.player.energy += ke.giveEnergy; this.updateEnergyUI(); }
        });
        this.updateEnemyUI();
        this.updateRelicUI(relic.id);
        this.time.delayedCall(500, () => this.showVictory());
        return;
      }
    }

    if (effect.heal) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.heal);
      msgs.push(`+${effect.heal} HP`);
      this.showPlayerEffect(`+${effect.heal} HP`, '#5dc77a');
      this.playSound('heal');
    }

    if (effect.applyStun && this.enemy.isAlive()) {
      this.enemy.statusEffects.stun = effect.applyStun;
      msgs.push(`💫 ${this._t('stordimento')}`);
      this.updateStatusUI();
      this.updateIntentDisplay();
    }

    if (effect.applyPoison && this.enemy.isAlive()) {
      this.enemy.statusEffects.poison = Math.max(0, (this.enemy.statusEffects.poison || 0) + effect.applyPoison);
      msgs.push(`🟢 ${this._t('veleno')} ${effect.applyPoison}`);
      this.updateStatusUI();
    }

    if (msgs.length > 0) this.showMessage(this._t('relicMsg')(LocaleManager.name(relic), msgs.join('  ')), '#e8b84b');

    this.updateEnemyUI();
    this.updatePlayerUI();
    this.updateRelicUI(relic.id);
  }

  // =============================================
  // SLANCIO UI
  // =============================================

  createSlancioUI() {
    const y = 24;
    const x = 450;
    this.slancioBg = this.add.rectangle(x, y, 82, 28, 0x2a0f0f, 0.9)
      .setStrokeStyle(1, C.bgPanelDark).setDepth(71).setAlpha(0)
      .setInteractive({ useHandCursor: false });
    this.slancioLabel = this.add.text(x - 28, y, this._t('slancioLabel'), {
      fontFamily: F, fontSize: '7px', color: '#e85d5d', fontStyle: '700', letterSpacing: 1
    }).setOrigin(0, 0.5).setDepth(72).setAlpha(0);
    this.slancioText = this.add.text(x + 22, y, '', {
      fontFamily: F, fontSize: '15px', color: '#e85d5d', fontStyle: '900'
    }).setOrigin(0.5, 0.5).setDepth(72).setAlpha(0);

    this.slancioBg.on('pointerover', () => {
      this.relicTooltip?.destroy();
      this.relicTooltipBg?.destroy();
      this.relicTooltipBg = this.add.rectangle(x, y + 38, 230, 44, C.bgPanelDark, 0.97)
        .setStrokeStyle(1, C.hp).setDepth(150);
      this.relicTooltip = this.add.text(x, y + 38, this._t('slancioTooltip'), {
        fontFamily: F, fontSize: '10px', color: '#e87070', align: 'center', wordWrap: { width: 215 }
      }).setOrigin(0.5).setDepth(151);
    });
    this.slancioBg.on('pointerout', () => {
      this.relicTooltip?.destroy();
      this.relicTooltipBg?.destroy();
      this.relicTooltip = null;
      this.relicTooltipBg = null;
    });
  }

  updateSlancioUI() {
    const count = this.combat.slancioCount;
    if (count > 0) {
      this.slancioBg.setAlpha(1);
      this.slancioLabel.setAlpha(1);
      this.slancioText.setText(String(count)).setAlpha(1);
    } else {
      this.slancioBg.setAlpha(0);
      this.slancioLabel.setAlpha(0);
      this.slancioText.setAlpha(0);
    }
  }

  // =============================================
  // CARICA UI
  // =============================================

  createCaricaUI() {
    const y = 24;
    const x = 560;
    this.caricaBg = this.add.rectangle(x, y, 82, 28, C.defendDark, 0.9)
      .setStrokeStyle(1, C.bgPanelDark).setDepth(71).setAlpha(0)
      .setInteractive({ useHandCursor: true });
    this.caricaLabel = this.add.text(x - 22, y, this._t('caricaLabel'), {
      fontFamily: F, fontSize: '7px', color: '#7bb5e8', fontStyle: '700', letterSpacing: 1
    }).setOrigin(0, 0.5).setDepth(72).setAlpha(0);
    this.caricaCountText = this.add.text(x + 22, y, '0', {
      fontFamily: F, fontSize: '15px', color: '#7bb5e8', fontStyle: '900'
    }).setOrigin(0.5, 0.5).setDepth(72).setAlpha(0);

    this.caricaBg.on('pointerdown', () => {
      if (this.combat.caricaPoints > 0 && !this.isAnimating) {
        this.caricaActive = !this.caricaActive;
        this.updateCaricaUI();
      }
    });
    this.caricaBg.on('pointerover', () => {
      if (this.combat.caricaPoints > 0) this.caricaBg.setFillStyle(C.btnHover, 0.9);
      this.relicTooltip?.destroy();
      this.relicTooltipBg?.destroy();
      this.relicTooltipBg = this.add.rectangle(x, y + 38, 230, 44, C.bgPanelDark, 0.97)
        .setStrokeStyle(1, C.mana).setDepth(150);
      this.relicTooltip = this.add.text(x, y + 38, this._t('caricaTooltip'), {
        fontFamily: F, fontSize: '10px', color: '#7bb5e8', align: 'center', wordWrap: { width: 215 }
      }).setOrigin(0.5).setDepth(151);
    });
    this.caricaBg.on('pointerout', () => {
      this.caricaBg.setFillStyle(this.caricaActive ? C.btnHover : C.defendDark, 0.9);
      this.relicTooltip?.destroy();
      this.relicTooltipBg?.destroy();
      this.relicTooltip = null;
      this.relicTooltipBg = null;
    });
  }

  updateCaricaUI() {
    const points = this.combat.caricaPoints;
    if (points > 0 || this.caricaActive) {
      this.caricaBg.setAlpha(1);
      this.caricaLabel.setAlpha(1);
      this.caricaCountText.setAlpha(1).setText(String(points));
      if (this.caricaActive) {
        this.caricaBg.setStrokeStyle(2, C.mana);
        this.caricaLabel.setColor('#aaddff');
        this.caricaCountText.setColor('#aaddff');
      } else {
        this.caricaBg.setStrokeStyle(1, C.bgPanelDark);
        this.caricaLabel.setColor('#7bb5e8');
        this.caricaCountText.setColor('#7bb5e8');
      }
    } else {
      this.caricaBg.setAlpha(0);
      this.caricaLabel.setAlpha(0);
      this.caricaCountText.setAlpha(0);
      this.caricaActive = false;
    }
  }

  // =============================================
  // CLASS ABILITY UI
  // =============================================

  createClassAbilityUI() {
    // Trova dati classe
    const classId = this.runData && this.runData.classId;
    const classData = classId ? CLASSES.find(c => c.id === classId) : null;
    if (!classData || !classData.classAbility) return;

    const ability = classData.classAbility;
    const { width } = this.scale;
    const btnX = width - 80;
    const btnY = 60;

    this.classAbilityBg = this.add.rectangle(btnX, btnY, 120, 30, C.btnSuccess, 0.95)
      .setStrokeStyle(2, C.skill)
      .setInteractive({ useHandCursor: true })
      .setDepth(71);

    this.classAbilityLabel = this.add.text(btnX, btnY, `${ability.emoji} ${LocaleManager.name(ability)}`, {
      fontFamily: F, fontSize: '10px', color: '#86efac', fontStyle: '700'
    }).setOrigin(0.5).setDepth(72);

    // Descrizione rimossa dal bottone — appare come tooltip su hover
    this.classAbilitySubLabel = { setText: () => {}, setColor: () => {}, setVisible: () => {} }; // stub

    let _ttBg = null, _ttTxt = null;
    this.classAbilityBg.on('pointerover', () => {
      if (!this.runData || !this.runData.classAbilityUsed)
        this.classAbilityBg.setFillStyle(0x2a4a2a, 0.95);
      const tx = btnX, ty = btnY + 24;
      _ttBg = this.add.graphics().setDepth(200);
      _ttBg.fillStyle(C.bgPanel, 0.97);
      _ttBg.fillRoundedRect(tx - 95, ty, 190, 36, 6);
      _ttBg.lineStyle(1, C.skill, 0.8);
      _ttBg.strokeRoundedRect(tx - 95, ty, 190, 36, 6);
      _ttTxt = this.add.text(tx, ty + 18, LocaleManager.desc(ability), {
        fontFamily: F, fontSize: '9px', color: '#6ee7b7',
        wordWrap: { width: 180 }, align: 'center'
      }).setOrigin(0.5).setDepth(201);
    });
    this.classAbilityBg.on('pointerout', () => {
      const used = this.runData && this.runData.classAbilityUsed;
      this.classAbilityBg.setFillStyle(used ? 0x1a1a1a : C.btnSuccess, 0.95);
      _ttBg?.destroy(); _ttTxt?.destroy();
    });
    this.classAbilityBg.on('pointerdown', () => {
      if (!this.isAnimating) this.useClassAbility();
    });

    this.updateClassAbilityUI();
  }

  updateClassAbilityUI() {
    if (!this.classAbilityBg) return;
    const used = this.runData && this.runData.classAbilityUsed;
    if (used) {
      this.classAbilityBg.setStrokeStyle(1, 0x555555);
      this.classAbilityBg.setFillStyle(0x1a1a1a, 0.9);
      this.classAbilityLabel.setColor('#555555').setText(this._t('abilitaGiaUsata'));
    } else {
      this.classAbilityBg.setStrokeStyle(2, C.skill);
      this.classAbilityBg.setFillStyle(C.btnSuccess, 0.95);
      const classId = this.runData && this.runData.classId;
      const classData = classId ? CLASSES.find(c => c.id === classId) : null;
      if (classData && classData.classAbility) {
        const ab = classData.classAbility;
        this.classAbilityLabel.setColor('#86efac').setText(`${ab.emoji} ${LocaleManager.name(ab)}`);
      }
    }
  }

  useClassAbility() {
    if (this._paused) return;
    if (!this.runData || this.runData.classAbilityUsed) {
      this.showMessage(this._t('abilitaUsata'), '#8c8c96');
      return;
    }
    const classId = this.runData.classId;
    this.runData.classAbilityUsed = true;

    if (classId === 'warrior') {
      this.player.addBlock(10);
      this.player.combatStrength += 2;
      this.player.strength += 2;
      this.showMessage(this._t('gridoDiGuerra'), '#86efac');
      this.showPlayerEffect('+10 🛡', '#7bb5e8');
      this.updatePlayerUI();
    } else if (classId === 'rogue') {
      const drawn = this.deck.drawCards(3);
      if (drawn.length > 0) {
        this.createHandSprites(drawn);
        this.updateDeckCounters();
      }
      this.showMessage(this._t('ombra'), '#86efac');
    } else if (classId === 'alchemist') {
      if (this.enemy.isAlive()) {
        this.enemy.statusEffects.poison = (this.enemy.statusEffects.poison || 0) + 8;
        this.updateStatusUI();
        this.showMessage(this._t('fialaTossica'), '#86efac');
      }
    }

    this.updateClassAbilityUI();
  }

  // =============================================
  // FLOOR CONDITION UI
  // =============================================

  createFloorConditionUI() {
    if (!this.floorCondition) return;
    const fc = this.floorCondition;
    const colorStr = '#' + fc.badgeColor.toString(16).padStart(6, '0');
    const fcBg = this.add.rectangle(820, 24, 160, 24, C.bgPanelDark, 0.8)
      .setStrokeStyle(1, fc.badgeColor, 0.6).setDepth(71)
      .setInteractive({ useHandCursor: false });
    this.add.text(820, 24, `${fc.badge} ${LocaleManager.name(fc)}`, {
      fontFamily: F, fontSize: '9px', color: colorStr, fontStyle: '700'
    }).setOrigin(0.5).setDepth(72);

    fcBg.on('pointerover', () => {
      this.relicTooltip?.destroy();
      this.relicTooltipBg?.destroy();
      this.relicTooltipBg = this.add.rectangle(820, 60, 240, 36, C.bgPanelDark, 0.97)
        .setStrokeStyle(1, fc.badgeColor).setDepth(150);
      this.relicTooltip = this.add.text(820, 60, LocaleManager.desc(fc), {
        fontFamily: F, fontSize: '10px', color: colorStr, align: 'center', wordWrap: { width: 225 }
      }).setOrigin(0.5).setDepth(151);
    });
    fcBg.on('pointerout', () => {
      this.relicTooltip?.destroy();
      this.relicTooltipBg?.destroy();
    });
  }

  // =============================================
  // ENEMY PANEL
  // =============================================

  createEnemyPanel(enemyData) {
    const { width } = this.scale;
    const panelX = width / 2;
    const panelY = 165;
    const panelW = 500;
    const panelH = 200;

    // Colore glow per tipo nemico
    const glowColor = this.nodeType === 'boss' ? C.hp : this.nodeType === 'elite' ? C.borderGold : C.mana;
    this.enemyBorderColor = this.nodeType === 'boss' ? C.hp : this.nodeType === 'elite' ? C.borderGold : C.borderSubtle;

    // Glow esterno
    this.add.circle(panelX, panelY, 130, glowColor, 0.06).setDepth(1);
    this.add.circle(panelX, panelY, 85, glowColor, 0.10).setDepth(1);

    // Pannello principale — drawPanel
    this._enemyPanelGfx = drawPanel(this, panelX, panelY, panelW, panelH, {
      radius: 12,
      fill: C.bgPanel,
      border: this.enemyBorderColor,
      borderWidth: 2,
      depth: 2
    });

    // ── Intent display (sopra il pannello) ────────────────────────────────
    const intentY = 68;
    drawPanel(this, panelX, intentY, 260, 28, {
      radius: 6,
      fill: C.bgPanelDark,
      border: C.borderSubtle,
      borderWidth: 1,
      depth: 3
    });
    // Intent border overlay — rectangle per setStrokeStyle compatibilità
    this.intentBg = this.add.rectangle(panelX, intentY, 260, 28, 0x000000, 0)
      .setStrokeStyle(1, C.borderSubtle).setDepth(4);
    this.intentText = this.add.text(panelX, intentY, '', {
      fontFamily: FONT_UI, fontSize: '13px',
      color: '#' + C.hp.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(5);

    // ── Sfondo sprite nemico ──────────────────────────────────────────────
    this.add.circle(panelX, panelY - 42, 34, glowColor, 0.18).setDepth(3);
    this.add.circle(panelX, panelY - 42, 28, C.bgPanelDark, 0.7).setDepth(3);

    // Enemy sprite
    const spriteKey = enemyData.spriteKey || 'enemy-slime';
    const spriteScale = this.nodeType === 'boss' ? 1.3 : this.nodeType === 'elite' ? 0.95 : 0.75;
    this.enemyImg = this.add.image(panelX, panelY - 42, spriteKey)
      .setScale(spriteScale).setOrigin(0.5).setDepth(4);

    // ── Nome nemico (Cinzel) ──────────────────────────────────────────────
    const nameColorHex = this.nodeType === 'boss'
      ? '#' + C.hp.toString(16).padStart(6, '0')
      : this.nodeType === 'elite'
        ? '#' + C.textGoldBright.toString(16).padStart(6, '0')
        : '#' + C.textGoldBright.toString(16).padStart(6, '0');
    this.add.text(panelX, panelY + 10, LocaleManager.name(enemyData), {
      fontFamily: FONT_TITLE, fontSize: '20px', color: nameColorHex, fontStyle: '700'
    }).setOrigin(0.5).setDepth(4);

    // Phase name (M4)
    this.enemyPhaseText = this.add.text(panelX, panelY + 32, '', {
      fontFamily: FONT_UI, fontSize: '9px',
      color: '#' + C.hp.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(4);
    if (this.enemy.phases) {
      this.enemyPhaseText.setText(LocaleManager.name(this.enemy.phases[0]));
    }

    // ── HP bar arrotondata ────────────────────────────────────────────────
    const hpBarW = 160;
    const hpBarH = 14;
    const hpBarY = panelY + 52;

    // Sfondo barra HP
    this._enemyHpBarBgGfx = this.add.graphics().setDepth(4);
    this._enemyHpBarBgGfx.fillStyle(C.hpDark, 1);
    this._enemyHpBarBgGfx.fillRoundedRect(panelX - hpBarW / 2, hpBarY - hpBarH / 2, hpBarW, hpBarH, 6);

    // Barra HP (usiamo rectangle per compatibilità con tween scaleX)
    this.enemyHpBar = this.add.rectangle(panelX - hpBarW / 2, hpBarY, hpBarW, hpBarH, C.hp)
      .setOrigin(0, 0.5).setDepth(5);

    this.enemyHpText = this.add.text(panelX, hpBarY, '', {
      fontFamily: FONT_UI, fontSize: '10px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(6);

    // Block badge (BLK) blu a destra della HP bar
    this.enemyBlockText = this.add.text(panelX + hpBarW / 2 + 30, hpBarY, '', {
      fontFamily: FONT_UI, fontSize: '13px',
      color: '#' + C.mana.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(5);

    // ── Status pills ──────────────────────────────────────────────────────
    const sy = panelY + 76;

    this.statusPoisonBg   = this.add.rectangle(panelX - 56, sy, 54, 20, C.curseDark, 0.9)
      .setStrokeStyle(1, C.curse).setDepth(4);
    this.statusPoisonText = this.add.text(panelX - 56, sy, '', {
      fontFamily: FONT_UI, fontSize: '12px',
      color: '#' + C.curse.toString(16).padStart(6, '0'),
      fontStyle: '700', stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(5);

    this.statusBurnBg   = this.add.rectangle(panelX + 4, sy, 54, 20, 0x3d1000, 0.9)
      .setStrokeStyle(1, C.burn).setDepth(4);
    this.statusBurnText = this.add.text(panelX + 4, sy, '', {
      fontFamily: FONT_UI, fontSize: '12px',
      color: '#' + C.burn.toString(16).padStart(6, '0'),
      fontStyle: '700', stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(5);

    this.statusStunBg   = this.add.rectangle(panelX + 64, sy, 54, 20, 0x2a2000, 0.9)
      .setStrokeStyle(1, C.stun).setDepth(4);
    this.statusStunText = this.add.text(panelX + 64, sy, '', {
      fontFamily: FONT_UI, fontSize: '12px',
      color: '#' + C.stun.toString(16).padStart(6, '0'),
      fontStyle: '700', stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(5);

    // Debolezza
    const sy2 = sy + 24;
    this.statusWeaknessBg   = this.add.rectangle(panelX - 28, sy2, 82, 20, C.curseDark, 0.9)
      .setStrokeStyle(1, 0xa855f7).setDepth(4);
    this.statusWeaknessText = this.add.text(panelX - 28, sy2, '', {
      fontFamily: FONT_UI, fontSize: '11px', color: '#d8b4fe', fontStyle: '700',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(5);

    [this.statusPoisonBg, this.statusBurnBg, this.statusStunBg, this.statusWeaknessBg].forEach(bg => bg.setVisible(false));

    this.enemyCenter = { x: panelX, y: panelY };
    this.enemyBounds = new Phaser.Geom.Rectangle(panelX - 250, panelY - 100, 500, 200);

    this.updateEnemyUI();
    this.updateIntentDisplay();
    this.updateStatusUI();
  }

  // =============================================
  // PLAYER UI (y=285-330)
  // =============================================

  createPlayerUI() {
    const { width } = this.scale;
    const playerY = 312;
    const hpBarW = 300;
    const hpBarH = 18;

    // Label HP a sinistra
    this.add.text(width / 2 - hpBarW / 2 - 8, playerY, '❤', {
      fontSize: '14px'
    }).setOrigin(1, 0.5).setDepth(60);

    // Sfondo barra HP (arrotondata)
    const hpBgGfx = this.add.graphics().setDepth(59);
    hpBgGfx.fillStyle(C.hpDark, 1);
    hpBgGfx.fillRoundedRect(width / 2 - hpBarW / 2, playerY - hpBarH / 2, hpBarW, hpBarH, 7);
    hpBgGfx.lineStyle(1, C.borderSubtle, 1);
    hpBgGfx.strokeRoundedRect(width / 2 - hpBarW / 2, playerY - hpBarH / 2, hpBarW, hpBarH, 7);

    // Barra HP (con origine left per scaleX)
    this.playerHpBar = this.add.rectangle(
      width / 2 - hpBarW / 2, playerY, hpBarW, hpBarH - 2, C.skill
    ).setOrigin(0, 0.5).setDepth(60);

    this.playerHpText = this.add.text(width / 2, playerY, '', {
      fontFamily: FONT_UI, fontSize: '11px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(61);

    // BLK badge blu a sinistra della barra
    this.playerBlockText = this.add.text(width / 2 - hpBarW / 2 - 50, playerY, '', {
      fontFamily: FONT_UI, fontSize: '13px',
      color: '#' + C.mana.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(60);

    // STR badge dorato a destra della barra
    this.playerStrengthText = this.add.text(width / 2 + hpBarW / 2 + 50, playerY, '', {
      fontFamily: FONT_UI, fontSize: '13px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(60);

    // ── Status pills giocatore ────────────────────────────────────────────
    const psy = playerY + 22;

    this.playerStatusPoisonBg   = this.add.rectangle(width / 2 - 36, psy, 54, 18, C.curseDark, 0.9)
      .setStrokeStyle(1, C.curse).setDepth(61);
    this.playerStatusPoisonText = this.add.text(width / 2 - 36, psy, '', {
      fontFamily: FONT_UI, fontSize: '11px',
      color: '#' + C.curse.toString(16).padStart(6, '0'),
      fontStyle: '700', stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(62);

    this.playerStatusBurnBg   = this.add.rectangle(width / 2 + 28, psy, 54, 18, 0x3d1000, 0.9)
      .setStrokeStyle(1, C.burn).setDepth(61);
    this.playerStatusBurnText = this.add.text(width / 2 + 28, psy, '', {
      fontFamily: FONT_UI, fontSize: '11px',
      color: '#' + C.burn.toString(16).padStart(6, '0'),
      fontStyle: '700', stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(62);

    // Corazza badge
    this.playerArmorBg   = this.add.rectangle(width / 2 + 92, psy, 62, 18, C.defendDark, 0.9)
      .setStrokeStyle(1, C.defend).setDepth(61);
    this.playerArmorText = this.add.text(width / 2 + 92, psy, '', {
      fontFamily: FONT_UI, fontSize: '11px',
      color: '#' + C.defend.toString(16).padStart(6, '0'),
      fontStyle: '700', stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(62);

    [this.playerStatusPoisonBg, this.playerStatusBurnBg, this.playerArmorBg].forEach(bg => bg.setVisible(false));

    this.updatePlayerUI();
  }

  // =============================================
  // UI UPDATES
  // =============================================

  updatePlayerUI() {
    const { player } = this;
    const hpPercent = Math.max(0, player.hp / player.maxHp);
    this.tweens.killTweensOf(this.playerHpBar);
    this.tweens.add({ targets: this.playerHpBar, scaleX: hpPercent, duration: 280, ease: 'Power2' });

    if (hpPercent > 0.5) this.playerHpBar.setFillStyle(C.skill);
    else if (hpPercent > 0.25) this.playerHpBar.setFillStyle(C.gold);
    else this.playerHpBar.setFillStyle(C.hp);

    this.playerHpText.setText(`${player.hp} / ${player.maxHp}`);
    this.playerBlockText.setText(player.block > 0 ? `🛡 ${player.block}` : '');
    this.playerStrengthText.setText(player.strength > 0 ? `⚔ +${player.strength}` : '');
  }

  updateEnemyUI() {
    const { enemy } = this;
    const hpPercent = Math.max(0, enemy.hp / enemy.maxHp);
    this.tweens.killTweensOf(this.enemyHpBar);
    this.tweens.add({ targets: this.enemyHpBar, scaleX: hpPercent, duration: 280, ease: 'Power2' });
    this.enemyHpText.setText(`${enemy.hp} / ${enemy.maxHp}`);
    this.enemyBlockText.setText(enemy.block > 0 ? `🛡 ${enemy.block}` : '');
  }

  updateEnergyUI() {
    // Disegna cerchi energia dorati/grigi
    if (this._energyGfx) {
      this._energyGfx.clear();
      const maxE = this.player.maxEnergy;
      const curE = this.player.energy;
      const dotR = 7;
      const spacing = 18;
      const startX = this._energyDotsX - ((maxE - 1) * spacing) / 2;
      for (let i = 0; i < maxE; i++) {
        const dx = startX + i * spacing;
        const dy = this._energyDotsY;
        if (i < curE) {
          this._energyGfx.fillStyle(C.borderGold, 1);
          this._energyGfx.fillCircle(dx, dy, dotR);
          this._energyGfx.lineStyle(1, C.borderBright, 0.8);
          this._energyGfx.strokeCircle(dx, dy, dotR);
        } else {
          this._energyGfx.fillStyle(C.bgPanelDark, 1);
          this._energyGfx.fillCircle(dx, dy, dotR);
          this._energyGfx.lineStyle(1, C.borderGoldDim, 0.6);
          this._energyGfx.strokeCircle(dx, dy, dotR);
        }
      }
    }
    // Testo numerale come fallback (nascosto)
    if (this.energyText) {
      this.energyText.setText(`${this.player.energy}/${this.player.maxEnergy}`);
    }
    this.refreshHandPlayability();
  }

  updateDeckCounters() {
    this.drawPileText.setText(String(this.deck.drawPile.length));
    this.discardPileText.setText(String(this.deck.discardPile.length));
  }

  // M3 — Aggiorna indicatori status nemico e giocatore
  updateStatusUI() {
    if (!this.statusPoisonText) return;
    const se = this.enemy.statusEffects;

    this.statusPoisonBg.setVisible(se.poison > 0);
    this.statusPoisonText.setText(se.poison > 0 ? `☠ ${se.poison}` : '');

    this.statusBurnBg.setVisible(se.burn > 0);
    this.statusBurnText.setText(se.burn > 0 ? `🔥 ${se.burn}` : '');

    this.statusStunBg.setVisible(se.stun > 0);
    this.statusStunText.setText(se.stun > 0 ? `💫 ${se.stun}` : '');

    // Debolezza
    if (this.statusWeaknessText) {
      const w = se.weakness || 0;
      this.statusWeaknessBg.setVisible(w > 0);
      this.statusWeaknessText.setText(w > 0 ? `⬇️ ${this._t('debolezza')} ${w}` : '');
    }

    // Status effect giocatore
    const pse = this.player.statusEffects;
    if (this.playerStatusPoisonText) {
      this.playerStatusPoisonBg.setVisible(pse.poison > 0);
      this.playerStatusPoisonText.setText(pse.poison > 0 ? `☠ ${pse.poison}` : '');
    }
    if (this.playerStatusBurnText) {
      this.playerStatusBurnBg.setVisible(pse.burn > 0);
      this.playerStatusBurnText.setText(pse.burn > 0 ? `🔥 ${pse.burn}` : '');
    }
    // Corazza
    if (this.playerArmorText) {
      const hasArmor = this.player.armor > 0 && this.player.armorTurns > 0;
      this.playerArmorBg.setVisible(hasArmor);
      this.playerArmorText.setText(hasArmor ? `🛡️ +${this.player.armor}` : '');
    }
  }

  updateIntentDisplay() {
    const intent = this.enemy.currentIntent;
    if (!intent) return;

    // M3 — Mostra stordimento se nemico è stordito
    if (this.enemy.statusEffects && this.enemy.statusEffects.stun > 0) {
      this.intentText.setText(this._t('stordito'));
      this.intentText.setColor('#' + C.stun.toString(16).padStart(6, '0'));
      this.intentBg.setStrokeStyle(1, C.stun);
      return;
    }

    if (intent.type === 'attack') {
      let label = `⚔ ${intent.value}`;
      if (intent.applyPoison) label += ` + ☠${intent.applyPoison}`;
      if (intent.applyBurn) label += ` + 🔥${intent.applyBurn}`;
      this.intentText.setText(label);
      this.intentText.setColor('#' + C.hp.toString(16).padStart(6, '0'));
      this.intentBg.setStrokeStyle(1, C.hp);
    } else if (intent.type === 'defend') {
      this.intentText.setText(this._t('defIntent')(intent.value));
      this.intentText.setColor('#' + C.mana.toString(16).padStart(6, '0'));
      this.intentBg.setStrokeStyle(1, C.mana);
    } else if (intent.type === 'heal') {
      this.intentText.setText(this._t('healIntent')(intent.value));
      this.intentText.setColor('#' + C.skill.toString(16).padStart(6, '0'));
      this.intentBg.setStrokeStyle(1, C.skill);
    } else if (intent.type === 'status') {
      const parts = [];
      if (intent.applyPoison) parts.push(`☠ ${this._t('veleno')} ${intent.applyPoison}`);
      if (intent.applyBurn) parts.push(`🔥 ${this._t('bruciatura')} ${intent.applyBurn}`);
      this.intentText.setText(parts.join('  ') || intent.label || this._t('statoIntent'));
      this.intentText.setColor('#' + C.curse.toString(16).padStart(6, '0'));
      this.intentBg.setStrokeStyle(1, C.curse);
    }
  }

  // 1A — Aggiorna giocabilità di tutte le carte in mano
  refreshHandPlayability() {
    if (!this.handSprites) return;
    this.handSprites.forEach(sprite => {
      if (sprite.cardModel && sprite.setPlayable) {
        sprite.setPlayable(sprite.cardModel.canPlay(this.player.energy));
      }
    });
  }

  // =============================================
  // CARD FAN
  // =============================================

  getCardFanPosition(index, total) {
    const { width } = this.scale;
    const centerX = width / 2;
    const baseY = 550;

    const maxWidth = 580;
    const spacing = Math.min(105, maxWidth / Math.max(total, 1));
    const totalWidth = (total - 1) * spacing;
    const startX = centerX - totalWidth / 2;

    const x = startX + index * spacing;

    const maxRot = 0.05 * Math.min(total, 7);
    const t = total > 1 ? (index / (total - 1)) * 2 - 1 : 0;
    const rotation = t * maxRot;
    const arcDrop = t * t * 15;

    return { x, y: baseY + arcDrop, rotation };
  }

  // =============================================
  // GAME LOGIC
  // =============================================

  startTurn() {
    // Apply pending combat-start enemy poison (from relics like alchemistFlask)
    if (this._pendingCombatStartPoison > 0) {
      this.enemy.statusEffects.poison = (this.enemy.statusEffects.poison || 0) + this._pendingCombatStartPoison;
      this._pendingCombatStartPoison = 0;
      this.updateStatusUI();
    }

    let extraDrawFromRelics = 0;
    const turnStartEffects = this.relicManager.trigger('onTurnStart');
    turnStartEffects.forEach(({ relic, effect }) => {
      if (effect.block) this.player.addBlock(effect.block);
      if (effect.strength) this.player.strength += effect.strength;
      if (effect.heal) this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.heal);
      if (effect.incrementEnemyPoison && this.enemy && this.enemy.statusEffects.poison > 0) {
        this.enemy.statusEffects.poison += effect.incrementEnemyPoison;
        this.updateStatusUI();
      }
      if (effect.drawCards) extraDrawFromRelics += effect.drawCards;
      if (effect.applyEnemyBurn && this.enemy && this.enemy.isAlive()) {
        this.enemy.statusEffects.burn = (this.enemy.statusEffects.burn || 0) + effect.applyEnemyBurn;
        this.updateStatusUI();
      }
    });

    // M2C — Applica forza permanente da run (mercenario)
    if (this.runData && this.runData.permanentStrength) {
      this.player.strength += this.runData.permanentStrength;
    }

    // Condizione di piano: energia extra
    if (this.floorCondition?.effect === 'energyPerTurn') {
      this.player.energy = Math.min(this.player.maxEnergy + this.floorCondition.value,
        this.player.energy + this.floorCondition.value);
    }

    // Carte trattenute (retain) dalla mano precedente
    const retainedCount = this.handSprites.length;
    let baseDrawCount = 5 + (this.extraDraw || 0) + extraDrawFromRelics;

    // Condizione di piano: pesca extra
    if (this.floorCondition?.effect === 'extraDraw') {
      baseDrawCount += this.floorCondition.value;
    }

    const drawCount = Math.max(0, baseDrawCount - retainedCount);
    const drawnCards = this.deck.drawCards(drawCount);
    this.createHandSprites(drawnCards);

    // Risistemazione carte trattenute se presenti
    if (retainedCount > 0 && drawnCards.length === 0) {
      this.repositionHand();
    }

    this.updatePlayerUI();
    this.updateEnergyUI();
    this.updateDeckCounters();
    this.updateIntentDisplay();
    this.turnText.setText(`${this._t('turno')} ${this.combat.turnNumber}`);
    this.updateSlancioUI();
    this.updateCaricaUI();
  }

  createHandSprites(cards) {
    const deckX = 110;
    const deckY = 24;
    const existingCount = this.handSprites.length;
    const totalAfter = existingCount + cards.length;
    const newSprites = [];

    cards.forEach((card, i) => {
      const globalIndex = this.handSprites.length;
      const fanPos = this.getCardFanPosition(globalIndex, totalAfter);

      const sprite = new CardSprite(this, deckX, deckY, {
        type: card.type, name: LocaleManager.name(card), cost: card.cost,
        value: card.value, description: LocaleManager.desc(card),
        isCurse: card.isCurse,
      });

      sprite.setScale(0.2);
      sprite.setAlpha(0);
      sprite.isEntering = true;
      sprite.cardModel = card;
      sprite.handIndex = globalIndex;

      // 1A — Imposta giocabilità iniziale
      if (!card.canPlay(this.player.energy)) {
        sprite.setAlpha(0); // sarà aggiornato dopo il tween
      }

      this.handSprites.push(sprite);
      newSprites.push(sprite);

      this.tweens.add({
        targets: sprite,
        x: fanPos.x, y: fanPos.y,
        scaleX: 1, scaleY: 1, alpha: 1,
        rotation: fanPos.rotation,
        duration: 350, delay: i * 100,
        ease: 'Back.easeOut',
        onComplete: () => {
          sprite.isEntering = false;
          sprite.originalX = fanPos.x;
          sprite.originalY = fanPos.y;
          sprite.originalRotation = fanPos.rotation;
          this.updateDeckCounters();
          // 1A — Aggiorna giocabilità dopo l'entrata
          if (sprite.setPlayable) {
            sprite.setPlayable(sprite.cardModel.canPlay(this.player.energy));
          }
        }
      });
    });

    if (existingCount > 0) {
      this.repositionHand(newSprites);
    }
  }

  playCard(cardSprite) {
    if (this.isAnimating || this._paused) return;

    const card = cardSprite.cardModel;
    if (!card.canPlay(this.player.energy)) {
      this.showMessage(this._t('energiaInsufficiente'), '#e85d5d');
      cardSprite.returnToPosition();
      return;
    }

    this.isAnimating = true;
    const result = this.combat.playCard(card);
    if (!result.success) {
      cardSprite.returnToPosition();
      this.isAnimating = false;
      return;
    }

    this.deck.playCard(card);

    // M5 — Suono carta giocata
    this.playSound('card-play');

    if (card.type === 'attack') {
      const attackEffects = this.relicManager.trigger('onPlayAttack');
      attackEffects.forEach(({ effect }) => {
        if (effect.heal) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.heal);
          this.showPlayerEffect(`+${effect.heal} HP`, '#5dc77a');
        }
        if (effect.doubleDamage) {
          const bonusDmg = result.damage;
          this.enemy.takeDamage(bonusDmg);
          result.damage += bonusDmg;
        }
        if (effect.strength) {
          this.player.strength += effect.strength;
        }
        if (effect.applyPoison && this.enemy.isAlive()) {
          this.enemy.statusEffects.poison = Math.max(0, (this.enemy.statusEffects.poison || 0) + effect.applyPoison);
          this.updateStatusUI();
        }
      });

      // Condizione di piano: danno bonus per attacco
      if (this.floorCondition?.effect === 'bonusDamagePerAttack' && this.enemy.isAlive()) {
        this.enemy.takeDamage(this.floorCondition.value);
        result.floorBonus = this.floorCondition.value;
      }

      // Carica: consuma i punti carica se attivata
      if (this.caricaActive && this.combat.caricaPoints > 0 && this.enemy.isAlive()) {
        const bonus = this.combat.consumeCarica() * 5;
        this.enemy.takeDamage(bonus);
        result.caricaBonus = bonus;
        this.caricaActive = false;
      }
    }

    if (card.type === 'defend') {
      const defendEffects = this.relicManager.trigger('onPlayDefend');
      defendEffects.forEach(({ effect }) => {
        if (effect.block) this.player.addBlock(effect.block);
        if (effect.heal) this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.heal);
        if (effect.strength) this.player.strength += effect.strength;
      });

      // Condizione di piano: cura per ogni difesa
      if (this.floorCondition?.effect === 'healOnDefend') {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.floorCondition.value);
        this.showPlayerEffect(`+${this.floorCondition.value} HP`, '#5dc77a');
      }
    }

    const discardX = 175;
    const discardY = 24;

    const extraDraw = result.drawCards || 0;

    // Effetto flash colorato al centro (avviato in parallelo con il tween della carta)
    const flashColors = { attack: C.hp, defend: C.mana, skill: C.borderGold };
    const flashColor = flashColors[card.type] || C.borderGold;
    const flash = this.add.rectangle(640, 300, 100, 100, flashColor).setAlpha(0).setDepth(90);
    this.tweens.add({
      targets: flash,
      alpha: 0.5,
      duration: 150,
      ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: flash,
          alpha: 0,
          duration: 150,
          ease: 'Power2',
          onComplete: () => flash.destroy()
        });
      }
    });

    cardSprite.setRotation(0);
    this.tweens.add({
      targets: cardSprite,
      x: 640, y: 300,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0,
      rotation: 0,
      duration: 350,
      ease: 'Power2',
      onComplete: () => {
        this.showCardEffect(result);

        // M4 — Phase transition
        if (result.phaseTransition) {
          this.onPhaseTransition(LocaleManager.name(result.phaseTransition));
        }

        this.tweens.add({
          targets: cardSprite,
          x: discardX, y: discardY,
          scaleX: 0.15, scaleY: 0.15, alpha: 0.2,
          duration: 250, delay: 100, ease: 'Power3',
          onComplete: () => {
            const idx = this.handSprites.indexOf(cardSprite);
            if (idx > -1) this.handSprites.splice(idx, 1);
            cardSprite.destroy();

            this.updatePlayerUI();
            this.updateEnemyUI();
            this.updateEnergyUI();
            this.updateDeckCounters();
            this.updateStatusUI();
            this.repositionHand();
            this.refreshHandPlayability();
            this.updateSlancioUI();
            this.updateCaricaUI();

            // M2B — Curse discard (Affaticamento)
            if (result.curseDiscard && result.curseDiscard > 0 && this.handSprites.length > 0) {
              const discardIdx = Math.floor(Math.random() * this.handSprites.length);
              const toDiscard = this.handSprites[discardIdx];
              this.deck.playCard(toDiscard.cardModel);
              this.handSprites.splice(discardIdx, 1);
              this.tweens.add({
                targets: toDiscard,
                x: discardX, y: discardY,
                scaleX: 0.15, scaleY: 0.15, alpha: 0,
                duration: 250, ease: 'Power3',
                onComplete: () => {
                  toDiscard.destroy();
                  this.repositionHand();
                  this.updateDeckCounters();
                }
              });
            }

            if (this.combat.isCombatOver() === 'victory') {
              const killEffects = this.relicManager.trigger('onKill');
              killEffects.forEach(({ effect }) => {
                if (effect.heal) this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.heal);
                if (effect.block) this.player.addBlock(effect.block);
                if (effect.strength) this.player.strength += effect.strength;
                if (effect.gold && this.runData) this.runData.gold = (this.runData.gold || 0) + effect.gold;
                if (effect.giveEnergy) { this.player.energy += effect.giveEnergy; this.updateEnergyUI(); }
                if (effect.stackStrength && this.runData) {
                  this.runData.permanentStrength = (this.runData.permanentStrength || 0) + effect.stackStrength;
                }
              });
              this.time.delayedCall(500, () => this.showVictory());
              return;
            }

            if (extraDraw > 0) {
              this.time.delayedCall(200, () => {
                this.drawExtraCards(extraDraw);
                this.isAnimating = false;
              });
            } else {
              this.isAnimating = false;
            }
          }
        });
      }
    });
  }

  showCardEffect(result) {
    switch (result.type) {
      case 'attack': {
        const hits = result.hits || 1;
        const dmgLabel = hits > 1
          ? `${hits}x${result.damagePerHit}  (-${result.damage})`
          : `-${result.damage}`;

        const dmgText = this.add.text(
          this.enemyCenter.x, this.enemyCenter.y - 25, dmgLabel,
          { fontFamily: FONT_UI, fontSize: hits > 1 ? '24px' : '28px', color: '#ff5555', fontStyle: '900',
            stroke: '#000000', strokeThickness: 4 }
        ).setOrigin(0.5).setDepth(100);

        this.tweens.add({
          targets: dmgText, y: this.enemyCenter.y - 75, alpha: 0,
          duration: 900, ease: 'Power2',
          onComplete: () => dmgText.destroy()
        });

        this.shakeEnemySprite();
        if (hits > 1) {
          for (let i = 0; i < hits; i++) {
            this.time.delayedCall(i * 100, () => this.cameras.main.shake(80, 0.006));
          }
        } else {
          this.cameras.main.shake(120, 0.008);
        }

        // M5
        this.playSound('attack-hit');

        const attackMsgs = [];
        if (result.slancioBonusDamage > 0) attackMsgs.push(`⚡ ${this._t('slancioLabel')} ×${result.slancioCountBefore}`);
        if (result.caricaBonus) attackMsgs.push(`💥 ${this._t('caricaLabel')} +${result.caricaBonus}!`);
        if (result.floorBonus) attackMsgs.push(`+${result.floorBonus} (${this._t('piano')})`);
        if (result.blockGained) attackMsgs.push(`+${result.blockGained} ${this._t('blocco')}`);
        if (result.healed) attackMsgs.push(`+${result.healed} HP`);
        if (result.selfDamage) attackMsgs.push(`-${result.selfDamage} HP`);
        // M3 status
        if (result.appliedPoison) attackMsgs.push(`🟢 ${this._t('veleno')} ${result.appliedPoison}`);
        if (result.appliedBurn) attackMsgs.push(`🔥 ${this._t('bruciatura')} ${result.appliedBurn}`);
        if (result.appliedStun) attackMsgs.push(`💫 ${this._t('stordimento')}`);
        if (result.appliedWeakness) attackMsgs.push(`⬇️ ${this._t('debolezza')} ${result.appliedWeakness}!`);
        if (result.appliedArmor) attackMsgs.push(`🛡️ ${this._t('blocco')} +${result.appliedArmor.value}`);
        if (attackMsgs.length > 0) this.showMessage(attackMsgs.join('  '), '#e8b84b');
        break;
      }
      case 'defend': {
        const defMsgs = [];
        if (result.counterDamage) {
          defMsgs.push(`${result.counterDamage} ${this._t('danni')}!`);
          this.shakeEnemySprite();
        }
        if (result.drawCards > 0) defMsgs.push(`+${result.drawCards} ${this._t('carte')}`);
        if (defMsgs.length > 0) this.showMessage(defMsgs.join('  '), '#7bb5e8');
        if (result.block) this.showPlayerEffect(`+${result.block} 🛡`, '#' + C.mana.toString(16).padStart(6, '0'));
        // M5
        this.playSound('block');
        break;
      }
      case 'skill': {
        const messages = [];
        if (result.strengthGained) {
          const label = result.strengthTemporary
            ? this._t('forzaTurno')(result.strengthGained)
            : this._t('forzaPerm')(result.strengthGained);
          messages.push(label);
        }
        if (result.energyGained) messages.push(`+${result.energyGained} ${this._t('energia')}`);
        if (result.drawCards > 0) messages.push(`+${result.drawCards} ${this._t('carte')}`);
        if (result.appliedStun) messages.push(`💫 ${this._t('stordimento')}`);
        if (result.appliedPoison) messages.push(`🟢 ${this._t('veleno')} ${result.appliedPoison}`);
        if (result.appliedWeakness) messages.push(`⬇️ ${this._t('debolezza')} ${result.appliedWeakness}!`);
        if (result.appliedArmor) messages.push(`🛡️ ${this._t('blocco')} +${result.appliedArmor.value}`);
        if (messages.length > 0) this.showMessage(messages.join('  '), '#' + C.textGold.toString(16).padStart(6, '0'));
        if (result.healed) this.showPlayerEffect(`+${result.healed} HP`, '#' + C.skill.toString(16).padStart(6, '0'));
        if (result.block) this.showPlayerEffect(`+${result.block} 🛡`, '#7bb5e8');
        if (result.healed) this.playSound('heal');
        break;
      }
      case 'curse': {
        // M2B — maledizione
        const curseMsgs = [];
        if (result.selfDamage) curseMsgs.push(`-${result.selfDamage} HP`);
        if (result.curseDiscard) curseMsgs.push(this._t('scartaCarta')(result.curseDiscard));
        if (result.curseBlock) curseMsgs.push(this._t('nemicoBlocko')(result.curseBlock));
        this.showMessage(curseMsgs.length > 0 ? curseMsgs.join('  ') : this._t('maledizione'), '#cc88ff');
        break;
      }
    }
  }

  drawExtraCards(count) {
    const drawn = this.deck.drawCards(count);
    if (drawn.length > 0) {
      this.createHandSprites(drawn);
      this.updateDeckCounters();
    }
  }

  endTurn() {
    if (this.isAnimating || this._paused) return;
    this.isAnimating = true;

    this.deck.discardHand(); // le carte retain rimangono in deck.hand

    const discardX = 175;
    const discardY = 24;

    const toDiscard = this.handSprites.filter(s => !s.cardModel || !s.cardModel.retain);
    const toKeep = this.handSprites.filter(s => s.cardModel && s.cardModel.retain);
    const total = toDiscard.length;

    toDiscard.forEach((sprite, i) => {
      this.tweens.add({
        targets: sprite,
        x: discardX, y: discardY,
        scaleX: 0.15, scaleY: 0.15, alpha: 0, rotation: 0.2,
        duration: 250, delay: i * 50, ease: 'Power3',
        onComplete: () => {
          sprite.destroy();
          this.updateDeckCounters();
        }
      });
    });

    this.handSprites = toKeep;
    this.time.delayedCall(total * 50 + 350, () => this.enemyTurn());
  }

  enemyTurn() {
    // Condizione di piano: buff nemico a inizio turno nemico
    if (this.floorCondition?.effect === 'enemyBlockPerTurn' && this.enemy.isAlive()) {
      this.enemy.block += this.floorCondition.value;
      this.updateEnemyUI();
    }
    if (this.floorCondition?.effect === 'enemyHealPerTurn' && this.enemy.isAlive()) {
      this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + this.floorCondition.value);
      this.updateEnemyUI();
    }

    const result = this.combat.endPlayerTurn();

    // Mostra danno da status al nemico (veleno/bruciatura)
    if (result.statusDamage > 0 && this.enemy.isAlive()) {
      const dmgText = this.add.text(
        this.enemyCenter.x, this.enemyCenter.y - 25, `-${result.statusDamage} ☠`,
        { fontFamily: FONT_UI, fontSize: '20px', color: '#' + C.poison.toString(16).padStart(6, '0'), fontStyle: '900',
          stroke: '#000000', strokeThickness: 3 }
      ).setOrigin(0.5).setDepth(100);
      this.tweens.add({
        targets: dmgText, y: this.enemyCenter.y - 60, alpha: 0,
        duration: 900, ease: 'Power2', onComplete: () => dmgText.destroy()
      });
      this.updateEnemyUI();
      this.updateStatusUI();
    }

    if (result.type === 'enemy_dead') {
      const killEffects = this.relicManager.trigger('onKill');
      killEffects.forEach(({ effect }) => {
        if (effect.heal) this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.heal);
        if (effect.block) this.player.addBlock(effect.block);
        if (effect.strength) this.player.strength += effect.strength;
        if (effect.gold && this.runData) this.runData.gold = (this.runData.gold || 0) + effect.gold;
      });
      this.isAnimating = false;
      this.time.delayedCall(600, () => this.showVictory());
      return;
    }

    // M3 — Nemico stordito: salta il turno
    if (result.type === 'stunned') {
      this.showMessage(this._t('eStordito')(LocaleManager.name(this.enemy)), '#e8b84b');
      this.updateIntentDisplay();
      this.time.delayedCall(800, () => this.newPlayerTurn());
      return;
    }

    if (result.type === 'attack') {
      // Animazione attacco: nemico si avvicina al giocatore
      if (this.enemyImg && this.enemyImg.active) {
        const origX = this.enemyImg.x;
        this.tweens.add({
          targets: this.enemyImg,
          x: origX - 20,
          duration: 150,
          ease: 'Power2',
          onComplete: () => {
            this.tweens.add({
              targets: this.enemyImg,
              x: origX,
              duration: 150,
              ease: 'Power2'
            });
          }
        });
      }
      this.time.delayedCall(300, () => {
        this.cameras.main.shake(200, 0.012);

        const playerY = 310;

        if (result.hpLost > 0) {
          this.damageTakenThisCombat += result.hpLost;
          const dmgText = this.add.text(this.scale.width / 2, playerY, `-${result.hpLost}`, {
            fontFamily: FONT_UI, fontSize: '28px', color: '#ff5555', fontStyle: '900',
            stroke: '#000000', strokeThickness: 4
          }).setOrigin(0.5).setDepth(100);

          this.tweens.add({
            targets: dmgText, y: playerY - 50, alpha: 0,
            duration: 900, onComplete: () => dmgText.destroy()
          });

          this.cameras.main.flash(150, 200, 50, 50, false, null, null, 0.15);
          this.playSound('attack-hit');
        }

        if (result.blocked > 0) {
          this.showMessage(this._t('danniBloccati')(result.blocked), '#7bb5e8');
        }
        if (result.weaknessReduced) {
          this.showMessage(this._t('indebolito')(LocaleManager.name(this.enemy)), '#d8b4fe');
        }

        if (result.appliedPoisonToPlayer) {
          this.showPlayerEffect(`☠ ${this._t('veleno')}!`, '#9b59b6');
        }
        if (result.appliedBurnToPlayer) {
          this.showPlayerEffect(`🔥 ${this._t('bruciatura')}!`, '#e67e22');
        }
        if (result.appliedPoisonToPlayer || result.appliedBurnToPlayer) {
          this.updateStatusUI();
        }

        if (result.hpLost > 0) {
          const thornEffects = this.relicManager.trigger('onTakeDamage');
          thornEffects.forEach(({ effect }) => {
            if (effect.thorns && this.enemy.isAlive()) {
              this.enemy.takeDamage(effect.thorns);
              this.showMessage(this._t('danniRitorno')(effect.thorns), '#5dc77a');
              this.updateEnemyUI();
            }
            if (effect.block) {
              this.player.addBlock(effect.block);
              this.updatePlayerUI();
            }
          });

          // bloodGem: +1 HP max ogni N stacks
          const bloodGem = this.relicManager.relics.find(r => r.id === 'bloodGem');
          if (bloodGem) {
            const stacks = this.relicManager.getStack('bloodGem');
            const threshold = bloodGem.stackThreshold || 3;
            const grantedNow = Math.floor(stacks / threshold);
            const grantedBefore = Math.floor((stacks - 1) / threshold);
            if (grantedNow > grantedBefore) {
              const gain = bloodGem.effect.maxHpPerStack || 1;
              this.player.maxHp += gain;
              this.showPlayerEffect(`+${gain} HP max`, '#e8b84b');
            }
            this.updateRelicUI('bloodGem');
          }
        }

        this.updatePlayerUI();

        if (this.combat.isCombatOver() === 'defeat') {
          this.time.delayedCall(500, () => this.showDefeat());
          return;
        }

        this.time.delayedCall(600, () => this.newPlayerTurn());
      });
    } else if (result.type === 'defend') {
      this.showMessage(this._t('difende')(LocaleManager.name(this.enemy), result.value), '#7bb5e8');
      this.updateEnemyUI();
      this.time.delayedCall(800, () => this.newPlayerTurn());
    } else if (result.type === 'heal') {
      this.showMessage(this._t('siCura')(LocaleManager.name(this.enemy), result.enemyHealed), '#5dc77a');
      this.updateEnemyUI();
      this.time.delayedCall(800, () => this.newPlayerTurn());
    } else if (result.type === 'status') {
      if (result.appliedPoisonToPlayer) {
        this.showPlayerEffect(`☠ ${this._t('veleno')}!`, '#9b59b6');
      }
      if (result.appliedBurnToPlayer) {
        this.showPlayerEffect(`🔥 ${this._t('bruciatura')}!`, '#e67e22');
      }
      const statusMsgs = [];
      if (result.appliedPoisonToPlayer) statusMsgs.push(`☠ ${this._t('veleno')} ${result.appliedPoisonToPlayer}`);
      if (result.appliedBurnToPlayer) statusMsgs.push(`🔥 ${this._t('bruciatura')} ${result.appliedBurnToPlayer}`);
      if (statusMsgs.length > 0) this.showMessage(statusMsgs.join('  '), '#9b59b6');
      this.updatePlayerUI();
      this.updateStatusUI();
      this.time.delayedCall(800, () => this.newPlayerTurn());
    }
  }

  newPlayerTurn() {
    const playerStatusDamage = this.combat.startPlayerTurn();

    if (playerStatusDamage > 0) {
      this.damageTakenThisCombat += playerStatusDamage;
      const playerY = 312;
      const dmgText = this.add.text(this.scale.width / 2, playerY, `-${playerStatusDamage} ☠`, {
        fontFamily: FONT_UI, fontSize: '22px',
        color: '#' + C.poison.toString(16).padStart(6, '0'),
        fontStyle: '900', stroke: '#000000', strokeThickness: 3
      }).setOrigin(0.5).setDepth(100);
      this.tweens.add({
        targets: dmgText, y: playerY - 50, alpha: 0,
        duration: 900, onComplete: () => dmgText.destroy()
      });
      this.cameras.main.flash(100, 100, 200, 50, false, null, null, 0.08);
    }

    this.updatePlayerUI();
    this.updateEnemyUI();
    this.updateStatusUI();

    if (this.combat.isCombatOver() === 'defeat') {
      this.time.delayedCall(500, () => this.showDefeat());
      return;
    }

    this.startTurn();
    this.isAnimating = false;
  }

  showMessage(text, color) {
    const c = color || ('#' + C.textGold.toString(16).padStart(6, '0'));
    this.combatMessage.setText(text);
    this.combatMessage.setColor(c);
    this.combatMessage.setAlpha(1);
    this.tweens.add({ targets: this.combatMessage, alpha: 0, duration: 1500, ease: 'Power2' });
  }

  repositionHand(skipSprites = []) {
    const total = this.handSprites.length;
    this.handSprites.forEach((sprite, index) => {
      const fanPos = this.getCardFanPosition(index, total);
      sprite.handIndex = index;
      sprite.setDepth(index);

      if (sprite.isEntering || skipSprites.includes(sprite)) return;

      sprite.originalX = fanPos.x;
      sprite.originalY = fanPos.y;
      sprite.originalRotation = fanPos.rotation;

      this.tweens.killTweensOf(sprite);
      this.tweens.add({
        targets: sprite, x: fanPos.x, y: fanPos.y, rotation: fanPos.rotation,
        scaleX: 1, scaleY: 1, duration: 250, ease: 'Power2'
      });
    });
  }

  // =============================================
  // M4 — PHASE TRANSITION
  // =============================================

  onPhaseTransition(phaseName) {
    const { width, height } = this.scale;

    this.cameras.main.shake(450, 0.015);
    this.cameras.main.flash(300, 255, 80, 50, false, null, null, 0.3);

    const phaseText = this.add.text(width / 2, height / 2 - 30, phaseName.toUpperCase(), {
      fontFamily: FONT_TITLE, fontSize: '30px',
      color: '#' + C.hp.toString(16).padStart(6, '0'),
      fontStyle: '900', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(150).setAlpha(0);

    this.tweens.add({
      targets: phaseText,
      alpha: 1, scaleX: 1.15, scaleY: 1.15,
      duration: 350, ease: 'Power2',
      yoyo: true, hold: 900,
      onComplete: () => phaseText.destroy()
    });

    // Aggiorna testo fase
    if (this.enemyPhaseText) {
      this.enemyPhaseText.setText(phaseName);
    }
    this.updateIntentDisplay();

    // M5
    this.playSound('phase-transition');
  }

  // =============================================
  // VICTORY / DEFEAT
  // =============================================

  showVictory() {
    const { width, height } = this.scale;
    MusicManager.setVolume(this, 0.28);
    let goldReward = this.nodeType === 'boss' ? 50 : this.nodeType === 'elite' ? 30 : 15;

    // warTrophy: oro bonus per ogni combattimento vinto nella run
    const warTrophy = this.relicManager.relics.find(r => r.id === 'warTrophy');
    if (warTrophy) {
      const trophyBonus = this.relicManager.getStack('warTrophy') * (warTrophy.effect.goldBonus || 2);
      goldReward += trophyBonus;
    }

    SaveManager.updateStats({ enemiesKilled: 1, goldEarned: goldReward });
    const combatEndAch = AchievementManager.check({ type: 'combat_end', damageTaken: this.damageTakenThisCombat });
    this.showAchievementPopups(combatEndAch);
    this.playSound('victory');

    // Enemy death animation — fade out container + "SCONFITTO!" al centro
    const deathTargets = [];
    if (this.enemyImg && this.enemyImg.active) deathTargets.push(this.enemyImg);

    if (deathTargets.length > 0) {
      this.tweens.add({
        targets: deathTargets,
        alpha: 0,
        duration: 500,
        ease: 'Power2'
      });
    }

    // Testo "SCONFITTO!" al centro
    const sconfittoText = this.add.text(width / 2, height / 2 - 60, this._t('sconfittoLabel'), {
      fontFamily: FONT_TITLE, fontSize: '36px',
      color: '#' + C.hp.toString(16).padStart(6, '0'),
      fontStyle: '900', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(150).setAlpha(0);

    this.tweens.add({
      targets: sconfittoText,
      alpha: 1, scaleX: 1.1, scaleY: 1.1,
      duration: 300, ease: 'Power2',
      yoyo: true, hold: 400,
      onComplete: () => sconfittoText.destroy()
    });

    this.cameras.main.flash(250, 255, 220, 100);

    this.time.delayedCall(380, () => {
      const overlay = this.add.rectangle(width / 2, height / 2, width, height, C.bgPanelDark, 0.92)
        .setDepth(200).setAlpha(0);
      this.tweens.add({ targets: overlay, alpha: 1, duration: 250 });

      drawPanel(this, width / 2, height / 2 - 20, 320, 160, {
        radius: 14, fill: C.bgPanel, border: C.borderGold, borderWidth: 2, depth: 200
      });

      this.add.text(width / 2, height / 2 - 60, this._t('vittoria'), {
        fontFamily: FONT_TITLE, fontSize: '44px',
        color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
        fontStyle: '900', stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5).setDepth(201);

      this.add.text(width / 2, height / 2 - 10, `+${goldReward} ${this._t('oro')}`, {
        fontFamily: FONT_UI, fontSize: '20px',
        color: '#' + C.textGold.toString(16).padStart(6, '0'),
        fontStyle: '700'
      }).setOrigin(0.5).setDepth(201);

      this.add.text(width / 2, height / 2 + 36, this._t('clickContinua'), {
        fontFamily: FONT_UI, fontSize: '13px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0')
      }).setOrigin(0.5).setDepth(201);

      overlay.setInteractive();
      overlay.on('pointerdown', () => {
        if (this.runData) {
          delete this.runData.inCombat;
          this.runData.playerHp = this.player.hp;
          this.runData.gold += goldReward;
          this.runData.relicStacks = this.relicManager.relicStacks;
          this.runData.map.floors[this.runData.currentFloor][this.runData.currentCol].completed = true;

          if (this.nodeType === 'boss') {
            AscensionManager.incrementLevel();
            PerkManager.addPoints(1);
            SaveManager.updateStats({ victory: true, highestFloor: this.runData.currentFloor });
            SaveManager.saveRunToHistory(this.runData, 'victory');
            const victoryAch = AchievementManager.check({
              type: 'victory',
              classId: this.runData.classId,
              deckSize: (this.runData.deckCards || []).length,
              gold: this.runData.gold,
              floorsVisited: (this.runData.currentFloor || 0) + 1,
            });
            this.showAchievementPopups(victoryAch);
            SaveManager.clearRun();
            this.cameras.main.fadeOut(350, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MainMenu'));
            return;
          }

          this.cameras.main.fadeOut(350, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () =>
            this.scene.start('Reward', { runData: this.runData, nodeType: this.nodeType, goldReward })
          );
        } else {
          this.scene.restart();
        }
      });
    });
  }

  showDefeat() {
    const { width, height } = this.scale;
    MusicManager.stop(this);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, C.bgPanelDark, 0.92)
      .setDepth(200);

    drawPanel(this, width / 2, height / 2, 320, 160, {
      radius: 14, fill: C.bgPanel, border: C.hp, borderWidth: 2, depth: 200
    });

    this.add.text(width / 2, height / 2 - 45, this._t('sconfitta'), {
      fontFamily: FONT_TITLE, fontSize: '44px',
      color: '#' + C.hp.toString(16).padStart(6, '0'),
      fontStyle: '900', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(201);

    this.add.text(width / 2, height / 2 + 8, this._t('runFinita'), {
      fontFamily: FONT_UI, fontSize: '15px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0')
    }).setOrigin(0.5).setDepth(201);

    this.add.text(width / 2, height / 2 + 38, this._t('clickRicomincia'), {
      fontFamily: FONT_UI, fontSize: '13px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0')
    }).setOrigin(0.5).setDepth(201);

    // M5
    this.playSound('defeat');

    overlay.setInteractive();
    overlay.on('pointerdown', () => {
      if (this.runData) delete this.runData.inCombat;
      PerkManager.addPoints(1);
      SaveManager.updateStats({
        defeat: true,
        highestFloor: this.runData ? this.runData.currentFloor : 0,
        enemiesKilled: 0
      });
      if (this.runData) SaveManager.saveRunToHistory(this.runData, 'defeat');
      SaveManager.clearRun();
      this.cameras.main.fadeOut(350, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MainMenu'));
    });
  }

  // =============================================
  // DRAG & DROP
  // =============================================

  setupDragAndDrop() {
    const playThresholdY = 330;

    this.input.on('dragstart', (pointer, gameObject) => {
      if (this.isAnimating) return;
      gameObject.savePosition();
      gameObject.setDepth(100);
      gameObject.setScale(1.15);
      gameObject.setRotation(0);

      const card = gameObject.cardModel;
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      if (this.isAnimating) return;
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject) => {
      if (this.isAnimating) {
        gameObject.returnToPosition();
        return;
      }

      const card = gameObject.cardModel;
      if (!card) {
        gameObject.returnToPosition();
        return;
      }

      if (card.type === 'attack') {
        const overEnemy = Phaser.Geom.Rectangle.Contains(this.enemyBounds, pointer.x, pointer.y);
        if (overEnemy) {
          this.playCard(gameObject);
        } else {
          gameObject.returnToPosition();
        }
      } else {
        if (pointer.y < playThresholdY) {
          this.playCard(gameObject);
        } else {
          gameObject.returnToPosition();
        }
      }
    });
  }

  // =============================================
  // M5 — AUDIO
  // =============================================

  playSound(key) {
    try {
      if (this.cache.audio.exists(key)) {
        this.sound.play(key, { volume: 0.6 });
      }
    } catch (e) {
      // Graceful fallback se audio non disponibile
    }
  }

  shakeEnemySprite() {
    if (!this.enemyImg) return;
    const ox = this.enemyImg.x;
    this.tweens.add({
      targets: this.enemyImg,
      x: ox + 8,
      duration: 33,
      yoyo: true,
      repeat: 2,
      onComplete: () => { if (this.enemyImg) this.enemyImg.x = ox; }
    });
    // Flash rosso breve
    if (this.enemyImg.active) {
      this.enemyImg.setTint(0xff4444);
      this.time.delayedCall(80, () => {
        if (this.enemyImg && this.enemyImg.active) this.enemyImg.clearTint();
      });
    }
  }

  showPlayerEffect(text, color) {
    const { width } = this.scale;
    const t = this.add.text(width / 2 + 70, 315, text, {
      fontFamily: FONT_UI, fontSize: '20px', color, fontStyle: '900',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(100);
    this.tweens.add({
      targets: t, y: 265, alpha: 0, duration: 800, ease: 'Power2',
      onComplete: () => t.destroy()
    });
  }

  // =============================================
  // OVERLAY: PILE VIEWER
  // =============================================

  showPileOverlay(title, cards) {
    if (this.pileOverlayGroup) return;

    const { width, height } = this.scale;
    this.pileOverlayGroup = this.add.group();

    const bg = this.add.rectangle(width / 2, height / 2, width, height, C.bg, 0.96)
      .setDepth(200).setInteractive();
    this.pileOverlayGroup.add(bg);

    const titleText = this.add.text(width / 2, 30, `${title} (${cards.length} ${this._t('carte')})`, {
      fontFamily: FONT_TITLE, fontSize: '18px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(201);
    this.pileOverlayGroup.add(titleText);

    if (cards.length === 0) {
      const emptyText = this.add.text(width / 2, height / 2, this._t('nessunaCarta'), {
        fontFamily: FONT_UI, fontSize: '15px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0')
      }).setOrigin(0.5).setDepth(201);
      this.pileOverlayGroup.add(emptyText);
    } else {
      const cols = 6;
      const cardW = 155, cardH = 60, padX = 12, padY = 10;
      const totalCols = Math.min(cols, cards.length);
      const startX = width / 2 - ((totalCols * (cardW + padX)) - padX) / 2;
      const startY = 65;

      const sorted = [...cards].sort((a, b) => {
        const order = { attack: 0, defend: 1, skill: 2, curse: 3 };
        return (order[a.type] || 4) - (order[b.type] || 4);
      });

      sorted.forEach((card, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardW + padX) + cardW / 2;
        const y = startY + row * (cardH + padY) + cardH / 2;

        const cc = CARD_COLORS[card.isCurse ? 'curse' : (card.type || 'attack')] || CARD_COLORS.attack;

        const cardBg = this.add.rectangle(x, y, cardW, cardH, cc.bg, 0.97)
          .setStrokeStyle(1, cc.border).setDepth(201);
        this.pileOverlayGroup.add(cardBg);

        this.pileOverlayGroup.add(this.add.text(x - cardW / 2 + 14, y, `${card.cost}`, {
          fontFamily: FONT_TITLE, fontSize: '13px',
          color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
          fontStyle: '700'
        }).setOrigin(0.5).setDepth(202));

        this.pileOverlayGroup.add(this.add.text(x + 8, y - 9, LocaleManager.name(card), {
          fontFamily: FONT_TITLE, fontSize: '11px',
          color: card.isCurse ? '#cc88ff' : '#' + C.textPrimary.toString(16).padStart(6, '0'),
          fontStyle: '700'
        }).setOrigin(0.5).setDepth(202));

        this.pileOverlayGroup.add(this.add.text(x + 8, y + 10, LocaleManager.desc(card).replace(/\n/g, ' '), {
          fontFamily: FONT_BODY, fontSize: '9px',
          color: '#' + C.textSecondary.toString(16).padStart(6, '0')
        }).setOrigin(0.5).setDepth(202));
      });
    }

    const { bg: closeBg, txt: closeTxt } = createButton(
      this, width / 2, height - 40, 140, 36, this._t('chiudi'),
      {
        fill: C.btnDanger, hover: C.btnDangerHov, border: C.hp,
        borderWidth: 2, radius: 6, depth: 201, fontSize: '13px', font: FONT_UI, fontStyle: '700',
        onClick: () => this.closePileOverlay()
      }
    );
    this.pileOverlayGroup.add(closeBg);
    this.pileOverlayGroup.add(closeTxt);
  }

  closePileOverlay() {
    if (this.pileOverlayGroup) {
      this.pileOverlayGroup.getChildren().forEach(c => c.destroy());
      this.pileOverlayGroup.destroy(true);
      this.pileOverlayGroup = null;
    }
  }

  // =============================================
  // OVERLAY: EFFECTS LEGEND
  // =============================================

  showLegendOverlay() {
    if (this.legendOverlayGroup) return;

    const { width, height } = this.scale;
    this.legendOverlayGroup = this.add.group();

    const bg = this.add.rectangle(width / 2, height / 2, width, height, C.bg, 0.96)
      .setDepth(200).setInteractive();
    this.legendOverlayGroup.add(bg);

    this.legendOverlayGroup.add(this.add.text(width / 2, 28, this._t('guidaEffetti'), {
      fontFamily: FONT_TITLE, fontSize: '18px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(201));

    const entries = [
      { term: this._t('atkDesc'),   desc: this._t('atkBody') },
      { term: this._t('defDesc'),   desc: this._t('defBody') },
      { term: this._t('strDesc'),   desc: this._t('strBody') },
      { term: this._t('enDesc'),    desc: this._t('enBody') },
      { term: this._t('slancioDesc'), desc: this._t('slancioBody') },
      { term: this._t('caricaDesc'), desc: this._t('caricaBody') },
      { term: this._t('velenoDesc'), desc: this._t('velenoBody') },
      { term: this._t('bruciDesc'), desc: this._t('bruciBody') },
      { term: this._t('stordDesc'), desc: this._t('stordBody') },
      { term: this._t('malDesc'),   desc: this._t('malBody') },
      { term: this._t('pescaDesc'), desc: this._t('pescaBody') },
      { term: this._t('colpiDesc'), desc: this._t('colpiBody') },
      { term: this._t('relicDesc'), desc: this._t('relicBody') },
    ];

    const startY = 65, lineH = 44;
    const leftX = width / 2 - 300;

    entries.forEach((entry, i) => {
      const y = startY + i * lineH;
      if (i % 2 === 0) {
        this.legendOverlayGroup.add(
          this.add.rectangle(width / 2, y + 4, 650, lineH - 4, C.bgPanel, 0.4).setDepth(201)
        );
      }
      this.legendOverlayGroup.add(this.add.text(leftX, y, entry.term, {
        fontFamily: FONT_UI, fontSize: '13px',
        color: '#' + C.textGold.toString(16).padStart(6, '0'),
        fontStyle: '700'
      }).setDepth(202));
      this.legendOverlayGroup.add(this.add.text(leftX + 210, y, entry.desc, {
        fontFamily: FONT_BODY, fontSize: '11px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        wordWrap: { width: 400 }
      }).setDepth(202));
    });

    const { bg: closeBg2, txt: closeTxt2 } = createButton(
      this, width / 2, height - 40, 140, 36, this._t('chiudi'),
      {
        fill: C.btnDanger, hover: C.btnDangerHov, border: C.hp,
        borderWidth: 2, radius: 6, depth: 201, fontSize: '13px', font: FONT_UI, fontStyle: '700',
        onClick: () => this.closeLegendOverlay()
      }
    );
    this.legendOverlayGroup.add(closeBg2);
    this.legendOverlayGroup.add(closeTxt2);
  }

  closeLegendOverlay() {
    if (this.legendOverlayGroup) {
      this.legendOverlayGroup.getChildren().forEach(c => c.destroy());
      this.legendOverlayGroup.destroy(true);
      this.legendOverlayGroup = null;
    }
  }

  // =============================================
  // PAUSA
  // =============================================

  _togglePause() {
    if (this.isAnimating) return;
    this._paused = !this._paused;
    if (this._paused) {
      this._openPause();
    } else {
      this._closePause();
    }
  }

  _openPause() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Svuota per sicurezza
    this._pauseGroup.forEach(o => o?.destroy());
    this._pauseGroup = [];

    // Sfondo scuro semi-trasparente
    const overlay = this.add.rectangle(cx, cy, width, height, 0x000000, 0.7)
      .setDepth(500).setInteractive();
    this._pauseGroup.push(overlay);

    // Pannello 380×280
    const panel = drawPanel(this, cx, cy, 380, 280, {
      radius: 14, fill: 0x111520, border: 0xc9a84c, borderWidth: 2, depth: 501
    });
    this._pauseGroup.push(panel);

    // Titolo "IN PAUSA"
    const title = this.add.text(cx, cy - 105, this._t('inPausa'), {
      fontFamily: FONT_TITLE, fontSize: '28px',
      color: '#' + (0xf0d880).toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(502);
    this._pauseGroup.push(title);

    // Bottone 1: RIPRENDI
    const btnY1 = cy - 38;
    const { bg: bg1, txt: txt1 } = createButton(this, cx, btnY1, 220, 40, this._t('riprendi'), {
      fill: 0x1a2540, hover: 0x253560, border: 0xc9a84c, borderWidth: 2,
      radius: 8, depth: 502, fontSize: '15px', font: FONT_UI, fontStyle: '700', letterSpacing: 2,
      onClick: () => this._togglePause()
    });
    this._pauseGroup.push(bg1, txt1);

    // Bottone 2: IMPOSTAZIONI
    const btnY2 = cy + 14;
    const { bg: bg2, txt: txt2 } = createButton(this, cx, btnY2, 220, 40, this._t('impostazioni'), {
      fill: 0x1a2540, hover: 0x253560, border: 0xc9a84c, borderWidth: 2,
      radius: 8, depth: 502, fontSize: '15px', font: FONT_UI, fontStyle: '700', letterSpacing: 2,
      onClick: () => { this.scene.launch('Settings'); this.scene.pause(); }
    });
    this._pauseGroup.push(bg2, txt2);

    // Bottone 3: ABBANDONA RUN
    const btnY3 = cy + 66;
    const { bg: bg3, txt: txt3 } = createButton(this, cx, btnY3, 220, 40, this._t('abbandonaRun'), {
      fill: 0x3a1515, hover: 0x551f1f, border: 0xe05555, borderWidth: 2,
      radius: 8, depth: 502, fontSize: '15px', font: FONT_UI, fontStyle: '700', letterSpacing: 2,
      onClick: () => this._showAbandonConfirm()
    });
    this._pauseGroup.push(bg3, txt3);

    // Badge "⏸ PAUSA" in alto a sinistra (Task 3)
    const badge = this.add.graphics().setDepth(510);
    badge.fillStyle(0x1a2540, 0.92);
    badge.fillRoundedRect(8, 56, 60, 20, 5);
    badge.lineStyle(1, 0xc9a84c, 1);
    badge.strokeRoundedRect(8, 56, 60, 20, 5);
    this._pauseGroup.push(badge);
    const badgeTxt = this.add.text(38, 66, this._t('pausaBadge'), {
      fontFamily: FONT_UI, fontSize: '10px',
      color: '#' + (0xf0d880).toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(511);
    this._pauseGroup.push(badgeTxt);
  }

  _closePause() {
    this._pauseGroup.forEach(o => { if (o && o.active !== false) o.destroy(); });
    this._pauseGroup = [];
  }

  _showAbandonConfirm() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Rimuove bottoni pausa e lascia overlay + panel, aggiunge dialog conferma
    // Per semplicità, distrugge tutto e mostra un dialog di conferma sopra
    this._closePause();

    const confirmGroup = [];

    // Overlay
    const ov = this.add.rectangle(cx, cy, width, height, 0x000000, 0.75)
      .setDepth(510).setInteractive();
    confirmGroup.push(ov);

    // Pannello 300×180
    const pnl = drawPanel(this, cx, cy, 300, 180, {
      radius: 12, fill: 0x111520, border: 0xe05555, borderWidth: 2, depth: 511
    });
    confirmGroup.push(pnl);

    const msg = this.add.text(cx, cy - 52, this._t('abbandonareTitolo'), {
      fontFamily: FONT_TITLE, fontSize: '18px',
      color: '#' + (0xeaf0ff).toString(16).padStart(6, '0'),
      fontStyle: '700'
    }).setOrigin(0.5).setDepth(512);
    confirmGroup.push(msg);

    const sub = this.add.text(cx, cy - 20, this._t('abbandonareSub'), {
      fontFamily: FONT_UI, fontSize: '12px',
      color: '#' + (0x7a89aa).toString(16).padStart(6, '0'),
    }).setOrigin(0.5).setDepth(512);
    confirmGroup.push(sub);

    // SÌ
    const { bg: yBg, txt: yTxt } = createButton(this, cx - 65, cy + 38, 110, 38, this._t('si'), {
      fill: 0x3a1515, hover: 0x551f1f, border: 0xe05555, borderWidth: 2,
      radius: 8, depth: 512, fontSize: '15px', font: FONT_UI, fontStyle: '700', letterSpacing: 2,
      onClick: () => {
        confirmGroup.forEach(o => { if (o && o.active !== false) o.destroy(); });
        SaveManager.clearRun();
        this.scene.start('MainMenu');
      }
    });
    confirmGroup.push(yBg, yTxt);

    // NO
    const { bg: nBg, txt: nTxt } = createButton(this, cx + 65, cy + 38, 110, 38, this._t('no'), {
      fill: 0x1a2540, hover: 0x253560, border: 0xc9a84c, borderWidth: 2,
      radius: 8, depth: 512, fontSize: '15px', font: FONT_UI, fontStyle: '700', letterSpacing: 2,
      onClick: () => {
        confirmGroup.forEach(o => { if (o && o.active !== false) o.destroy(); });
        // Torna alla pausa
        this._openPause();
      }
    });
    confirmGroup.push(nBg, nTxt);
  }

  // =============================================
  // ACHIEVEMENT POPUP
  // =============================================

  showAchievementPopups(achievements) {
    if (!achievements || achievements.length === 0) return;

    const { width, height } = this.scale;
    const popupX = width - 170;
    const popupY = height - 60;
    const popupW = 300;
    const popupH = 60;
    const fadeDuration = 300;
    const holdDuration = 2500;

    const showNext = (index) => {
      if (index >= achievements.length) return;
      const ach = achievements[index];

      const panel = this.add.rectangle(popupX, popupY, popupW, popupH, C.bgPanel)
        .setStrokeStyle(2, C.borderGold)
        .setDepth(300)
        .setAlpha(0);

      const label = this.add.text(popupX, popupY - 8, this._t('achievementLabel'), {
        fontFamily: FONT_UI, fontSize: '11px',
        color: '#' + C.textGold.toString(16).padStart(6, '0'),
        fontStyle: '700'
      }).setOrigin(0.5).setDepth(301).setAlpha(0);

      const nameText = this.add.text(popupX, popupY + 10, LocaleManager.name(ach), {
        fontFamily: FONT_UI, fontSize: '13px',
        color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
        fontStyle: '700'
      }).setOrigin(0.5).setDepth(301).setAlpha(0);

      const targets = [panel, label, nameText];

      // Fade in
      this.tweens.add({
        targets,
        alpha: 1,
        duration: fadeDuration,
        ease: 'Power2',
        onComplete: () => {
          // Hold then fade out
          this.time.delayedCall(holdDuration, () => {
            this.tweens.add({
              targets,
              alpha: 0,
              duration: fadeDuration,
              ease: 'Power2',
              onComplete: () => {
                targets.forEach(t => t.destroy());
                showNext(index + 1);
              }
            });
          });
        }
      });
    };

    showNext(0);
  }
}
