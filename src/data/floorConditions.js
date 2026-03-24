/**
 * Condizioni di Piano — Modificatori casuali per piano.
 * Ogni piano può avere una condizione che altera il combattimento.
 */
export const FLOOR_CONDITIONS = [
  {
    id: 'ventoGelido',
    name: 'Vento Gelido',
    description: 'I nemici guadagnano 3 blocco a inizio del loro turno.',
    badge: '❄️',
    badgeColor: 0x5b9bd5,
    effect: 'enemyBlockPerTurn',
    value: 3
  },
  {
    id: 'terrenoSacro',
    name: 'Terreno Sacro',
    description: 'Curati 2 HP per ogni carta difesa giocata.',
    badge: '✨',
    badgeColor: 0xd4a820,
    effect: 'healOnDefend',
    value: 2
  },
  {
    id: 'caosElementale',
    name: 'Caos Elementale',
    description: 'Tutte le carte costano 1 energia in più.',
    badge: '🌀',
    badgeColor: 0xb07be8,
    effect: 'cardCostIncrease',
    value: 1
  },
  {
    id: 'adrenalina',
    name: 'Adrenalina',
    description: 'Inizio turno: +1 energia extra.',
    badge: '⚡',
    badgeColor: 0xe8b84b,
    effect: 'energyPerTurn',
    value: 1
  },
  {
    id: 'piagaOscura',
    name: 'Piaga Oscura',
    description: 'Inizio combattimento: subisci 8 danni.',
    badge: '☠️',
    badgeColor: 0xe85d5d,
    effect: 'startDamage',
    value: 8
  },
  {
    id: 'rigenerazione',
    name: 'Rigenerazione',
    description: 'Il nemico recupera 3 HP a inizio del suo turno.',
    badge: '💚',
    badgeColor: 0x5dc77a,
    effect: 'enemyHealPerTurn',
    value: 3
  },
  {
    id: 'terrenoFragile',
    name: 'Terreno Fragile',
    description: 'Ogni attacco infligge 2 danni extra.',
    badge: '💥',
    badgeColor: 0xe85d5d,
    effect: 'bonusDamagePerAttack',
    value: 2
  },
  {
    id: 'nebbiaMistica',
    name: 'Nebbia Mistica',
    description: 'Pesca 1 carta extra a inizio turno.',
    badge: '🌫️',
    badgeColor: 0x8c8ccc,
    effect: 'extraDraw',
    value: 1
  }
];
