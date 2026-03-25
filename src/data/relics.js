/**
 * Database delle reliquie.
 *
 * Le reliquie sono artefatti passivi che il giocatore raccoglie durante la run.
 * Ogni reliquia ha un effetto che si attiva automaticamente.
 *
 * Tipi di trigger:
 * - onTurnStart: si attiva all'inizio di ogni turno
 * - onCombatStart: si attiva all'inizio di ogni combattimento
 * - onPlayAttack: si attiva quando giochi una carta attacco
 * - onPlayDefend: si attiva quando giochi una carta difesa
 * - onKill: si attiva quando uccidi un nemico
 * - passive: modifica una regola del gioco (es: +1 energia max)
 */
export const RELICS = {
  // --- COMUNI (da combattimenti normali) ---
  ironRing: {
    id: 'ironRing',
    name: 'Anello di Ferro',
    nameEn: 'Iron Ring',
    emoji: '💍',
    description: 'Inizio turno: +3 blocco.',
    descriptionEn: 'Turn start: +3 block.',
    rarity: 'common',
    trigger: 'onTurnStart',
    effect: { block: 3 }
  },

  redPotion: {
    id: 'redPotion',
    name: 'Pozione Rossa',
    nameEn: 'Red Potion',
    emoji: '🧪',
    description: 'Inizio combattimento: +10 HP.',
    descriptionEn: 'Combat start: +10 HP.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { heal: 10 }
  },

  whetstone: {
    id: 'whetstone',
    name: 'Pietra Affilata',
    nameEn: 'Whetstone',
    emoji: '🪨',
    description: 'Inizio combattimento: +2 forza.',
    descriptionEn: 'Combat start: +2 strength.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { strength: 2 }
  },

  shield: {
    id: 'shield',
    name: 'Scudo Antico',
    nameEn: 'Ancient Shield',
    emoji: '🛡️',
    description: 'Inizio combattimento: +8 blocco.',
    descriptionEn: 'Combat start: +8 block.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { block: 8 }
  },

  boots: {
    id: 'boots',
    name: 'Stivali Rapidi',
    nameEn: 'Swift Boots',
    emoji: '👢',
    description: 'Pesca 1 carta extra per turno.',
    descriptionEn: 'Draw 1 extra card per turn.',
    rarity: 'common',
    trigger: 'passive',
    effect: { drawCards: 1 }
  },

  healingHerb: {
    id: 'healingHerb',
    name: 'Erba Curativa',
    nameEn: 'Healing Herb',
    emoji: '🌿',
    description: 'Inizio turno: +2 HP.',
    descriptionEn: 'Turn start: +2 HP.',
    rarity: 'common',
    trigger: 'onTurnStart',
    effect: { heal: 2 }
  },

  poisonRing: {
    id: 'poisonRing',
    name: 'Anello Avvelenato',
    nameEn: 'Poison Ring',
    emoji: '💚',
    description: 'Ogni carta attacco giocata: veleno 1 al nemico.',
    descriptionEn: 'Each attack card played: apply 1 poison to the enemy.',
    rarity: 'common',
    trigger: 'onPlayAttack',
    effect: { applyPoison: 1 }
  },

  ironWill: {
    id: 'ironWill',
    name: 'Volontà di Ferro',
    nameEn: 'Iron Will',
    emoji: '🧲',
    description: 'Inizio combattimento: +15 HP.',
    descriptionEn: 'Combat start: +15 HP.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { heal: 15 }
  },

  luckyCharm: {
    id: 'luckyCharm',
    name: 'Portafortuna',
    nameEn: 'Lucky Charm',
    emoji: '🍀',
    description: '+5 HP massimi. Recupera 5 HP.',
    descriptionEn: '+5 max HP. Heal 5 HP.',
    rarity: 'common',
    trigger: 'onPickup',
    effect: { maxHp: 5, heal: 5 }
  },

  warHorn: {
    id: 'warHorn',
    name: 'Corno da Guerra',
    nameEn: 'War Horn',
    emoji: '📯',
    description: 'Inizio combattimento: +2 forza al primo turno.',
    descriptionEn: 'Combat start: +2 strength on the first turn.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { strength: 2 }
  },

  // --- NON COMUNI (da elite) ---
  energyCrystal: {
    id: 'energyCrystal',
    name: 'Cristallo Energetico',
    nameEn: 'Energy Crystal',
    emoji: '🔮',
    description: '+1 energia massima.',
    descriptionEn: '+1 max energy.',
    rarity: 'uncommon',
    trigger: 'passive',
    effect: { maxEnergy: 1 }
  },

  vampireFang: {
    id: 'vampireFang',
    name: 'Zanna Vampirica',
    nameEn: 'Vampire Fang',
    emoji: '🦷',
    description: 'Ogni carta attacco giocata: +2 HP.',
    descriptionEn: 'Each attack card played: +2 HP.',
    rarity: 'uncommon',
    trigger: 'onPlayAttack',
    effect: { heal: 2 }
  },

  thornArmor: {
    id: 'thornArmor',
    name: 'Armatura di Spine',
    nameEn: 'Thorn Armor',
    emoji: '🌵',
    description: 'Quando vieni colpito: 3 danni al nemico.',
    descriptionEn: 'When hit: deal 3 damage to the enemy.',
    rarity: 'uncommon',
    trigger: 'onTakeDamage',
    effect: { thorns: 3 }
  },

  warDrum: {
    id: 'warDrum',
    name: 'Tamburo di Guerra',
    nameEn: 'War Drum',
    emoji: '🥁',
    description: 'Inizio combattimento: +3 forza al primo turno.',
    descriptionEn: 'Combat start: +3 strength on the first turn.',
    rarity: 'uncommon',
    trigger: 'onCombatStart',
    effect: { strength: 3 }
  },

  frostArmor: {
    id: 'frostArmor',
    name: 'Armatura di Ghiaccio',
    nameEn: 'Frost Armor',
    emoji: '🧊',
    description: 'Quando vieni colpito: +4 blocco.',
    descriptionEn: 'When hit: +4 block.',
    rarity: 'uncommon',
    trigger: 'onTakeDamage',
    effect: { block: 4 }
  },

  bloodPact: {
    id: 'bloodPact',
    name: 'Patto di Sangue',
    nameEn: 'Blood Pact',
    emoji: '🩸',
    description: 'Ogni carta attacco giocata: +3 HP.',
    descriptionEn: 'Each attack card played: +3 HP.',
    rarity: 'uncommon',
    trigger: 'onPlayAttack',
    effect: { heal: 3 }
  },

  venomFang: {
    id: 'venomFang',
    name: 'Zanna Velenosa',
    nameEn: 'Venom Fang',
    emoji: '🐍',
    description: 'Inizio turno: +1 al veleno del nemico (se avvelenato).',
    descriptionEn: 'Turn start: +1 to the enemy\'s poison (if poisoned).',
    rarity: 'uncommon',
    trigger: 'onTurnStart',
    effect: { incrementEnemyPoison: 1 }
  },

  battleScarred: {
    id: 'battleScarred',
    name: 'Cicatrici di Guerra',
    nameEn: 'Battle Scarred',
    emoji: '🩹',
    description: 'Ogni volta che ricevi danno: +2 blocco.',
    descriptionEn: 'Each time you take damage: +2 block.',
    rarity: 'uncommon',
    trigger: 'onTakeDamage',
    effect: { block: 2 }
  },

  energyOrb: {
    id: 'energyOrb',
    name: 'Orbe Energetico',
    nameEn: 'Energy Orb',
    emoji: '🔵',
    description: 'Uccidi un nemico: +1 energia questo turno.',
    descriptionEn: 'Kill an enemy: +1 energy this turn.',
    rarity: 'uncommon',
    trigger: 'onKill',
    effect: { giveEnergy: 1 }
  },

  // --- RARE (da boss) ---
  crown: {
    id: 'crown',
    name: 'Corona del Re',
    nameEn: 'King\'s Crown',
    emoji: '👑',
    description: '+1 energia massima. Pesca 1 carta extra.',
    descriptionEn: '+1 max energy. Draw 1 extra card.',
    rarity: 'rare',
    trigger: 'passive',
    effect: { maxEnergy: 1, drawCards: 1 }
  },

  demonHeart: {
    id: 'demonHeart',
    name: 'Cuore Demoniaco',
    nameEn: 'Demon Heart',
    emoji: '🫀',
    description: '+20 HP massimi. Recupera 20 HP.',
    descriptionEn: '+20 max HP. Heal 20 HP.',
    rarity: 'rare',
    trigger: 'onPickup',
    effect: { maxHp: 20, heal: 20 }
  },

  infinityGauntlet: {
    id: 'infinityGauntlet',
    name: 'Guanto Infinito',
    nameEn: 'Infinity Gauntlet',
    emoji: '🧤',
    description: 'Ogni 3° carta attacco infligge danni doppi.',
    descriptionEn: 'Every 3rd attack card deals double damage.',
    rarity: 'rare',
    trigger: 'onPlayAttack',
    effect: { doubleEveryN: 3 }
  },

  dragonScale: {
    id: 'dragonScale',
    name: 'Scaglia di Drago',
    nameEn: 'Dragon Scale',
    emoji: '🐲',
    description: 'Quando vieni colpito: 5 danni di ritorno e +3 blocco.',
    descriptionEn: 'When hit: deal 5 damage back and gain +3 block.',
    rarity: 'rare',
    trigger: 'onTakeDamage',
    effect: { thorns: 5, block: 3 }
  },

  ancientTome: {
    id: 'ancientTome',
    name: 'Tomo Antico',
    nameEn: 'Ancient Tome',
    emoji: '📖',
    description: 'Pesca 2 carte extra per turno.',
    descriptionEn: 'Draw 2 extra cards per turn.',
    rarity: 'rare',
    trigger: 'passive',
    effect: { drawCards: 2 }
  },

  berserkerHeart: {
    id: 'berserkerHeart',
    name: 'Cuore del Berserker',
    nameEn: 'Berserker Heart',
    emoji: '❤️‍🔥',
    description: 'Ogni carta attacco giocata: +1 forza (si accumula).',
    descriptionEn: 'Each attack card played: +1 strength (stacks).',
    rarity: 'rare',
    trigger: 'onPlayAttack',
    effect: { strength: 1 }
  },

  // --- ATTIVABILI (usabili una volta per combattimento) ---
  fireAmulet: {
    id: 'fireAmulet',
    name: 'Amuleto di Fuoco',
    nameEn: 'Fire Amulet',
    emoji: '🔥',
    description: 'ATTIVA: infliggi 15 danni al nemico (1× per combattimento).',
    descriptionEn: 'ACTIVATE: deal 15 damage to the enemy (1× per combat).',
    rarity: 'uncommon',
    trigger: 'activatable',
    activatable: true,
    activateEffect: { directDamage: 15 },
    effect: {}
  },

  healingStone: {
    id: 'healingStone',
    name: 'Pietra Curativa',
    nameEn: 'Healing Stone',
    emoji: '💠',
    description: 'ATTIVA: recupera 20 HP (1× per combattimento).',
    descriptionEn: 'ACTIVATE: heal 20 HP (1× per combat).',
    rarity: 'uncommon',
    trigger: 'activatable',
    activatable: true,
    activateEffect: { heal: 20 },
    effect: {}
  },

  thunderMask: {
    id: 'thunderMask',
    name: 'Maschera del Tuono',
    nameEn: 'Thunder Mask',
    emoji: '⚡',
    description: 'ATTIVA: stordisci il nemico e infliggi 5 danni (1× per combattimento).',
    descriptionEn: 'ACTIVATE: stun the enemy and deal 5 damage (1× per combat).',
    rarity: 'rare',
    trigger: 'activatable',
    activatable: true,
    activateEffect: { applyStun: 1, directDamage: 5 },
    effect: {}
  },

  poisonVial: {
    id: 'poisonVial',
    name: 'Fiala di Veleno',
    nameEn: 'Poison Vial',
    emoji: '🟢',
    description: 'ATTIVA: veleno 6 al nemico (1× per combattimento).',
    descriptionEn: 'ACTIVATE: apply 6 poison to the enemy (1× per combat).',
    rarity: 'uncommon',
    trigger: 'activatable',
    activatable: true,
    activateEffect: { applyPoison: 6 },
    effect: {}
  },

  // --- A STACK (crescono durante la run) ---
  hunterTooth: {
    id: 'hunterTooth',
    name: 'Dente del Cacciatore',
    nameEn: 'Hunter\'s Tooth',
    emoji: '🦴',
    description: '+1 danno per ogni nemico ucciso nella run.',
    descriptionEn: '+1 damage for every enemy killed in the run.',
    rarity: 'uncommon',
    trigger: 'passive',
    stacking: true,
    stackEvent: 'onKill',
    effect: { bonusDamagePerAttack: 1 }
  },

  bloodGem: {
    id: 'bloodGem',
    name: 'Gemma di Sangue',
    nameEn: 'Blood Gem',
    emoji: '💎',
    description: '+2 HP massimi ogni 2 volte che vieni colpito nella run.',
    descriptionEn: '+2 max HP every 2 times you are hit in the run.',
    rarity: 'rare',
    trigger: 'passive',
    stacking: true,
    stackEvent: 'onTakeDamage',
    stackThreshold: 2,
    effect: { maxHpPerStack: 2 }
  },

  warTrophy: {
    id: 'warTrophy',
    name: 'Trofeo di Guerra',
    nameEn: 'War Trophy',
    emoji: '🏆',
    description: '+2 oro extra per ogni combattimento vinto nella run.',
    descriptionEn: '+2 extra gold for every combat won in the run.',
    rarity: 'common',
    trigger: 'passive',
    stacking: true,
    stackEvent: 'onKill',
    effect: { goldBonus: 2 }
  },

  killStreak: {
    id: 'killStreak',
    name: 'Serie di Uccisioni',
    nameEn: 'Kill Streak',
    emoji: '⚔️',
    description: '+3 danno per ogni 2 nemici uccisi nella run.',
    descriptionEn: '+3 damage for every 2 enemies killed in the run.',
    rarity: 'rare',
    trigger: 'passive',
    stacking: true,
    stackEvent: 'onKill',
    stackThreshold: 2,
    effect: { bonusDamagePerAttack: 3 }
  },

  // --- ESCLUSIVE GUERRIERO ---
  warriorCrest: {
    id: 'warriorCrest',
    name: 'Stemma del Guerriero',
    nameEn: 'Warrior\'s Crest',
    emoji: '🛡️',
    description: 'Inizio combattimento: +5 blocco e +1 forza.',
    descriptionEn: 'Combat start: +5 block and +1 strength.',
    rarity: 'rare',
    classId: 'warrior',
    trigger: 'onCombatStart',
    effect: { block: 5, strength: 1 }
  },

  berserkerRage: {
    id: 'berserkerRage',
    name: 'Furia Berserk',
    nameEn: 'Berserker Rage',
    emoji: '🔥',
    description: 'Quando uccidi un nemico: +3 forza al prossimo combattimento.',
    descriptionEn: 'When you kill an enemy: +3 strength in the next combat.',
    rarity: 'rare',
    classId: 'warrior',
    trigger: 'onKill',
    effect: { stackStrength: 3 }
  },

  // --- ESCLUSIVE LADRO ---
  shadowCloak: {
    id: 'shadowCloak',
    name: 'Mantello d\'Ombra',
    nameEn: 'Shadow Cloak',
    emoji: '🌑',
    description: 'Inizio turno: pesca 1 carta extra.',
    descriptionEn: 'Turn start: draw 1 extra card.',
    rarity: 'rare',
    classId: 'rogue',
    trigger: 'onTurnStart',
    effect: { drawCards: 1 }
  },

  poisonedBlade: {
    id: 'poisonedBlade',
    name: 'Lama Avvelenata',
    nameEn: 'Poisoned Blade',
    emoji: '🗡️',
    description: 'Ogni carta attacco giocata: applica 1 veleno extra al nemico.',
    descriptionEn: 'Each attack card played: apply 1 extra poison to the enemy.',
    rarity: 'rare',
    classId: 'rogue',
    trigger: 'onPlayAttack',
    effect: { applyPoison: 1 }
  },

  // --- ESCLUSIVE ALCHIMISTA ---
  alchemistFlask: {
    id: 'alchemistFlask',
    name: 'Fiala dell\'Alchimista',
    nameEn: 'Alchemist\'s Flask',
    emoji: '⚗️',
    description: 'Inizio combattimento: applica 3 veleno al nemico.',
    descriptionEn: 'Combat start: apply 3 poison to the enemy.',
    rarity: 'rare',
    classId: 'alchemist',
    trigger: 'onCombatStart',
    effect: { applyEnemyPoison: 3 }
  },

  explosiveMixture: {
    id: 'explosiveMixture',
    name: 'Miscela Esplosiva',
    nameEn: 'Explosive Mixture',
    emoji: '🧨',
    description: 'Inizio turno: applica 2 bruciatura al nemico.', // bilanciamento: ridotto da 3 a 2
    descriptionEn: 'Turn start: apply 2 burn to the enemy.',
    rarity: 'rare',
    classId: 'alchemist',
    trigger: 'onTurnStart',
    effect: { applyEnemyBurn: 2 } // bilanciamento: ridotto da 3 a 2
  }
};

/**
 * Ottieni reliquie per rarità.
 */
export function getRelicsByRarity(rarity) {
  return Object.values(RELICS).filter(r => r.rarity === rarity);
}

/**
 * Genera una reliquia casuale in base al tipo di nodo.
 */
export function generateRelic(nodeType = 'combat') {
  let pool;
  switch (nodeType) {
    case 'boss':
      pool = getRelicsByRarity('rare');
      break;
    case 'elite':
      pool = getRelicsByRarity('uncommon');
      break;
    default:
      pool = getRelicsByRarity('common');
      break;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
