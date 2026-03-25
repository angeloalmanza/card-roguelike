/**
 * Classi giocabili.
 * Ogni classe definisce HP, mazzo iniziale, reliquia di partenza e requisito di sblocco.
 */

export const CLASSES = [
  {
    id: 'warrior',
    name: 'Guerriero',
    nameEn: 'Warrior',
    emoji: '⚔️',
    description: 'Combattente robusto con alto HP e attacchi potenti.',
    descriptionEn: 'Robust fighter with high HP and powerful attacks.',
    unlockRequirement: 0,
    maxHp: 90,
    maxEnergy: 3,
    starterRelicId: 'ironRing',
    classRelicIds: ['warriorCrest', 'berserkerRage'],
    classAbility: {
      name: 'Grido di Guerra',
      nameEn: 'Battle Cry',
      description: '+8 blocco immediato e +1 forza per questo turno.', // bilanciamento: ridotto da +10/+2 a +8/+1
      descriptionEn: '+8 immediate block and +1 strength for this turn.',
      emoji: '⚔️',
      cooldown: 'once'
    },
    starterDeck: [
      { name: 'Fendente',      nameEn: 'Slash',       type: 'attack', cost: 1, value: 9,  description: 'Infliggi 9 danni.',  descriptionEn: 'Deal 9 damage.' },
      { name: 'Fendente',      nameEn: 'Slash',       type: 'attack', cost: 1, value: 9,  description: 'Infliggi 9 danni.',  descriptionEn: 'Deal 9 damage.' },
      { name: 'Fendente',      nameEn: 'Slash',       type: 'attack', cost: 1, value: 9,  description: 'Infliggi 9 danni.',  descriptionEn: 'Deal 9 damage.' },
      { name: 'Colpo',         nameEn: 'Strike',      type: 'attack', cost: 1, value: 6,  description: 'Infliggi 6 danni.',  descriptionEn: 'Deal 6 damage.' },
      { name: 'Grido di Guerra', nameEn: 'Battle Cry', type: 'skill', cost: 1, value: 3, extraStrength: 3, description: '+3 forza questo turno.', descriptionEn: '+3 strength this turn.' }, // bilanciamento: sostituisce 1 Colpo per dare più identità al Guerriero
      { name: 'Difesa',        nameEn: 'Defend',      type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.',  descriptionEn: 'Gain 5 block.' },
      { name: 'Difesa',        nameEn: 'Defend',      type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.',  descriptionEn: 'Gain 5 block.' },
      { name: 'Difesa',        nameEn: 'Defend',      type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.',  descriptionEn: 'Gain 5 block.' },
      { name: 'Forza',         nameEn: 'Strength',    type: 'skill',  cost: 1, value: 3,  extraStrength: 3, description: '+3 forza questo turno.', descriptionEn: '+3 strength this turn.' },
      { name: 'Forza',         nameEn: 'Strength',    type: 'skill',  cost: 1, value: 3,  extraStrength: 3, description: '+3 forza questo turno.', descriptionEn: '+3 strength this turn.' },
    ],
  },
  {
    id: 'rogue',
    name: 'Ladro',
    nameEn: 'Rogue',
    emoji: '🗡️',
    description: 'Veloce e agile. Carte a costo 0 e sinergie con lo Slancio.',
    descriptionEn: 'Fast and agile. Cost-0 cards and synergies with Momentum.',
    unlockRequirement: 1,
    maxHp: 70,
    maxEnergy: 3,
    starterRelicId: 'vampireFang',
    classRelicIds: ['shadowCloak', 'poisonedBlade'],
    classAbility: {
      name: 'Ombra',
      nameEn: 'Shadow',
      description: 'Pesca 3 carte. Costa 0 energia.',
      descriptionEn: 'Draw 3 cards. Costs 0 energy.',
      emoji: '🗡️',
      cooldown: 'once'
    },
    starterDeck: [
      { name: 'Lama Rapida', nameEn: 'Quick Blade', type: 'attack', cost: 0, value: 4,  description: 'Infliggi 4 danni.\nCosta 0 energia.', descriptionEn: 'Deal 4 damage.\nCosts 0 energy.' },
      { name: 'Lama Rapida', nameEn: 'Quick Blade', type: 'attack', cost: 0, value: 4,  description: 'Infliggi 4 danni.\nCosta 0 energia.', descriptionEn: 'Deal 4 damage.\nCosts 0 energy.' },
      { name: 'Lama Rapida', nameEn: 'Quick Blade', type: 'attack', cost: 0, value: 4,  description: 'Infliggi 4 danni.\nCosta 0 energia.', descriptionEn: 'Deal 4 damage.\nCosts 0 energy.' },
      { name: 'Tiro Rapido', nameEn: 'Quick Shot',  type: 'attack', cost: 0, value: 3,  hits: 2, description: 'Infliggi 3 danni due volte.\nCosta 0 energia.', descriptionEn: 'Deal 3 damage twice.\nCosts 0 energy.' },
      { name: 'Tiro Rapido', nameEn: 'Quick Shot',  type: 'attack', cost: 0, value: 3,  hits: 2, description: 'Infliggi 3 danni due volte.\nCosta 0 energia.', descriptionEn: 'Deal 3 damage twice.\nCosts 0 energy.' },
      { name: 'Passo Agile', nameEn: 'Nimble Step', type: 'defend', cost: 1, value: 3,  drawCards: 2, description: 'Ottieni 3 blocco.\nPesca 2 carte.', descriptionEn: 'Gain 3 block.\nDraw 2 cards.' },
      { name: 'Passo Agile', nameEn: 'Nimble Step', type: 'defend', cost: 1, value: 3,  drawCards: 2, description: 'Ottieni 3 blocco.\nPesca 2 carte.', descriptionEn: 'Gain 3 block.\nDraw 2 cards.' },
      { name: 'Frenesia',    nameEn: 'Frenzy',      type: 'attack', cost: 1, value: 6,  slancioThreshold: 3, slancioBonus: 6, description: 'Infliggi 6 danni.\nSe hai Slancio ≥3: infliggi 6 danni extra.', descriptionEn: 'Deal 6 damage.\nIf you have Momentum ≥3: deal 6 extra damage.' },
      { name: 'Difesa',      nameEn: 'Defend',       type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.', descriptionEn: 'Gain 5 block.' },
      { name: 'Concentrazione', nameEn: 'Focus',     type: 'skill', cost: 0, value: 0, drawCards: 2, description: 'Pesca 2 carte.\nCosta 0 energia.', descriptionEn: 'Draw 2 cards.\nCosts 0 energy.' },
    ],
  },
  {
    id: 'alchemist',
    name: 'Alchimista',
    nameEn: 'Alchemist',
    emoji: '⚗️',
    description: 'Maestro di veleni e fuoco. Logora i nemici con status.',
    descriptionEn: 'Master of poisons and fire. Wears down enemies with status effects.',
    unlockRequirement: 3,
    maxHp: 70,
    maxEnergy: 3,
    starterRelicId: 'poisonRing',
    classRelicIds: ['alchemistFlask', 'explosiveMixture'],
    classAbility: {
      name: 'Fiala Tossica',
      nameEn: 'Toxic Vial',
      description: 'Applica 6 veleno al nemico.', // bilanciamento: ridotto da 8 a 6
      descriptionEn: 'Apply 6 poison to the enemy.',
      emoji: '⚗️',
      cooldown: 'once'
    },
    starterDeck: [
      { name: 'Freccia Avvelenata', nameEn: 'Poison Arrow', type: 'attack', cost: 1, value: 4,  applyPoison: 3, description: 'Infliggi 4 danni.\nVeleno 3 al nemico.', descriptionEn: 'Deal 4 damage.\nApply 3 Poison to the enemy.' },
      { name: 'Freccia Avvelenata', nameEn: 'Poison Arrow', type: 'attack', cost: 1, value: 4,  applyPoison: 3, description: 'Infliggi 4 danni.\nVeleno 3 al nemico.', descriptionEn: 'Deal 4 damage.\nApply 3 Poison to the enemy.' },
      { name: 'Freccia Avvelenata', nameEn: 'Poison Arrow', type: 'attack', cost: 1, value: 4,  applyPoison: 3, description: 'Infliggi 4 danni.\nVeleno 3 al nemico.', descriptionEn: 'Deal 4 damage.\nApply 3 Poison to the enemy.' },
      { name: 'Torcia',             nameEn: 'Torch',         type: 'attack', cost: 1, value: 6,  applyBurn: 5,   description: 'Infliggi 6 danni.\nBruciatura 5 al nemico.', descriptionEn: 'Deal 6 damage.\nApply 5 Burn to the enemy.' },
      { name: 'Torcia',             nameEn: 'Torch',         type: 'attack', cost: 1, value: 6,  applyBurn: 5,   description: 'Infliggi 6 danni.\nBruciatura 5 al nemico.', descriptionEn: 'Deal 6 damage.\nApply 5 Burn to the enemy.' },
      { name: 'Morso di Lama',      nameEn: 'Blade Bite',    type: 'attack', cost: 1, value: 5,  applyPoison: 2, description: 'Infliggi 5 danni.\nVeleno 2 al nemico.', descriptionEn: 'Deal 5 damage.\nApply 2 Poison to the enemy.' },
      { name: 'Difesa',             nameEn: 'Defend',         type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.', descriptionEn: 'Gain 5 block.' },
      { name: 'Difesa',             nameEn: 'Defend',         type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.', descriptionEn: 'Gain 5 block.' },
      { name: 'Concentrazione',     nameEn: 'Focus',          type: 'skill',  cost: 0, value: 0,  drawCards: 2, description: 'Pesca 2 carte.\nCosta 0 energia.', descriptionEn: 'Draw 2 cards.\nCosts 0 energy.' },
      { name: 'Colpo',              nameEn: 'Strike',          type: 'attack', cost: 1, value: 6,  description: 'Infliggi 6 danni.', descriptionEn: 'Deal 6 damage.' },
    ],
  },
];

export const CLASS_EMOJIS = {
  warrior:   '⚔️',
  rogue:     '🗡️',
  alchemist: '⚗️',
};
