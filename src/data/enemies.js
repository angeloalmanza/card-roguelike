/**
 * Database dei nemici, organizzato per difficoltà.
 * I boss supportano fasi multiple (M4).
 */

export const ENEMIES = {
  // --- NORMALI ---
  slime: {
    name: 'Slime', nameEn: 'Slime', hp: 48, emoji: '🟢', spriteKey: 'enemy-slime', tier: 'normal',
    pattern: [
      { type: 'attack', value: 9,  label: 'Attacco',  labelEn: 'Attack' },
      { type: 'attack', value: 9,  label: 'Attacco',  labelEn: 'Attack' },
      { type: 'defend', value: 7,  label: 'Difesa',   labelEn: 'Defense' },
    ]
  },

  skeleton: {
    name: 'Scheletro', nameEn: 'Skeleton', hp: 44, emoji: '💀', spriteKey: 'enemy-skeleton', tier: 'normal',
    pattern: [
      { type: 'attack', value: 12, label: 'Colpo Forte',  labelEn: 'Heavy Strike' },
      { type: 'attack', value: 6,  label: 'Colpo Debole', labelEn: 'Weak Strike' },
      { type: 'attack', value: 12, label: 'Colpo Forte',  labelEn: 'Heavy Strike' },
      { type: 'defend', value: 9,  label: 'Protezione',   labelEn: 'Protection' },
    ]
  },

  goblin: {
    name: 'Goblin', nameEn: 'Goblin', hp: 36, emoji: '👺', spriteKey: 'enemy-goblin', tier: 'normal',
    pattern: [
      { type: 'attack', value: 7,  label: 'Pugnalata',    labelEn: 'Stab' },
      { type: 'defend', value: 6,  label: 'Schivata',     labelEn: 'Dodge' },
      { type: 'attack', value: 15, label: 'Colpo Critico',labelEn: 'Critical Hit' },
    ]
  },

  bat: {
    name: 'Pipistrello', nameEn: 'Bat', hp: 38, emoji: '🦇', spriteKey: 'enemy-bat', tier: 'normal',
    pattern: [
      { type: 'attack', value: 8,  label: 'Morso',           labelEn: 'Bite' },
      { type: 'attack', value: 8,  label: 'Morso',           labelEn: 'Bite' },
      { type: 'heal', value: 8,    label: 'Morso Vampirico',  labelEn: 'Vampiric Bite' },
    ]
  },

  spider: {
    name: 'Ragno Gigante', nameEn: 'Giant Spider', hp: 34, emoji: '🕷️', spriteKey: 'enemy-spider', tier: 'normal',
    pattern: [
      { type: 'defend', value: 5,  label: 'Ragnatela',      labelEn: 'Webbing' },
      { type: 'attack', value: 8, applyPoison: 2, label: 'Morso Velenoso', labelEn: 'Venomous Bite' },
      { type: 'attack', value: 8, applyPoison: 2, label: 'Morso Velenoso', labelEn: 'Venomous Bite' },
      { type: 'attack', value: 16, label: 'Balzo Letale',   labelEn: 'Deadly Leap' },
    ]
  },

  mushroom: {
    name: 'Fungo Marcio', nameEn: 'Rot Mushroom', hp: 45, emoji: '🍄', spriteKey: 'enemy-mushroom', tier: 'normal', // bilanciamento: ridotto da 52 a 45
    pattern: [
      { type: 'defend', value: 8,  label: 'Spore',             labelEn: 'Spores' },
      { type: 'defend', value: 8,  label: 'Spore',             labelEn: 'Spores' },
      { type: 'attack', value: 14, applyPoison: 3, label: 'Esplosione Tossica', labelEn: 'Toxic Burst' },
    ]
  },

  // --- ELITE ---
  golem: {
    name: 'Golem', nameEn: 'Golem', hp: 75, emoji: '🗿', spriteKey: 'enemy-golem', tier: 'elite',
    pattern: [
      { type: 'defend', value: 14, label: 'Corazza',           labelEn: 'Armor' },
      { type: 'attack', value: 18, label: 'Pugno Devastante',  labelEn: 'Devastating Punch' },
      { type: 'attack', value: 11, label: 'Colpo',             labelEn: 'Strike' },
      { type: 'defend', value: 14, label: 'Corazza',           labelEn: 'Armor' },
      { type: 'attack', value: 22, label: 'Schianto',          labelEn: 'Slam' },
    ]
  },

  darkKnight: {
    name: 'Cavaliere Oscuro', nameEn: 'Dark Knight', hp: 62, emoji: '⚫', spriteKey: 'enemy-darkKnight', tier: 'elite',
    pattern: [
      { type: 'attack', value: 13, label: 'Fendente',  labelEn: 'Slash' },
      { type: 'attack', value: 13, label: 'Fendente',  labelEn: 'Slash' },
      { type: 'defend', value: 12, label: 'Parata',    labelEn: 'Parry' },
      { type: 'attack', value: 20, label: 'Esecuzione',labelEn: 'Execute' },
    ]
  },

  lich: {
    name: 'Lich', nameEn: 'Lich', hp: 58, emoji: '🧙', spriteKey: 'enemy-lich', tier: 'elite',
    pattern: [
      { type: 'attack', value: 10, label: 'Dardo Oscuro',   labelEn: 'Dark Bolt' },
      { type: 'defend', value: 16, label: 'Scudo Arcano',   labelEn: 'Arcane Shield' },
      { type: 'attack', value: 15, label: 'Raggio Necrotico', labelEn: 'Necrotic Ray' },
      { type: 'status', applyPoison: 3, label: 'Maledizione', labelEn: 'Curse' },
    ]
  },

  witch: {
    name: 'Strega', nameEn: 'Witch', hp: 40, emoji: '🧙‍♀️', spriteKey: 'enemy-witch', tier: 'normal',
    pattern: [
      { type: 'status', applyPoison: 2, label: 'Maledizione Tossica', labelEn: 'Toxic Curse' },
      { type: 'attack', value: 8, label: 'Dardo Oscuro',  labelEn: 'Dark Bolt' },
      { type: 'defend', value: 6, label: 'Scudo Magico',  labelEn: 'Magic Shield' },
      { type: 'attack', value: 11, applyBurn: 4, label: 'Palla di Fuoco', labelEn: 'Fireball' },
    ]
  },

  zombie: {
    name: 'Zombie', nameEn: 'Zombie', hp: 45, emoji: '🧟', spriteKey: 'enemy-zombie', tier: 'normal', // bilanciamento: ridotto da 60 a 45
    pattern: [
      { type: 'attack', value: 10, label: 'Artiglio',       labelEn: 'Claw' },
      { type: 'heal', value: 6,    label: 'Rigenerazione',   labelEn: 'Regeneration' },
      { type: 'attack', value: 10, label: 'Artiglio',       labelEn: 'Claw' },
      { type: 'attack', value: 14, label: 'Morso Infetto',  labelEn: 'Infected Bite' },
    ]
  },

  troll: {
    name: 'Troll', nameEn: 'Troll', hp: 45, emoji: '👾', spriteKey: 'enemy-troll', tier: 'normal', // bilanciamento: ridotto da 70 a 45
    pattern: [
      { type: 'attack', value: 13, label: 'Mazzata',       labelEn: 'Club Smash' },
      { type: 'defend', value: 10, label: 'Pelle Dura',    labelEn: 'Tough Skin' },
      { type: 'heal', value: 10,   label: 'Rigenerazione', labelEn: 'Regeneration' },
      { type: 'attack', value: 18, label: 'Schianto',      labelEn: 'Slam' },
    ]
  },

  wraith: {
    name: 'Spettro', nameEn: 'Wraith', hp: 32, emoji: '👻', spriteKey: 'enemy-wraith', tier: 'normal',
    pattern: [
      { type: 'status', applyBurn: 5,   label: 'Tocco Ardente',  labelEn: 'Burning Touch' },
      { type: 'attack', value: 9,        label: 'Lamento',        labelEn: 'Wail' },
      { type: 'attack', value: 9,        label: 'Lamento',        labelEn: 'Wail' },
      { type: 'status', applyPoison: 2,  label: 'Aura Corrotta',  labelEn: 'Corrupted Aura' },
    ]
  },

  necromancer: {
    name: 'Negromante', nameEn: 'Necromancer', hp: 68, emoji: '🪄', spriteKey: 'enemy-necromancer', tier: 'elite',
    pattern: [
      { type: 'status', applyPoison: 4, label: 'Tocco della Morte',  labelEn: 'Touch of Death' },
      { type: 'attack', value: 12,      label: 'Raggio Oscuro',       labelEn: 'Dark Ray' },
      { type: 'heal', value: 12,        label: 'Drenaggio Vitale',    labelEn: 'Life Drain' },
      { type: 'attack', value: 16, applyPoison: 2, label: 'Maledizione Letale', labelEn: 'Deadly Curse' },
    ]
  },

  berserker: {
    name: 'Berserker', nameEn: 'Berserker', hp: 80, emoji: '🪖', spriteKey: 'enemy-berserker', tier: 'elite',
    pattern: [
      { type: 'attack', value: 14,                label: 'Ascia',           labelEn: 'Axe' },
      { type: 'attack', value: 14,                label: 'Ascia',           labelEn: 'Axe' },
      { type: 'attack', value: 20, applyBurn: 6,  label: 'Colpo Infuocato', labelEn: 'Blazing Strike' },
      { type: 'defend', value: 8,                 label: 'Rabbia',          labelEn: 'Rage' },
      { type: 'attack', value: 25,                label: 'Furia',           labelEn: 'Fury' },
    ]
  },

  lichKing: {
    name: 'Re Lich', nameEn: 'Lich King', hp: 150, emoji: '💀', spriteKey: 'enemy-lichKing', tier: 'boss',
    phases: [
      {
        hpThreshold: 150,
        name: 'Fase 1 — Dominio Oscuro', nameEn: 'Phase 1 — Dark Dominion',
        pattern: [
          { type: 'attack', value: 12, label: 'Lama d\'Ossa',    labelEn: 'Bone Blade' },
          { type: 'status', applyPoison: 3, label: 'Maledizione', labelEn: 'Curse' },
          { type: 'defend', value: 18, label: 'Scudo Arcano',    labelEn: 'Arcane Shield' },
          { type: 'attack', value: 16, label: 'Dardo Necrotico', labelEn: 'Necrotic Bolt' },
        ]
      },
      {
        hpThreshold: 75,
        name: 'Fase 2 — Furia Non Morta', nameEn: 'Phase 2 — Undead Fury',
        pattern: [
          { type: 'attack', value: 18, applyPoison: 2, label: 'Tocco Mortale', labelEn: 'Deadly Touch' },
          { type: 'heal', value: 15,   label: 'Drenaggio',    labelEn: 'Drain' },
          { type: 'status', applyBurn: 7, label: 'Fuoco Oscuro', labelEn: 'Dark Fire' },
          { type: 'attack', value: 22, label: 'Nova Oscura',   labelEn: 'Dark Nova' },
        ]
      },
      {
        hpThreshold: 30,
        name: 'Fase 3 — Apocalisse Scheletrica', nameEn: 'Phase 3 — Skeletal Apocalypse',
        pattern: [
          { type: 'attack', value: 25, applyPoison: 4,            label: 'Pestilenza',      labelEn: 'Pestilence' },
          { type: 'attack', value: 20,                             label: 'Tempesta d\'Ossa',labelEn: 'Bone Storm' },
          { type: 'status', applyPoison: 5, applyBurn: 5,          label: 'Corruzione Totale', labelEn: 'Total Corruption' },
          { type: 'attack', value: 30,                             label: 'Falce della Morte', labelEn: 'Death Scythe' },
        ]
      },
    ]
  },

  // --- BOSS (multifase, M4) ---
  dragon: {
    name: 'Drago Antico', nameEn: 'Ancient Dragon', hp: 160, emoji: '🐉', spriteKey: 'enemy-dragon', tier: 'boss',
    phases: [
      {
        hpThreshold: 160,
        name: 'Fase 1 — Dormiente', nameEn: 'Phase 1 — Dormant',
        pattern: [
          { type: 'attack', value: 14, label: 'Artiglio',        labelEn: 'Claw' },
          { type: 'defend', value: 16, label: 'Scaglie',         labelEn: 'Scales' },
          { type: 'attack', value: 20, label: 'Soffio di Fuoco', labelEn: 'Fire Breath' },
        ]
      },
      {
        hpThreshold: 80,
        name: 'Fase 2 — Risveglio', nameEn: 'Phase 2 — Awakening',
        pattern: [
          { type: 'attack', value: 20, label: 'Soffio Infuocato', labelEn: 'Blazing Breath' },
          { type: 'attack', value: 15, label: 'Colpo di Coda',    labelEn: 'Tail Whip' },
          { type: 'defend', value: 10, label: 'Scaglie',          labelEn: 'Scales' },
          { type: 'attack', value: 25, label: 'Inferno',          labelEn: 'Inferno' },
        ]
      },
      {
        hpThreshold: 35,
        name: 'Fase 3 — Furia Antica', nameEn: 'Phase 3 — Ancient Fury',
        pattern: [
          { type: 'attack', value: 28, label: 'Apocalisse di Fuoco', labelEn: 'Fire Apocalypse' },
          { type: 'attack', value: 18, label: 'Artiglio Doppio',     labelEn: 'Double Claw' },
          { type: 'attack', value: 22, label: 'Soffio Glaciale',     labelEn: 'Glacial Breath' },
        ]
      },
    ]
  },

  demonLord: {
    name: 'Signore dei Demoni', nameEn: 'Demon Lord', hp: 140, emoji: '👹', spriteKey: 'enemy-demonLord', tier: 'boss',
    phases: [
      {
        hpThreshold: 140,
        name: 'Fase 1 — Arroganza', nameEn: 'Phase 1 — Arrogance',
        pattern: [
          { type: 'attack', value: 12, label: 'Fiammata',      labelEn: 'Flame Burst' },
          { type: 'attack', value: 12, label: 'Fiammata',      labelEn: 'Flame Burst' },
          { type: 'defend', value: 20, label: 'Aura Demoniaca',labelEn: 'Demonic Aura' },
        ]
      },
      {
        hpThreshold: 70,
        name: 'Fase 2 — Ira Infernale', nameEn: 'Phase 2 — Infernal Wrath',
        pattern: [
          { type: 'attack', value: 18, label: 'Lama Infernale',       labelEn: 'Infernal Blade' },
          { type: 'attack', value: 8,  label: 'Frustata',             labelEn: 'Lash' },
          { type: 'defend', value: 14, label: 'Scudo Oscuro',         labelEn: 'Dark Shield' },
          { type: 'attack', value: 25, label: 'Esplosione Demoniaca', labelEn: 'Demonic Explosion' },
        ]
      },
      {
        hpThreshold: 30,
        name: 'Fase 3 — Apocalisse', nameEn: 'Phase 3 — Apocalypse',
        pattern: [
          { type: 'attack', value: 30, label: 'Apocalisse',       labelEn: 'Apocalypse' },
          { type: 'attack', value: 20, label: 'Raffica Infernale',labelEn: 'Infernal Barrage' },
          { type: 'attack', value: 15, label: 'Artiglio Oscuro',  labelEn: 'Dark Claw' },
        ]
      },
    ]
  },

  // --- NUOVI BOSS ---
  stonGolem: {
    name: 'Golem di Pietra', nameEn: 'Stone Golem', hp: 160, emoji: '🗿', spriteKey: 'enemy-stonGolem', tier: 'boss',
    phases: [
      {
        hpThreshold: 160,
        name: 'Fase 1 — Roccia Incrollabile', nameEn: 'Phase 1 — Unshakeable Rock',
        pattern: [
          { type: 'attack', value: 18, label: 'Pugno di Pietra',  labelEn: 'Stone Fist' },
          { type: 'defend', value: 18, label: 'Corazza di Roccia',labelEn: 'Rock Armor' }, // bilanciamento: ridotto da 25 a 18
        ]
      },
      {
        hpThreshold: 80,
        name: 'Fase 2 — Terra Tremante', nameEn: 'Phase 2 — Trembling Earth',
        pattern: [
          { type: 'attack', value: 22, label: 'Schianto Sismico', labelEn: 'Seismic Slam' },
          { type: 'defend', value: 18, label: 'Corazza di Roccia',labelEn: 'Rock Armor' }, // bilanciamento: ridotto da 25 a 18
          { type: 'attack', value: 18, label: 'Pugno di Pietra',  labelEn: 'Stone Fist' },
          { type: 'defend', value: 18, label: 'Corazza di Roccia',labelEn: 'Rock Armor' }, // bilanciamento: ridotto da 25 a 18
        ]
      },
      {
        hpThreshold: 35,
        name: 'Fase 3 — Valanga', nameEn: 'Phase 3 — Avalanche',
        pattern: [
          { type: 'attack', value: 28, label: 'Valanga',          labelEn: 'Avalanche' },
          { type: 'defend', value: 18, label: 'Corazza di Roccia',labelEn: 'Rock Armor' }, // bilanciamento: ridotto da 25 a 18
          { type: 'attack', value: 22, label: 'Schianto Sismico', labelEn: 'Seismic Slam' },
        ]
      },
    ]
  },

  ancientVampire: {
    name: 'Vampiro Antico', nameEn: 'Ancient Vampire', hp: 130, emoji: '🧛', spriteKey: 'enemy-ancientVampire', tier: 'boss',
    phases: [
      {
        hpThreshold: 130,
        name: 'Fase 1 — Seduzione Oscura', nameEn: 'Phase 1 — Dark Seduction',
        pattern: [
          { type: 'attack', value: 14, label: 'Morso Vampirico',  labelEn: 'Vampiric Bite' },
          { type: 'heal',   value: 6,  label: 'Drenaggio Vitale', labelEn: 'Life Drain' },
          { type: 'attack', value: 14, label: 'Morso Vampirico',  labelEn: 'Vampiric Bite' },
          { type: 'heal',   value: 6,  label: 'Drenaggio Vitale', labelEn: 'Life Drain' },
        ]
      },
      {
        hpThreshold: 65,
        name: 'Fase 2 — Fame di Sangue', nameEn: 'Phase 2 — Blood Hunger',
        pattern: [
          { type: 'attack', value: 18, label: 'Zanna Letale',      labelEn: 'Lethal Fang' },
          { type: 'heal',   value: 10, label: 'Drenaggio Totale',  labelEn: 'Total Drain' },
          { type: 'attack', value: 14, label: 'Morso Vampirico',   labelEn: 'Vampiric Bite' },
          { type: 'attack', value: 14, label: 'Morso Vampirico',   labelEn: 'Vampiric Bite' },
          { type: 'heal',   value: 10, label: 'Drenaggio Totale',  labelEn: 'Total Drain' },
        ]
      },
      {
        hpThreshold: 25,
        name: 'Fase 3 — Eternità Oscura', nameEn: 'Phase 3 — Dark Eternity',
        pattern: [
          { type: 'attack', value: 22, label: 'Abbraccio della Morte', labelEn: 'Death Embrace' },
          { type: 'heal',   value: 15, label: 'Rinascita Vampirica',   labelEn: 'Vampiric Rebirth' },
          { type: 'attack', value: 18, label: 'Zanna Letale',          labelEn: 'Lethal Fang' },
          { type: 'heal',   value: 15, label: 'Rinascita Vampirica',   labelEn: 'Vampiric Rebirth' },
        ]
      },
    ]
  },

  poisonWitch: {
    name: 'Strega del Veleno', nameEn: 'Poison Witch', hp: 120, emoji: '🧙', spriteKey: 'enemy-poisonWitch', tier: 'boss',
    phases: [
      {
        hpThreshold: 120,
        name: 'Fase 1 — Calderone Tossico', nameEn: 'Phase 1 — Toxic Cauldron',
        pattern: [
          { type: 'status', applyPoison: 4, label: 'Veleno Primordiale', labelEn: 'Primordial Venom' }, // bilanciamento: ridotto da 6 a 4
          { type: 'attack', value: 8,  applyPoison: 4, label: 'Dardo Avvelenato', labelEn: 'Poison Dart' },
          { type: 'attack', value: 8,  applyPoison: 4, label: 'Dardo Avvelenato', labelEn: 'Poison Dart' },
          { type: 'status', applyPoison: 4, label: 'Nube Tossica',       labelEn: 'Toxic Cloud' },
        ]
      },
      {
        hpThreshold: 60,
        name: 'Fase 2 — Piaga Virulenta', nameEn: 'Phase 2 — Virulent Plague',
        pattern: [
          { type: 'status', applyPoison: 6,              label: 'Maledizione Velenosa', labelEn: 'Venomous Curse' },
          { type: 'attack', value: 12, applyPoison: 4,   label: 'Freccia Avvelenata',   labelEn: 'Poison Arrow' },
          { type: 'defend', value: 10,                   label: 'Barriera di Spore',    labelEn: 'Spore Barrier' },
          { type: 'attack', value: 10, applyPoison: 4,   label: 'Dardo Avvelenato',     labelEn: 'Poison Dart' },
        ]
      },
      {
        hpThreshold: 25,
        name: 'Fase 3 — Pestilenza Mortale', nameEn: 'Phase 3 — Deadly Pestilence',
        pattern: [
          { type: 'status', applyPoison: 8,            label: 'Pestilenza',        labelEn: 'Pestilence' },
          { type: 'attack', value: 15, applyPoison: 5, label: 'Esplosione Tossica',labelEn: 'Toxic Explosion' },
          { type: 'attack', value: 15, applyPoison: 5, label: 'Esplosione Tossica',labelEn: 'Toxic Explosion' },
        ]
      },
    ]
  },
};

export function getEnemiesByTier(tier) {
  return Object.values(ENEMIES).filter(e => e.tier === tier);
}

export function getRandomEnemy(tier) {
  let enemies = getEnemiesByTier(tier);
  if (!enemies || enemies.length === 0) {
    enemies = getEnemiesByTier('normal');
  }
  if (!enemies || enemies.length === 0) {
    // Fallback assoluto: restituisce lo slime hardcoded
    return ENEMIES.slime;
  }
  return enemies[Math.floor(Math.random() * enemies.length)];
}
