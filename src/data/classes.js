/**
 * Classi giocabili.
 * Ogni classe definisce HP, mazzo iniziale, reliquia di partenza e requisito di sblocco.
 */

export const CLASSES = [
  {
    id: 'warrior',
    name: 'Guerriero',
    emoji: '⚔️',
    description: 'Combattente robusto con alto HP e attacchi potenti.',
    unlockRequirement: 0,
    maxHp: 90,
    maxEnergy: 3,
    starterRelicId: 'ironRing',
    classRelicIds: ['warriorCrest', 'berserkerRage'],
    classAbility: {
      name: 'Grido di Guerra',
      description: '+8 blocco immediato e +1 forza per questo turno.', // bilanciamento: ridotto da +10/+2 a +8/+1
      emoji: '⚔️',
      cooldown: 'once'
    },
    starterDeck: [
      { name: 'Fendente',      type: 'attack', cost: 1, value: 9,  description: 'Infliggi 9 danni.' },
      { name: 'Fendente',      type: 'attack', cost: 1, value: 9,  description: 'Infliggi 9 danni.' },
      { name: 'Fendente',      type: 'attack', cost: 1, value: 9,  description: 'Infliggi 9 danni.' },
      { name: 'Colpo',         type: 'attack', cost: 1, value: 6,  description: 'Infliggi 6 danni.' },
      { name: 'Grido di Guerra', type: 'skill', cost: 1, value: 3, extraStrength: 3, description: '+3 forza questo turno.' }, // bilanciamento: sostituisce 1 Colpo per dare più identità al Guerriero
      { name: 'Difesa',        type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.' },
      { name: 'Difesa',        type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.' },
      { name: 'Difesa',        type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.' },
      { name: 'Forza',         type: 'skill',  cost: 1, value: 3,  extraStrength: 3, description: '+3 forza questo turno.' },
      { name: 'Forza',         type: 'skill',  cost: 1, value: 3,  extraStrength: 3, description: '+3 forza questo turno.' },
    ],
  },
  {
    id: 'rogue',
    name: 'Ladro',
    emoji: '🗡️',
    description: 'Veloce e agile. Carte a costo 0 e sinergie con lo Slancio.',
    unlockRequirement: 1,
    maxHp: 70,
    maxEnergy: 3,
    starterRelicId: 'vampireFang',
    classRelicIds: ['shadowCloak', 'poisonedBlade'],
    classAbility: {
      name: 'Ombra',
      description: 'Pesca 3 carte. Costa 0 energia.',
      emoji: '🗡️',
      cooldown: 'once'
    },
    starterDeck: [
      { name: 'Lama Rapida', type: 'attack', cost: 0, value: 4,  description: 'Infliggi 4 danni.\nCosta 0 energia.' },
      { name: 'Lama Rapida', type: 'attack', cost: 0, value: 4,  description: 'Infliggi 4 danni.\nCosta 0 energia.' },
      { name: 'Lama Rapida', type: 'attack', cost: 0, value: 4,  description: 'Infliggi 4 danni.\nCosta 0 energia.' },
      { name: 'Tiro Rapido', type: 'attack', cost: 0, value: 3,  hits: 2, description: 'Infliggi 3 danni due volte.\nCosta 0 energia.' },
      { name: 'Tiro Rapido', type: 'attack', cost: 0, value: 3,  hits: 2, description: 'Infliggi 3 danni due volte.\nCosta 0 energia.' },
      { name: 'Passo Agile', type: 'defend', cost: 1, value: 3,  drawCards: 2, description: 'Ottieni 3 blocco.\nPesca 2 carte.' },
      { name: 'Passo Agile', type: 'defend', cost: 1, value: 3,  drawCards: 2, description: 'Ottieni 3 blocco.\nPesca 2 carte.' },
      { name: 'Frenesia',    type: 'attack', cost: 1, value: 6,  slancioThreshold: 3, slancioBonus: 6, description: 'Infliggi 6 danni.\nSe hai Slancio ≥3: infliggi 6 danni extra.' },
      { name: 'Difesa',      type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.' },
      { name: 'Concentrazione', type: 'skill', cost: 0, value: 0, drawCards: 2, description: 'Pesca 2 carte.\nCosta 0 energia.' },
    ],
  },
  {
    id: 'alchemist',
    name: 'Alchimista',
    emoji: '⚗️',
    description: 'Maestro di veleni e fuoco. Logora i nemici con status.',
    unlockRequirement: 3,
    maxHp: 70,
    maxEnergy: 3,
    starterRelicId: 'poisonRing',
    classRelicIds: ['alchemistFlask', 'explosiveMixture'],
    classAbility: {
      name: 'Fiala Tossica',
      description: 'Applica 6 veleno al nemico.', // bilanciamento: ridotto da 8 a 6
      emoji: '⚗️',
      cooldown: 'once'
    },
    starterDeck: [
      { name: 'Freccia Avvelenata', type: 'attack', cost: 1, value: 4,  applyPoison: 3, description: 'Infliggi 4 danni.\nVeleno 3 al nemico.' },
      { name: 'Freccia Avvelenata', type: 'attack', cost: 1, value: 4,  applyPoison: 3, description: 'Infliggi 4 danni.\nVeleno 3 al nemico.' },
      { name: 'Freccia Avvelenata', type: 'attack', cost: 1, value: 4,  applyPoison: 3, description: 'Infliggi 4 danni.\nVeleno 3 al nemico.' },
      { name: 'Torcia',             type: 'attack', cost: 1, value: 6,  applyBurn: 5,   description: 'Infliggi 6 danni.\nBruciatura 5 al nemico.' },
      { name: 'Torcia',             type: 'attack', cost: 1, value: 6,  applyBurn: 5,   description: 'Infliggi 6 danni.\nBruciatura 5 al nemico.' },
      { name: 'Morso di Lama',      type: 'attack', cost: 1, value: 5,  applyPoison: 2, description: 'Infliggi 5 danni.\nVeleno 2 al nemico.' },
      { name: 'Difesa',             type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.' },
      { name: 'Difesa',             type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.' },
      { name: 'Concentrazione',     type: 'skill',  cost: 0, value: 0,  drawCards: 2, description: 'Pesca 2 carte.\nCosta 0 energia.' },
      { name: 'Colpo',              type: 'attack', cost: 1, value: 6,  description: 'Infliggi 6 danni.' },
    ],
  },
];

export const CLASS_EMOJIS = {
  warrior:   '⚔️',
  rogue:     '🗡️',
  alchemist: '⚗️',
};
