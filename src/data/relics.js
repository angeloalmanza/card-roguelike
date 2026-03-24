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
    emoji: '💍',
    description: 'Inizio turno: +3 blocco.',
    rarity: 'common',
    trigger: 'onTurnStart',
    effect: { block: 3 }
  },

  redPotion: {
    id: 'redPotion',
    name: 'Pozione Rossa',
    emoji: '🧪',
    description: 'Inizio combattimento: +10 HP.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { heal: 10 }
  },

  whetstone: {
    id: 'whetstone',
    name: 'Pietra Affilata',
    emoji: '🪨',
    description: 'Inizio combattimento: +2 forza.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { strength: 2 }
  },

  shield: {
    id: 'shield',
    name: 'Scudo Antico',
    emoji: '🛡️',
    description: 'Inizio combattimento: +8 blocco.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { block: 8 }
  },

  boots: {
    id: 'boots',
    name: 'Stivali Rapidi',
    emoji: '👢',
    description: 'Pesca 1 carta extra per turno.',
    rarity: 'common',
    trigger: 'passive',
    effect: { drawCards: 1 }
  },

  healingHerb: {
    id: 'healingHerb',
    name: 'Erba Curativa',
    emoji: '🌿',
    description: 'Inizio turno: +2 HP.',
    rarity: 'common',
    trigger: 'onTurnStart',
    effect: { heal: 2 }
  },

  poisonRing: {
    id: 'poisonRing',
    name: 'Anello Avvelenato',
    emoji: '💚',
    description: 'Ogni carta attacco giocata: veleno 1 al nemico.',
    rarity: 'common',
    trigger: 'onPlayAttack',
    effect: { applyPoison: 1 }
  },

  ironWill: {
    id: 'ironWill',
    name: 'Volontà di Ferro',
    emoji: '🧲',
    description: 'Inizio combattimento: +15 HP.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { heal: 15 }
  },

  luckyCharm: {
    id: 'luckyCharm',
    name: 'Portafortuna',
    emoji: '🍀',
    description: '+5 HP massimi. Recupera 5 HP.',
    rarity: 'common',
    trigger: 'onPickup',
    effect: { maxHp: 5, heal: 5 }
  },

  warHorn: {
    id: 'warHorn',
    name: 'Corno da Guerra',
    emoji: '📯',
    description: 'Inizio combattimento: +2 forza al primo turno.',
    rarity: 'common',
    trigger: 'onCombatStart',
    effect: { strength: 2 }
  },

  // --- NON COMUNI (da elite) ---
  energyCrystal: {
    id: 'energyCrystal',
    name: 'Cristallo Energetico',
    emoji: '🔮',
    description: '+1 energia massima.',
    rarity: 'uncommon',
    trigger: 'passive',
    effect: { maxEnergy: 1 }
  },

  vampireFang: {
    id: 'vampireFang',
    name: 'Zanna Vampirica',
    emoji: '🦷',
    description: 'Ogni carta attacco giocata: +2 HP.',
    rarity: 'uncommon',
    trigger: 'onPlayAttack',
    effect: { heal: 2 }
  },

  thornArmor: {
    id: 'thornArmor',
    name: 'Armatura di Spine',
    emoji: '🌵',
    description: 'Quando vieni colpito: 3 danni al nemico.',
    rarity: 'uncommon',
    trigger: 'onTakeDamage',
    effect: { thorns: 3 }
  },

  warDrum: {
    id: 'warDrum',
    name: 'Tamburo di Guerra',
    emoji: '🥁',
    description: 'Inizio combattimento: +3 forza al primo turno.',
    rarity: 'uncommon',
    trigger: 'onCombatStart',
    effect: { strength: 3 }
  },

  frostArmor: {
    id: 'frostArmor',
    name: 'Armatura di Ghiaccio',
    emoji: '🧊',
    description: 'Quando vieni colpito: +4 blocco.',
    rarity: 'uncommon',
    trigger: 'onTakeDamage',
    effect: { block: 4 }
  },

  bloodPact: {
    id: 'bloodPact',
    name: 'Patto di Sangue',
    emoji: '🩸',
    description: 'Ogni carta attacco giocata: +3 HP.',
    rarity: 'uncommon',
    trigger: 'onPlayAttack',
    effect: { heal: 3 }
  },

  venomFang: {
    id: 'venomFang',
    name: 'Zanna Velenosa',
    emoji: '🐍',
    description: 'Inizio turno: +1 al veleno del nemico (se avvelenato).',
    rarity: 'uncommon',
    trigger: 'onTurnStart',
    effect: { incrementEnemyPoison: 1 }
  },

  battleScarred: {
    id: 'battleScarred',
    name: 'Cicatrici di Guerra',
    emoji: '🩹',
    description: 'Ogni volta che ricevi danno: +2 blocco.',
    rarity: 'uncommon',
    trigger: 'onTakeDamage',
    effect: { block: 2 }
  },

  energyOrb: {
    id: 'energyOrb',
    name: 'Orbe Energetico',
    emoji: '🔵',
    description: 'Uccidi un nemico: +1 energia questo turno.',
    rarity: 'uncommon',
    trigger: 'onKill',
    effect: { giveEnergy: 1 }
  },

  // --- RARE (da boss) ---
  crown: {
    id: 'crown',
    name: 'Corona del Re',
    emoji: '👑',
    description: '+1 energia massima. Pesca 1 carta extra.',
    rarity: 'rare',
    trigger: 'passive',
    effect: { maxEnergy: 1, drawCards: 1 }
  },

  demonHeart: {
    id: 'demonHeart',
    name: 'Cuore Demoniaco',
    emoji: '🫀',
    description: '+20 HP massimi. Recupera 20 HP.',
    rarity: 'rare',
    trigger: 'onPickup',
    effect: { maxHp: 20, heal: 20 }
  },

  infinityGauntlet: {
    id: 'infinityGauntlet',
    name: 'Guanto Infinito',
    emoji: '🧤',
    description: 'Ogni 3° carta attacco infligge danni doppi.',
    rarity: 'rare',
    trigger: 'onPlayAttack',
    effect: { doubleEveryN: 3 }
  },

  dragonScale: {
    id: 'dragonScale',
    name: 'Scaglia di Drago',
    emoji: '🐲',
    description: 'Quando vieni colpito: 5 danni di ritorno e +3 blocco.',
    rarity: 'rare',
    trigger: 'onTakeDamage',
    effect: { thorns: 5, block: 3 }
  },

  ancientTome: {
    id: 'ancientTome',
    name: 'Tomo Antico',
    emoji: '📖',
    description: 'Pesca 2 carte extra per turno.',
    rarity: 'rare',
    trigger: 'passive',
    effect: { drawCards: 2 }
  },

  berserkerHeart: {
    id: 'berserkerHeart',
    name: 'Cuore del Berserker',
    emoji: '❤️‍🔥',
    description: 'Ogni carta attacco giocata: +1 forza (si accumula).',
    rarity: 'rare',
    trigger: 'onPlayAttack',
    effect: { strength: 1 }
  },

  // --- ATTIVABILI (usabili una volta per combattimento) ---
  fireAmulet: {
    id: 'fireAmulet',
    name: 'Amuleto di Fuoco',
    emoji: '🔥',
    description: 'ATTIVA: infliggi 15 danni al nemico (1× per combattimento).',
    rarity: 'uncommon',
    trigger: 'activatable',
    activatable: true,
    activateEffect: { directDamage: 15 },
    effect: {}
  },

  healingStone: {
    id: 'healingStone',
    name: 'Pietra Curativa',
    emoji: '💠',
    description: 'ATTIVA: recupera 20 HP (1× per combattimento).',
    rarity: 'uncommon',
    trigger: 'activatable',
    activatable: true,
    activateEffect: { heal: 20 },
    effect: {}
  },

  thunderMask: {
    id: 'thunderMask',
    name: 'Maschera del Tuono',
    emoji: '⚡',
    description: 'ATTIVA: stordisci il nemico e infliggi 5 danni (1× per combattimento).',
    rarity: 'rare',
    trigger: 'activatable',
    activatable: true,
    activateEffect: { applyStun: 1, directDamage: 5 },
    effect: {}
  },

  poisonVial: {
    id: 'poisonVial',
    name: 'Fiala di Veleno',
    emoji: '🟢',
    description: 'ATTIVA: veleno 6 al nemico (1× per combattimento).',
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
    emoji: '🦴',
    description: '+1 danno per ogni nemico ucciso nella run.',
    rarity: 'uncommon',
    trigger: 'passive',
    stacking: true,
    stackEvent: 'onKill',
    effect: { bonusDamagePerAttack: 1 }
  },

  bloodGem: {
    id: 'bloodGem',
    name: 'Gemma di Sangue',
    emoji: '💎',
    description: '+2 HP massimi ogni 2 volte che vieni colpito nella run.',
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
    emoji: '🏆',
    description: '+2 oro extra per ogni combattimento vinto nella run.',
    rarity: 'common',
    trigger: 'passive',
    stacking: true,
    stackEvent: 'onKill',
    effect: { goldBonus: 2 }
  },

  killStreak: {
    id: 'killStreak',
    name: 'Serie di Uccisioni',
    emoji: '⚔️',
    description: '+3 danno per ogni 2 nemici uccisi nella run.',
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
    emoji: '🛡️',
    description: 'Inizio combattimento: +5 blocco e +1 forza.',
    rarity: 'rare',
    classId: 'warrior',
    trigger: 'onCombatStart',
    effect: { block: 5, strength: 1 }
  },

  berserkerRage: {
    id: 'berserkerRage',
    name: 'Furia Berserk',
    emoji: '🔥',
    description: 'Quando uccidi un nemico: +3 forza al prossimo combattimento.',
    rarity: 'rare',
    classId: 'warrior',
    trigger: 'onKill',
    effect: { stackStrength: 3 }
  },

  // --- ESCLUSIVE LADRO ---
  shadowCloak: {
    id: 'shadowCloak',
    name: 'Mantello d\'Ombra',
    emoji: '🌑',
    description: 'Inizio turno: pesca 1 carta extra.',
    rarity: 'rare',
    classId: 'rogue',
    trigger: 'onTurnStart',
    effect: { drawCards: 1 }
  },

  poisonedBlade: {
    id: 'poisonedBlade',
    name: 'Lama Avvelenata',
    emoji: '🗡️',
    description: 'Ogni carta attacco giocata: applica 1 veleno extra al nemico.',
    rarity: 'rare',
    classId: 'rogue',
    trigger: 'onPlayAttack',
    effect: { applyPoison: 1 }
  },

  // --- ESCLUSIVE ALCHIMISTA ---
  alchemistFlask: {
    id: 'alchemistFlask',
    name: 'Fiala dell\'Alchimista',
    emoji: '⚗️',
    description: 'Inizio combattimento: applica 3 veleno al nemico.',
    rarity: 'rare',
    classId: 'alchemist',
    trigger: 'onCombatStart',
    effect: { applyEnemyPoison: 3 }
  },

  explosiveMixture: {
    id: 'explosiveMixture',
    name: 'Miscela Esplosiva',
    emoji: '🧨',
    description: 'Inizio turno: applica 2 bruciatura al nemico.', // bilanciamento: ridotto da 3 a 2
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
