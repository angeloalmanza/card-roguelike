/**
 * Condizioni di Piano — Modificatori casuali per piano.
 * Ogni piano può avere una condizione che altera il combattimento.
 */
export const FLOOR_CONDITIONS = [
  {
    id: 'ventoGelido',
    name: 'Vento Gelido',
    nameEn: 'Icy Wind',
    description: 'I nemici guadagnano 3 blocco a inizio del loro turno.',
    descriptionEn: 'Enemies gain 3 block at the start of their turn.',
    badge: '❄️',
    badgeColor: 0x5b9bd5,
    effect: 'enemyBlockPerTurn',
    value: 3
  },
  {
    id: 'terrenoSacro',
    name: 'Terreno Sacro',
    nameEn: 'Sacred Ground',
    description: 'Curati 2 HP per ogni carta difesa giocata.',
    descriptionEn: 'Heal 2 HP for each defend card played.',
    badge: '✨',
    badgeColor: 0xd4a820,
    effect: 'healOnDefend',
    value: 2
  },
  {
    id: 'caosElementale',
    name: 'Caos Elementale',
    nameEn: 'Elemental Chaos',
    description: 'Tutte le carte costano 1 energia in più.',
    descriptionEn: 'All cards cost 1 more energy.',
    badge: '🌀',
    badgeColor: 0xb07be8,
    effect: 'cardCostIncrease',
    value: 1
  },
  {
    id: 'adrenalina',
    name: 'Adrenalina',
    nameEn: 'Adrenaline',
    description: 'Inizio turno: +1 energia extra.',
    descriptionEn: 'Turn start: +1 extra energy.',
    badge: '⚡',
    badgeColor: 0xe8b84b,
    effect: 'energyPerTurn',
    value: 1
  },
  {
    id: 'piagaOscura',
    name: 'Piaga Oscura',
    nameEn: 'Dark Plague',
    description: 'Inizio combattimento: subisci 8 danni.',
    descriptionEn: 'Combat start: take 8 damage.',
    badge: '☠️',
    badgeColor: 0xe85d5d,
    effect: 'startDamage',
    value: 8
  },
  {
    id: 'rigenerazione',
    name: 'Rigenerazione',
    nameEn: 'Regeneration',
    description: 'Il nemico recupera 3 HP a inizio del suo turno.',
    descriptionEn: 'The enemy heals 3 HP at the start of their turn.',
    badge: '💚',
    badgeColor: 0x5dc77a,
    effect: 'enemyHealPerTurn',
    value: 3
  },
  {
    id: 'terrenoFragile',
    name: 'Terreno Fragile',
    nameEn: 'Fragile Ground',
    description: 'Ogni attacco infligge 2 danni extra.',
    descriptionEn: 'Every attack deals 2 extra damage.',
    badge: '💥',
    badgeColor: 0xe85d5d,
    effect: 'bonusDamagePerAttack',
    value: 2
  },
  {
    id: 'nebbiaMistica',
    name: 'Nebbia Mistica',
    nameEn: 'Mystic Fog',
    description: 'Pesca 1 carta extra a inizio turno.',
    descriptionEn: 'Draw 1 extra card at the start of your turn.',
    badge: '🌫️',
    badgeColor: 0x8c8ccc,
    effect: 'extraDraw',
    value: 1
  }
];
