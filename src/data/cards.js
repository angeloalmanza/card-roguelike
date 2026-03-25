/**
 * Database delle carte.
 */

export const STARTER_DECK = [
  { name: 'Colpo',  nameEn: 'Strike',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.', descriptionEn: 'Deal 6 damage.' },
  { name: 'Colpo',  nameEn: 'Strike',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.', descriptionEn: 'Deal 6 damage.' },
  { name: 'Colpo',  nameEn: 'Strike',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.', descriptionEn: 'Deal 6 damage.' },
  { name: 'Colpo',  nameEn: 'Strike',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.', descriptionEn: 'Deal 6 damage.' },
  { name: 'Colpo',  nameEn: 'Strike',  type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.', descriptionEn: 'Deal 6 damage.' },
  { name: 'Difesa', nameEn: 'Defend',  type: 'defend', cost: 1, value: 5, description: 'Ottieni 5 blocco.', descriptionEn: 'Gain 5 block.' },
  { name: 'Difesa', nameEn: 'Defend',  type: 'defend', cost: 1, value: 5, description: 'Ottieni 5 blocco.', descriptionEn: 'Gain 5 block.' },
  { name: 'Difesa', nameEn: 'Defend',  type: 'defend', cost: 1, value: 5, description: 'Ottieni 5 blocco.', descriptionEn: 'Gain 5 block.' },
  { name: 'Difesa', nameEn: 'Defend',  type: 'defend', cost: 1, value: 5, description: 'Ottieni 5 blocco.', descriptionEn: 'Gain 5 block.' },
  { name: 'Forza',  nameEn: 'Strength', type: 'skill',  cost: 1, value: 3, extraStrength: 3, description: '+3 forza questo turno.', descriptionEn: '+3 strength this turn.' },
];

// Maledizioni (M2B) — carte negative che penalizzano il giocatore
export const CURSES = [
  { name: 'Ferita',       nameEn: 'Wound',      type: 'curse', cost: 0, value: 0, isCurse: true, selfDamage: 4,   description: 'Ricevi 4 danni quando giocata.', descriptionEn: 'Take 4 damage when played.' },
  { name: 'Affaticamento',nameEn: 'Exhaustion', type: 'curse', cost: 0, value: 0, isCurse: true, curseDiscard: 1, description: 'Scarta 1 carta dalla mano.', descriptionEn: 'Discard 1 card from your hand.' },
  { name: 'Panico',       nameEn: 'Panic',      type: 'curse', cost: 1, value: 0, isCurse: true,                  description: 'Non fa nulla. Spreca 1 energia.', descriptionEn: 'Does nothing. Wastes 1 energy.' },
  { name: 'Malocchio',    nameEn: 'Evil Eye',   type: 'curse', cost: 0, value: 0, isCurse: true, curseBlock: 5,   description: 'Il nemico guadagna 5 blocco.', descriptionEn: 'The enemy gains 5 block.' },
];

export const REWARD_CARDS = {
  // ========================
  // COMUNI (12 carte)
  // ========================
  common: [
    { name: 'Fendente',       nameEn: 'Slash',          type: 'attack', cost: 1, value: 9,  description: 'Infliggi 9 danni.', descriptionEn: 'Deal 9 damage.', price: 50 },
    { name: 'Scudo di Ferro', nameEn: 'Iron Shield',    type: 'defend', cost: 1, value: 8,  description: 'Ottieni 8 blocco.', descriptionEn: 'Gain 8 block.', price: 50 },
    { name: 'Doppio Colpo',   nameEn: 'Double Strike',  type: 'attack', cost: 1, value: 4,  description: 'Infliggi 4 danni due volte.', descriptionEn: 'Deal 4 damage twice.', hits: 2, price: 50 },
    { name: 'Grido di Guerra',nameEn: 'Battle Cry',     type: 'skill',  cost: 1, value: 3,  extraStrength: 3, description: '+3 forza questo turno.', descriptionEn: '+3 strength this turn.', price: 50 },
    { name: 'Parata',         nameEn: 'Parry',          type: 'defend', cost: 1, value: 5,  description: 'Ottieni 5 blocco.\nPesca 1 carta.', descriptionEn: 'Gain 5 block.\nDraw 1 card.', drawCards: 1, price: 55 },
    { name: 'Lama Rapida',    nameEn: 'Quick Blade',    type: 'attack', cost: 0, value: 4,  description: 'Infliggi 4 danni.\nCosta 0 energia.', descriptionEn: 'Deal 4 damage.\nCosts 0 energy.', price: 55 },
    { name: 'Passo Agile',    nameEn: 'Nimble Step',    type: 'defend', cost: 1, value: 3,  description: 'Ottieni 3 blocco.\nPesca 2 carte.', descriptionEn: 'Gain 3 block.\nDraw 2 cards.', drawCards: 2, price: 60 },
    { name: 'Colpo Selvaggio', nameEn: 'Wild Strike',   type: 'attack', cost: 1, value: 12, description: 'Infliggi 12 danni.\nPerdi 3 HP.', descriptionEn: 'Deal 12 damage.\nLose 3 HP.', selfDamage: 3, price: 50 },
    { name: 'Concentrazione', nameEn: 'Focus',          type: 'skill',  cost: 0, value: 0,  description: 'Pesca 2 carte.\nCosta 0 energia.', descriptionEn: 'Draw 2 cards.\nCosts 0 energy.', drawCards: 2, price: 65 },
    { name: 'Provocazione',   nameEn: 'Taunt',          type: 'skill',  cost: 1, value: 1,  description: 'Ottieni 6 blocco.\n+1 forza per il combattimento.', descriptionEn: 'Gain 6 block.\n+1 strength for the battle.', blockFromSkill: 6, extraStrengthPermanent: 1, price: 55 },
    { name: 'Lancia',         nameEn: 'Spear',          type: 'attack', cost: 1, value: 7,  description: 'Infliggi 7 danni.\nOttieni 3 blocco.', descriptionEn: 'Deal 7 damage.\nGain 3 block.', blockOnAttack: 3, price: 55 },
    { name: 'Contrattacco',   nameEn: 'Counter',        type: 'defend', cost: 1, value: 6,  description: 'Ottieni 6 blocco.\nInfliggi 4 danni.', descriptionEn: 'Gain 6 block.\nDeal 4 damage.', damageOnDefend: 4, price: 60 },
    { name: 'Giuramento', nameEn: 'Oath',               type: 'defend', cost: 1, value: 8, retain: true, description: 'Ottieni 8 blocco.\nNon viene scartata a fine turno.', descriptionEn: 'Gain 8 block.\nNot discarded at end of turn.', price: 60 },
    { name: 'Scudo Energizzato', nameEn: 'Charged Shield', type: 'defend', cost: 1, value: 8, chargeBonus: 2, description: 'Ottieni 8 blocco.\n+2 Carica invece di +1.', descriptionEn: 'Gain 8 block.\n+2 Charge instead of +1.', price: 65 },
    { name: 'Morso di Lama',   nameEn: 'Blade Bite',   type: 'attack', cost: 1, value: 5,  applyPoison: 2, description: 'Infliggi 5 danni.\nVeleno 2 al nemico.', descriptionEn: 'Deal 5 damage.\nApply 2 Poison to the enemy.', price: 55 },
    { name: 'Tiro Rapido',     nameEn: 'Quick Shot',   type: 'attack', cost: 0, value: 3,  hits: 2, description: 'Infliggi 3 danni due volte.\nCosta 0 energia.', descriptionEn: 'Deal 3 damage twice.\nCosts 0 energy.', price: 60 },
    { name: 'Scudo Spinato',   nameEn: 'Thorn Shield', type: 'defend', cost: 1, value: 7,  damageOnDefend: 3, description: 'Ottieni 7 blocco.\nInfliggi 3 danni.', descriptionEn: 'Gain 7 block.\nDeal 3 damage.', price: 55 },
    { name: 'Grido di Rabbia', nameEn: 'Rage Cry',     type: 'skill',  cost: 0, value: 0,  extraStrength: 2, drawCards: 1, description: '+2 forza questo turno.\nPesca 1 carta.\nCosta 0 energia.', descriptionEn: '+2 strength this turn.\nDraw 1 card.\nCosts 0 energy.', price: 60 },
    { name: 'Baluardo',        nameEn: 'Bulwark',      type: 'defend', cost: 2, value: 15, description: 'Ottieni 15 blocco.', descriptionEn: 'Gain 15 block.', price: 55 },
    // Carte combo (M5)
    { name: 'Combo Iniziale', nameEn: 'Opening Combo', type: 'attack', cost: 1, value: 5, comboBonus: { minCards: 3, extraDamage: 5 }, description: 'Infliggi 5 danni.\nSe hai \u22653 carte in mano: +5 danni.', descriptionEn: 'Deal 5 damage.\nIf you have \u22653 cards in hand: +5 damage.', price: 55 },
    { name: 'Scudo Reattivo', nameEn: 'Reactive Shield', type: 'defend', cost: 1, value: 4, comboBonus: { requiresBlock: true, extraBlock: 6 }, description: 'Ottieni 4 blocco.\nSe hai gi\u00E0 blocco attivo: +6 blocco extra.', descriptionEn: 'Gain 4 block.\nIf you already have block: +6 extra block.', price: 55 },
    { name: 'Slancio Agile',  nameEn: 'Agile Surge',  type: 'attack', cost: 0, value: 3, slancioThreshold: 2, slancioBonus: 5, description: 'Infliggi 3 danni.\nSe hai Slancio \u22652: +5 danni. Costa 0.', descriptionEn: 'Deal 3 damage.\nIf you have Momentum \u22652: +5 damage. Costs 0.', price: 60 },
  ],

  // ========================
  // NON COMUNI (13 carte — +3 con status)
  // ========================
  uncommon: [
    { name: 'Colpo Potente',    nameEn: 'Mighty Strike',    type: 'attack', cost: 2, value: 16, description: 'Infliggi 16 danni.', descriptionEn: 'Deal 16 damage.', price: 80 },
    { name: 'Muro di Scudi',    nameEn: 'Wall of Shields',  type: 'defend', cost: 2, value: 14, description: 'Ottieni 14 blocco.', descriptionEn: 'Gain 14 block.', price: 80 },
    { name: 'Furia',            nameEn: 'Fury',             type: 'skill',  cost: 1, value: 5,  extraStrength: 5, description: '+5 forza questo turno.', descriptionEn: '+5 strength this turn.', price: 85 },
    { name: 'Raffica',          nameEn: 'Barrage',          type: 'attack', cost: 1, value: 3,  description: 'Infliggi 3 danni tre volte.', descriptionEn: 'Deal 3 damage three times.', hits: 3, price: 85 },
    { name: 'Recupero',         nameEn: 'Recovery',         type: 'skill',  cost: 1, value: 0,  description: 'Recupera 8 HP.', descriptionEn: 'Heal 8 HP.', heal: 8, price: 90 },
    { name: 'Preparazione',     nameEn: 'Preparation',      type: 'skill',  cost: 1, value: 0,  description: 'Pesca 3 carte.\n+1 energia.', descriptionEn: 'Draw 3 cards.\n+1 energy.', drawCards: 3, giveEnergy: 1, price: 75 },
    { name: 'Impeto',           nameEn: 'Impetus',          type: 'attack', cost: 2, value: 10, description: 'Infliggi 10 danni.\nPesca 2 carte.', descriptionEn: 'Deal 10 damage.\nDraw 2 cards.', drawCards: 2, price: 90 },
    { name: 'Barriera Magica',  nameEn: 'Magic Barrier',    type: 'defend', cost: 2, value: 12, description: 'Ottieni 12 blocco.\nPesca 1 carta.', descriptionEn: 'Gain 12 block.\nDraw 1 card.', drawCards: 1, price: 85 },
    { name: 'Vampirismo',       nameEn: 'Vampirism',        type: 'attack', cost: 2, value: 13, description: 'Infliggi 13 danni.\nRecupera 4 HP.', descriptionEn: 'Deal 13 damage.\nHeal 4 HP.', healOnAttack: 4, price: 95 },
    { name: 'Addestramento',    nameEn: 'Training',         type: 'skill',  cost: 1, value: 2,  extraStrengthPermanent: 2, description: '+2 forza per il combattimento.\n+1 energia.', descriptionEn: '+2 strength for the battle.\n+1 energy.', giveEnergy: 1, price: 85 },
    // Carte con status (M3)
    { name: 'Freccia Avvelenata', nameEn: 'Poison Arrow',    type: 'attack', cost: 1, value: 4, applyPoison: 3, description: 'Infliggi 4 danni.\nVeleno 3 al nemico.', descriptionEn: 'Deal 4 damage.\nApply 3 Poison to the enemy.', price: 80 },
    { name: 'Torcia',             nameEn: 'Torch',           type: 'attack', cost: 1, value: 6, applyBurn: 5,   description: 'Infliggi 6 danni.\nBruciatura 5 al nemico.', descriptionEn: 'Deal 6 damage.\nApply 5 Burn to the enemy.', price: 80 },
    { name: 'Morso di Serpe',     nameEn: 'Serpent Bite',   type: 'attack', cost: 2, value: 8, applyPoison: 5, description: 'Infliggi 8 danni.\nVeleno 5 al nemico.', descriptionEn: 'Deal 8 damage.\nApply 5 Poison to the enemy.', price: 95 },
    { name: 'Lama Consacrata', nameEn: 'Consecrated Blade', type: 'attack', cost: 1, value: 9, retain: true, description: 'Infliggi 9 danni.\nNon viene scartata a fine turno.', descriptionEn: 'Deal 9 damage.\nNot discarded at end of turn.', price: 90 },
    { name: 'Memoria di Battaglia', nameEn: 'Battle Memory', type: 'skill', cost: 0, value: 0, retain: true, drawCards: 1, description: 'Pesca 1 carta.\nNon viene scartata a fine turno.', descriptionEn: 'Draw 1 card.\nNot discarded at end of turn.', price: 80 },
    { name: 'Frenesia', nameEn: 'Frenzy', type: 'attack', cost: 1, value: 6, description: 'Infliggi 6 danni.\nSe hai Slancio ≥3: infliggi 6 danni extra.', descriptionEn: 'Deal 6 damage.\nIf you have Momentum ≥3: deal 6 extra damage.', slancioThreshold: 3, slancioBonus: 6, price: 90 },
    { name: 'Frustata Avvelenata', nameEn: 'Poison Lash',   type: 'attack', cost: 1, value: 7,  hits: 2, applyPoison: 2, description: 'Infliggi 7 danni due volte.\nVeleno 2 al nemico.', descriptionEn: 'Deal 7 damage twice.\nApply 2 Poison to the enemy.', price: 90 },
    { name: 'Piro Lancio',         nameEn: 'Pyro Throw',    type: 'attack', cost: 1, value: 8,  applyBurn: 6, description: 'Infliggi 8 danni.\nBruciatura 6 al nemico.', descriptionEn: 'Deal 8 damage.\nApply 6 Burn to the enemy.', price: 85 },
    { name: 'Contrattacco Totale', nameEn: 'Total Counter', type: 'defend', cost: 2, value: 10, damageOnDefend: 8, description: 'Ottieni 10 blocco.\nInfliggi 8 danni.', descriptionEn: 'Gain 10 block.\nDeal 8 damage.', price: 95 },
    { name: 'Meditazione',         nameEn: 'Meditation',    type: 'skill',  cost: 1, value: 0,  heal: 5, drawCards: 2, description: 'Recupera 5 HP.\nPesca 2 carte.', descriptionEn: 'Heal 5 HP.\nDraw 2 cards.', price: 85 },
    { name: 'Assalto Frenetico',   nameEn: 'Frenzied Assault', type: 'attack', cost: 2, value: 5,  hits: 4, description: 'Infliggi 5 danni quattro volte.', descriptionEn: 'Deal 5 damage four times.', price: 95 },
    // Carte combo (M5)
    { name: 'Lama Multipla',     nameEn: 'Multi-Blade',     type: 'attack', cost: 2, value: 6, hits: 3, comboBonus: { minCards: 4, extraHits: 1 }, description: 'Infliggi 6 danni 3 volte.\nSe hai \u22654 carte in mano: 1 colpo extra.', descriptionEn: 'Deal 6 damage 3 times.\nIf you have \u22654 cards in hand: 1 extra hit.', price: 90 },
    { name: 'Muro Vivente',      nameEn: 'Living Wall',     type: 'defend', cost: 2, value: 10, comboBonus: { requiresArmor: true, extraBlock: 8 }, description: 'Ottieni 10 blocco.\nSe hai Corazza attiva: +8 blocco extra.', descriptionEn: 'Gain 10 block.\nIf you have Armor active: +8 extra block.', price: 85 },
    { name: 'Concatenazione',    nameEn: 'Chain',            type: 'skill',  cost: 1, value: 0, drawCards: 2, comboBonus: { minCards: 2, giveEnergy: 1 }, description: 'Pesca 2 carte.\nSe avevi \u22652 carte in mano: +1 energia.', descriptionEn: 'Draw 2 cards.\nIf you had \u22652 cards in hand: +1 energy.', price: 85 },
  ],

  // ========================
  // RARE (9 carte — +1 con status)
  // ========================
  rare: [
    { name: 'Devastazione',       nameEn: 'Devastation',      type: 'attack', cost: 3, value: 28, description: 'Infliggi 28 danni.', descriptionEn: 'Deal 28 damage.', price: 130 },
    { name: 'Fortezza',           nameEn: 'Fortress',         type: 'defend', cost: 3, value: 24, description: 'Ottieni 24 blocco.', descriptionEn: 'Gain 24 block.', price: 130 },
    { name: 'Berserk',            nameEn: 'Berserk',          type: 'skill',  cost: 0, value: 1,  description: '+1 energia.\n+3 forza questo turno.', descriptionEn: '+1 energy.\n+3 strength this turn.', giveEnergy: 1, extraStrength: 3, price: 140 },
    { name: 'Lama del Fato',      nameEn: 'Blade of Fate',    type: 'attack', cost: 2, value: 6,  description: 'Infliggi 6 danni quattro volte.', descriptionEn: 'Deal 6 damage four times.', hits: 4, price: 150 },
    { name: 'Scudo Divino',       nameEn: 'Divine Shield',    type: 'defend', cost: 2, value: 12, description: 'Ottieni 12 blocco.\nPesca 2 carte.', descriptionEn: 'Gain 12 block.\nDraw 2 cards.', drawCards: 2, price: 135 },
    { name: 'Tempesta di Lame',   nameEn: 'Blade Storm',      type: 'attack', cost: 3, value: 5,  description: 'Infliggi 5 danni cinque volte.', descriptionEn: 'Deal 5 damage five times.', hits: 5, price: 155 },
    { name: 'Scudo Eterno',       nameEn: 'Eternal Shield',   type: 'defend', cost: 1, value: 18, description: 'Ottieni 18 blocco.', descriptionEn: 'Gain 18 block.', price: 145 },
    { name: 'Rinascita',          nameEn: 'Rebirth',          type: 'skill',  cost: 2, value: 0,  description: 'Recupera 15 HP.\nPesca 1 carta.', descriptionEn: 'Heal 15 HP.\nDraw 1 card.', heal: 15, drawCards: 1, price: 160 },
    // Carta stun (M3)
    { name: 'Polvere Paralizzante', nameEn: 'Paralyzing Dust', type: 'skill', cost: 2, value: 0, applyStun: 1, description: 'Stordisce il nemico per 1 turno.', descriptionEn: 'Stun the enemy for 1 turn.', price: 140 },
    { name: 'Eco del Guerriero', nameEn: 'Warrior\'s Echo',  type: 'attack', cost: 2, value: 14, retain: true, description: 'Infliggi 14 danni.\nNon viene scartata a fine turno.', descriptionEn: 'Deal 14 damage.\nNot discarded at end of turn.', price: 145 },
    { name: 'Tempesta Velenosa', nameEn: 'Venom Storm',       type: 'attack', cost: 2, value: 8,  hits: 3, applyPoison: 4, description: 'Infliggi 8 danni tre volte.\nVeleno 4 al nemico.', descriptionEn: 'Deal 8 damage three times.\nApply 4 Poison to the enemy.', price: 160 },
    { name: 'Bastione',          nameEn: 'Bastion',           type: 'defend', cost: 2, value: 16, chargeBonus: 3, description: 'Ottieni 16 blocco.\n+3 Carica invece di +1.', descriptionEn: 'Gain 16 block.\n+3 Charge instead of +1.', price: 150 },
    { name: 'Colpo del Destino', nameEn: 'Destiny Strike',    type: 'attack', cost: 1, value: 8,  retain: true, slancioThreshold: 2, slancioBonus: 10, description: 'Infliggi 8 danni.\nNon viene scartata.\nSe Slancio ≥2: +10 danni.', descriptionEn: 'Deal 8 damage.\nNot discarded.\nIf Momentum ≥2: +10 damage.', price: 155 },
    { name: 'Catarsi',           nameEn: 'Catharsis',         type: 'skill',  cost: 2, value: 0,  heal: 20, drawCards: 2, giveEnergy: 1, description: 'Recupera 20 HP.\nPesca 2 carte.\n+1 energia.', descriptionEn: 'Heal 20 HP.\nDraw 2 cards.\n+1 energy.', price: 165 },
    { name: 'Colpo Letale',      nameEn: 'Lethal Strike',     type: 'attack', cost: 2, value: 24, description: 'Infliggi 24 danni.', descriptionEn: 'Deal 24 damage.', price: 130 },
    { name: 'Frenesia Totale',   nameEn: 'Total Frenzy',      type: 'skill',  cost: 1, value: 8,  extraStrength: 8, description: '+8 forza questo turno.', descriptionEn: '+8 strength this turn.', price: 140 },
    { name: 'Esplodi',           nameEn: 'Explode',           type: 'attack', cost: 3, value: 12, hits: 3, description: 'Infliggi 12 danni tre volte.', descriptionEn: 'Deal 12 damage three times.', price: 150 }, // bilanciamento: ridotto da 15 a 12
    { name: 'Rigenerazione',     nameEn: 'Regeneration',      type: 'skill',  cost: 2, value: 0,  heal: 15, drawCards: 3, description: 'Recupera 15 HP.\nPesca 3 carte.', descriptionEn: 'Heal 15 HP.\nDraw 3 cards.', price: 145 }, // bilanciamento: ridotto da 20 a 15
    { name: 'Lama del Destino',  nameEn: 'Blade of Destiny',  type: 'attack', cost: 1, value: 8,  applyPoison: 5, applyBurn: 5, description: 'Infliggi 8 danni.\nVeleno 5 e Bruciatura 5.', descriptionEn: 'Deal 8 damage.\nApply 5 Poison and 5 Burn.', price: 150 },
    // Carte combo (M5)
    { name: 'Gran Finale',       nameEn: 'Grand Finale',      type: 'attack', cost: 3, value: 12, hits: 2, comboBonus: { minCards: 5, extraDamage: 10 }, description: 'Infliggi 12 danni due volte.\nSe hai \u22655 carte in mano: +10 danni extra.', descriptionEn: 'Deal 12 damage twice.\nIf you have \u22655 cards in hand: +10 extra damage.', price: 150 }, // bilanciamento: extraDamage ridotto da 15 a 10
    { name: 'Fortezza Assoluta', nameEn: 'Absolute Fortress', type: 'defend', cost: 2, value: 12, comboBonus: { requiresBlock: true, extraBlock: 12 }, description: 'Ottieni 12 blocco.\nSe hai gi\u00E0 blocco: +12 blocco extra.', descriptionEn: 'Gain 12 block.\nIf you already have block: +12 extra block.', price: 145 },
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
