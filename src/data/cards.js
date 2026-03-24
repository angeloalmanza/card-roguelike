/**
 * Database delle carte.
 */

export const STARTER_DECK = [
  { name: 'Colpo',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.' },
  { name: 'Colpo',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.' },
  { name: 'Colpo',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.' },
  { name: 'Colpo',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.' },
  { name: 'Colpo',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.' },
  { name: 'Difesa', type: 'defend', cost: 1, value: 5, description: 'Ottieni 5 blocco.' },
  { name: 'Difesa', type: 'defend', cost: 1, value: 5, description: 'Ottieni 5 blocco.' },
  { name: 'Difesa', type: 'defend', cost: 1, value: 5, description: 'Ottieni 5 blocco.' },
  { name: 'Difesa', type: 'defend', cost: 1, value: 5, description: 'Ottieni 5 blocco.' },
  { name: 'Forza',  type: 'skill',  cost: 1, value: 3, extraStrength: 3, description: '+3 forza questo turno.' },
];

// Maledizioni (M2B) — carte negative che penalizzano il giocatore
export const CURSES = [
  { name: 'Ferita',       type: 'curse', cost: 0, value: 0, isCurse: true, selfDamage: 4,   description: 'Ricevi 4 danni quando giocata.' },
  { name: 'Affaticamento',type: 'curse', cost: 0, value: 0, isCurse: true, curseDiscard: 1, description: 'Scarta 1 carta dalla mano.' },
  { name: 'Panico',       type: 'curse', cost: 1, value: 0, isCurse: true,                  description: 'Non fa nulla. Spreca 1 energia.' },
  { name: 'Malocchio',    type: 'curse', cost: 0, value: 0, isCurse: true, curseBlock: 5,   description: 'Il nemico guadagna 5 blocco.' },
];

export const REWARD_CARDS = {
  // ========================
  // COMUNI (12 carte)
  // ========================
  common: [
    { name: 'Fendente',       type: 'attack', cost: 1, value: 9,  description: 'Infliggi 9 danni.', price: 50 },
    { name: 'Scudo di Ferro', type: 'defend', cost: 1, value: 8,  description: 'Ottieni 8 blocco.', price: 50 },
    { name: 'Doppio Colpo',   type: 'attack', cost: 1, value: 4,  description: 'Infliggi 4 danni due volte.', hits: 2, price: 50 },
    { name: 'Grido di Guerra',type: 'skill',  cost: 1, value: 3,  extraStrength: 3, description: '+3 forza questo turno.', price: 50 },
    { name: 'Parata',         type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.\nPesca 1 carta.', drawCards: 1, price: 55 },
    { name: 'Lama Rapida',    type: 'attack', cost: 0, value: 4,  description: 'Infliggi 4 danni.\nCosta 0 energia.', price: 55 },
    { name: 'Passo Agile',    type: 'defend', cost: 1, value: 3,  description: 'Ottieni 3 blocco.\nPesca 2 carte.', drawCards: 2, price: 60 },
    { name: 'Colpo Selvaggio', type: 'attack', cost: 1, value: 12, description: 'Infliggi 12 danni.\nPerdi 3 HP.', selfDamage: 3, price: 50 },
    { name: 'Concentrazione', type: 'skill',  cost: 0, value: 0,  description: 'Pesca 2 carte.\nCosta 0 energia.', drawCards: 2, price: 65 },
    { name: 'Provocazione',   type: 'skill',  cost: 1, value: 1,  description: 'Ottieni 6 blocco.\n+1 forza per il combattimento.', blockFromSkill: 6, extraStrengthPermanent: 1, price: 55 },
    { name: 'Lancia',         type: 'attack', cost: 1, value: 7,  description: 'Infliggi 7 danni.\nOttieni 3 blocco.', blockOnAttack: 3, price: 55 },
    { name: 'Contrattacco',   type: 'defend', cost: 1, value: 6,  description: 'Ottieni 6 blocco.\nInfliggi 4 danni.', damageOnDefend: 4, price: 60 },
    { name: 'Giuramento', type: 'defend', cost: 1, value: 8, retain: true, description: 'Ottieni 8 blocco.\nNon viene scartata a fine turno.', price: 60 },
    { name: 'Scudo Energizzato', type: 'defend', cost: 1, value: 8, chargeBonus: 2, description: 'Ottieni 8 blocco.\n+2 Carica invece di +1.', price: 65 },
    { name: 'Morso di Lama',   type: 'attack', cost: 1, value: 5,  applyPoison: 2, description: 'Infliggi 5 danni.\nVeleno 2 al nemico.', price: 55 },
    { name: 'Tiro Rapido',     type: 'attack', cost: 0, value: 3,  hits: 2, description: 'Infliggi 3 danni due volte.\nCosta 0 energia.', price: 60 },
    { name: 'Scudo Spinato',   type: 'defend', cost: 1, value: 7,  damageOnDefend: 3, description: 'Ottieni 7 blocco.\nInfliggi 3 danni.', price: 55 },
    { name: 'Grido di Rabbia', type: 'skill',  cost: 0, value: 0,  extraStrength: 2, drawCards: 1, description: '+2 forza questo turno.\nPesca 1 carta.\nCosta 0 energia.', price: 60 },
    { name: 'Baluardo',        type: 'defend', cost: 2, value: 15, description: 'Ottieni 15 blocco.', price: 55 },
    // Carte combo (M5)
    { name: 'Combo Iniziale', type: 'attack', cost: 1, value: 5, comboBonus: { minCards: 3, extraDamage: 5 }, description: 'Infliggi 5 danni.\nSe hai \u22653 carte in mano: +5 danni.', price: 55 },
    { name: 'Scudo Reattivo', type: 'defend', cost: 1, value: 4, comboBonus: { requiresBlock: true, extraBlock: 6 }, description: 'Ottieni 4 blocco.\nSe hai gi\u00E0 blocco attivo: +6 blocco extra.', price: 55 },
    { name: 'Slancio Agile',  type: 'attack', cost: 0, value: 3, slancioThreshold: 2, slancioBonus: 5, description: 'Infliggi 3 danni.\nSe hai Slancio \u22652: +5 danni. Costa 0.', price: 60 },
  ],

  // ========================
  // NON COMUNI (13 carte — +3 con status)
  // ========================
  uncommon: [
    { name: 'Colpo Potente',    type: 'attack', cost: 2, value: 16, description: 'Infliggi 16 danni.', price: 80 },
    { name: 'Muro di Scudi',    type: 'defend', cost: 2, value: 14, description: 'Ottieni 14 blocco.', price: 80 },
    { name: 'Furia',            type: 'skill',  cost: 1, value: 5,  extraStrength: 5, description: '+5 forza questo turno.', price: 85 },
    { name: 'Raffica',          type: 'attack', cost: 1, value: 3,  description: 'Infliggi 3 danni tre volte.', hits: 3, price: 85 },
    { name: 'Recupero',         type: 'skill',  cost: 1, value: 0,  description: 'Recupera 8 HP.', heal: 8, price: 90 },
    { name: 'Preparazione',     type: 'skill',  cost: 1, value: 0,  description: 'Pesca 3 carte.\n+1 energia.', drawCards: 3, giveEnergy: 1, price: 75 },
    { name: 'Impeto',           type: 'attack', cost: 2, value: 10, description: 'Infliggi 10 danni.\nPesca 2 carte.', drawCards: 2, price: 90 },
    { name: 'Barriera Magica',  type: 'defend', cost: 2, value: 12, description: 'Ottieni 12 blocco.\nPesca 1 carta.', drawCards: 1, price: 85 },
    { name: 'Vampirismo',       type: 'attack', cost: 2, value: 13, description: 'Infliggi 13 danni.\nRecupera 4 HP.', healOnAttack: 4, price: 95 },
    { name: 'Addestramento',    type: 'skill',  cost: 1, value: 2,  extraStrengthPermanent: 2, description: '+2 forza per il combattimento.\n+1 energia.', giveEnergy: 1, price: 85 },
    // Carte con status (M3)
    { name: 'Freccia Avvelenata', type: 'attack', cost: 1, value: 4, applyPoison: 3, description: 'Infliggi 4 danni.\nVeleno 3 al nemico.', price: 80 },
    { name: 'Torcia',             type: 'attack', cost: 1, value: 6, applyBurn: 5,   description: 'Infliggi 6 danni.\nBruciatura 5 al nemico.', price: 80 },
    { name: 'Morso di Serpe',     type: 'attack', cost: 2, value: 8, applyPoison: 5, description: 'Infliggi 8 danni.\nVeleno 5 al nemico.', price: 95 },
    { name: 'Lama Consacrata', type: 'attack', cost: 1, value: 9, retain: true, description: 'Infliggi 9 danni.\nNon viene scartata a fine turno.', price: 90 },
    { name: 'Memoria di Battaglia', type: 'skill', cost: 0, value: 0, retain: true, drawCards: 1, description: 'Pesca 1 carta.\nNon viene scartata a fine turno.', price: 80 },
    { name: 'Frenesia', type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.\nSe hai Slancio ≥3: infliggi 6 danni extra.', slancioThreshold: 3, slancioBonus: 6, price: 90 },
    { name: 'Frustata Avvelenata', type: 'attack', cost: 1, value: 7,  hits: 2, applyPoison: 2, description: 'Infliggi 7 danni due volte.\nVeleno 2 al nemico.', price: 90 },
    { name: 'Piro Lancio',         type: 'attack', cost: 1, value: 8,  applyBurn: 6, description: 'Infliggi 8 danni.\nBruciatura 6 al nemico.', price: 85 },
    { name: 'Contrattacco Totale', type: 'defend', cost: 2, value: 10, damageOnDefend: 8, description: 'Ottieni 10 blocco.\nInfliggi 8 danni.', price: 95 },
    { name: 'Meditazione',         type: 'skill',  cost: 1, value: 0,  heal: 5, drawCards: 2, description: 'Recupera 5 HP.\nPesca 2 carte.', price: 85 },
    { name: 'Assalto Frenetico',   type: 'attack', cost: 2, value: 5,  hits: 4, description: 'Infliggi 5 danni quattro volte.', price: 95 },
    // Carte combo (M5)
    { name: 'Lama Multipla',     type: 'attack', cost: 2, value: 6, hits: 3, comboBonus: { minCards: 4, extraHits: 1 }, description: 'Infliggi 6 danni 3 volte.\nSe hai \u22654 carte in mano: 1 colpo extra.', price: 90 },
    { name: 'Muro Vivente',      type: 'defend', cost: 2, value: 10, comboBonus: { requiresArmor: true, extraBlock: 8 }, description: 'Ottieni 10 blocco.\nSe hai Corazza attiva: +8 blocco extra.', price: 85 },
    { name: 'Concatenazione',    type: 'skill',  cost: 1, value: 0, drawCards: 2, comboBonus: { minCards: 2, giveEnergy: 1 }, description: 'Pesca 2 carte.\nSe avevi \u22652 carte in mano: +1 energia.', price: 85 },
  ],

  // ========================
  // RARE (9 carte — +1 con status)
  // ========================
  rare: [
    { name: 'Devastazione',       type: 'attack', cost: 3, value: 28, description: 'Infliggi 28 danni.', price: 130 },
    { name: 'Fortezza',           type: 'defend', cost: 3, value: 24, description: 'Ottieni 24 blocco.', price: 130 },
    { name: 'Berserk',            type: 'skill',  cost: 0, value: 1,  description: '+1 energia.\n+3 forza questo turno.', giveEnergy: 1, extraStrength: 3, price: 140 },
    { name: 'Lama del Fato',      type: 'attack', cost: 2, value: 6,  description: 'Infliggi 6 danni quattro volte.', hits: 4, price: 150 },
    { name: 'Scudo Divino',       type: 'defend', cost: 2, value: 12, description: 'Ottieni 12 blocco.\nPesca 2 carte.', drawCards: 2, price: 135 },
    { name: 'Tempesta di Lame',   type: 'attack', cost: 3, value: 5,  description: 'Infliggi 5 danni cinque volte.', hits: 5, price: 155 },
    { name: 'Scudo Eterno',       type: 'defend', cost: 1, value: 18, description: 'Ottieni 18 blocco.', price: 145 },
    { name: 'Rinascita',          type: 'skill',  cost: 2, value: 0,  description: 'Recupera 15 HP.\nPesca 1 carta.', heal: 15, drawCards: 1, price: 160 },
    // Carta stun (M3)
    { name: 'Polvere Paralizzante', type: 'skill', cost: 2, value: 0, applyStun: 1, description: 'Stordisce il nemico per 1 turno.', price: 140 },
    { name: 'Eco del Guerriero', type: 'attack', cost: 2, value: 14, retain: true, description: 'Infliggi 14 danni.\nNon viene scartata a fine turno.', price: 145 },
    { name: 'Tempesta Velenosa', type: 'attack', cost: 2, value: 8,  hits: 3, applyPoison: 4, description: 'Infliggi 8 danni tre volte.\nVeleno 4 al nemico.', price: 160 },
    { name: 'Bastione',          type: 'defend', cost: 2, value: 16, chargeBonus: 3, description: 'Ottieni 16 blocco.\n+3 Carica invece di +1.', price: 150 },
    { name: 'Colpo del Destino', type: 'attack', cost: 1, value: 8,  retain: true, slancioThreshold: 2, slancioBonus: 10, description: 'Infliggi 8 danni.\nNon viene scartata.\nSe Slancio ≥2: +10 danni.', price: 155 },
    { name: 'Catarsi',           type: 'skill',  cost: 2, value: 0,  heal: 20, drawCards: 2, giveEnergy: 1, description: 'Recupera 20 HP.\nPesca 2 carte.\n+1 energia.', price: 165 },
    { name: 'Colpo Letale',      type: 'attack', cost: 2, value: 24, description: 'Infliggi 24 danni.', price: 130 },
    { name: 'Frenesia Totale',   type: 'skill',  cost: 1, value: 8,  extraStrength: 8, description: '+8 forza questo turno.', price: 140 },
    { name: 'Esplodi',           type: 'attack', cost: 3, value: 12, hits: 3, description: 'Infliggi 12 danni tre volte.', price: 150 }, // bilanciamento: ridotto da 15 a 12
    { name: 'Rigenerazione',     type: 'skill',  cost: 2, value: 0,  heal: 15, drawCards: 3, description: 'Recupera 15 HP.\nPesca 3 carte.', price: 145 }, // bilanciamento: ridotto da 20 a 15
    { name: 'Lama del Destino',  type: 'attack', cost: 1, value: 8,  applyPoison: 5, applyBurn: 5, description: 'Infliggi 8 danni.\nVeleno 5 e Bruciatura 5.', price: 150 },
    // Carte combo (M5)
    { name: 'Gran Finale',       type: 'attack', cost: 3, value: 12, hits: 2, comboBonus: { minCards: 5, extraDamage: 10 }, description: 'Infliggi 12 danni due volte.\nSe hai \u22655 carte in mano: +10 danni extra.', price: 150 }, // bilanciamento: extraDamage ridotto da 15 a 10
    { name: 'Fortezza Assoluta', type: 'defend', cost: 2, value: 12, comboBonus: { requiresBlock: true, extraBlock: 12 }, description: 'Ottieni 12 blocco.\nSe hai gi\u00E0 blocco: +12 blocco extra.', price: 145 },
  ]
};

/**
 * Genera un set di carte ricompensa casuali.
 */
export function generateRewardCards(count = 3, nodeType = 'combat') {
  const cards = [];
  let maxAttempts = count * 10;

  for (let i = 0; i < count && maxAttempts > 0; i++) {
    maxAttempts--;
    const roll = Math.random();
    let rarity;

    if (nodeType === 'boss') {
      // 60% rare, 20% uncommon, 20% common
      if (roll < 0.60) rarity = 'rare';
      else if (roll < 0.80) rarity = 'uncommon';
      else rarity = 'common';
    } else if (nodeType === 'elite') {
      // 20% rare, 40% uncommon, 40% common
      if (roll < 0.20) rarity = 'rare';
      else if (roll < 0.60) rarity = 'uncommon';
      else rarity = 'common';
    } else {
      // 0% rare, 30% uncommon, 70% common
      if (roll < 0.30) rarity = 'uncommon';
      else rarity = 'common';
    }

    const pool = REWARD_CARDS[rarity];
    const card = { ...pool[Math.floor(Math.random() * pool.length)], rarity };

    if (!cards.some(c => c.name === card.name)) {
      cards.push(card);
    } else {
      i--;
    }
  }

  return cards;
}
