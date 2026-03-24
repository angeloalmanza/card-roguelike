/**
 * Database dei nemici, organizzato per difficoltà.
 * I boss supportano fasi multiple (M4).
 */

export const ENEMIES = {
  // --- NORMALI ---
  slime: {
    name: 'Slime', hp: 48, emoji: '🟢', spriteKey: 'enemy-slime', tier: 'normal',
    pattern: [
      { type: 'attack', value: 9,  label: 'Attacco' },
      { type: 'attack', value: 9,  label: 'Attacco' },
      { type: 'defend', value: 7,  label: 'Difesa' },
    ]
  },

  skeleton: {
    name: 'Scheletro', hp: 44, emoji: '💀', spriteKey: 'enemy-skeleton', tier: 'normal',
    pattern: [
      { type: 'attack', value: 12, label: 'Colpo Forte' },
      { type: 'attack', value: 6,  label: 'Colpo Debole' },
      { type: 'attack', value: 12, label: 'Colpo Forte' },
      { type: 'defend', value: 9,  label: 'Protezione' },
    ]
  },

  goblin: {
    name: 'Goblin', hp: 36, emoji: '👺', spriteKey: 'enemy-goblin', tier: 'normal',
    pattern: [
      { type: 'attack', value: 7,  label: 'Pugnalata' },
      { type: 'defend', value: 6,  label: 'Schivata' },
      { type: 'attack', value: 15, label: 'Colpo Critico' },
    ]
  },

  bat: {
    name: 'Pipistrello', hp: 38, emoji: '🦇', spriteKey: 'enemy-bat', tier: 'normal',
    pattern: [
      { type: 'attack', value: 8,  label: 'Morso' },
      { type: 'attack', value: 8,  label: 'Morso' },
      { type: 'heal', value: 8, label: 'Morso Vampirico' },
    ]
  },

  spider: {
    name: 'Ragno Gigante', hp: 34, emoji: '🕷️', spriteKey: 'enemy-spider', tier: 'normal',
    pattern: [
      { type: 'defend', value: 5,  label: 'Ragnatela' },
      { type: 'attack', value: 8, applyPoison: 2, label: 'Morso Velenoso' },
      { type: 'attack', value: 8, applyPoison: 2, label: 'Morso Velenoso' },
      { type: 'attack', value: 16, label: 'Balzo Letale' },
    ]
  },

  mushroom: {
    name: 'Fungo Marcio', hp: 45, emoji: '🍄', spriteKey: 'enemy-mushroom', tier: 'normal', // bilanciamento: ridotto da 52 a 45
    pattern: [
      { type: 'defend', value: 8,  label: 'Spore' },
      { type: 'defend', value: 8,  label: 'Spore' },
      { type: 'attack', value: 14, applyPoison: 3, label: 'Esplosione Tossica' },
    ]
  },

  // --- ELITE ---
  golem: {
    name: 'Golem', hp: 75, emoji: '🗿', spriteKey: 'enemy-golem', tier: 'elite',
    pattern: [
      { type: 'defend', value: 14, label: 'Corazza' },
      { type: 'attack', value: 18, label: 'Pugno Devastante' },
      { type: 'attack', value: 11, label: 'Colpo' },
      { type: 'defend', value: 14, label: 'Corazza' },
      { type: 'attack', value: 22, label: 'Schianto' },
    ]
  },

  darkKnight: {
    name: 'Cavaliere Oscuro', hp: 62, emoji: '⚫', spriteKey: 'enemy-darkKnight', tier: 'elite',
    pattern: [
      { type: 'attack', value: 13, label: 'Fendente' },
      { type: 'attack', value: 13, label: 'Fendente' },
      { type: 'defend', value: 12, label: 'Parata' },
      { type: 'attack', value: 20, label: 'Esecuzione' },
    ]
  },

  lich: {
    name: 'Lich', hp: 58, emoji: '🧙', spriteKey: 'enemy-lich', tier: 'elite',
    pattern: [
      { type: 'attack', value: 10, label: 'Dardo Oscuro' },
      { type: 'defend', value: 16, label: 'Scudo Arcano' },
      { type: 'attack', value: 15, label: 'Raggio Necrotico' },
      { type: 'status', applyPoison: 3, label: 'Maledizione' },
    ]
  },

  witch: {
    name: 'Strega', hp: 40, emoji: '🧙‍♀️', spriteKey: 'enemy-witch', tier: 'normal',
    pattern: [
      { type: 'status', applyPoison: 2, label: 'Maledizione Tossica' },
      { type: 'attack', value: 8, label: 'Dardo Oscuro' },
      { type: 'defend', value: 6, label: 'Scudo Magico' },
      { type: 'attack', value: 11, applyBurn: 4, label: 'Palla di Fuoco' },
    ]
  },

  zombie: {
    name: 'Zombie', hp: 45, emoji: '🧟', spriteKey: 'enemy-zombie', tier: 'normal', // bilanciamento: ridotto da 60 a 45
    pattern: [
      { type: 'attack', value: 10, label: 'Artiglio' },
      { type: 'heal', value: 6, label: 'Rigenerazione' },
      { type: 'attack', value: 10, label: 'Artiglio' },
      { type: 'attack', value: 14, label: 'Morso Infetto' },
    ]
  },

  troll: {
    name: 'Troll', hp: 45, emoji: '👾', spriteKey: 'enemy-troll', tier: 'normal', // bilanciamento: ridotto da 70 a 45
    pattern: [
      { type: 'attack', value: 13, label: 'Mazzata' },
      { type: 'defend', value: 10, label: 'Pelle Dura' },
      { type: 'heal', value: 10, label: 'Rigenerazione' },
      { type: 'attack', value: 18, label: 'Schianto' },
    ]
  },

  wraith: {
    name: 'Spettro', hp: 32, emoji: '👻', spriteKey: 'enemy-wraith', tier: 'normal',
    pattern: [
      { type: 'status', applyBurn: 5, label: 'Tocco Ardente' },
      { type: 'attack', value: 9, label: 'Lamento' },
      { type: 'attack', value: 9, label: 'Lamento' },
      { type: 'status', applyPoison: 2, label: 'Aura Corrotta' },
    ]
  },

  necromancer: {
    name: 'Negromante', hp: 68, emoji: '🪄', spriteKey: 'enemy-necromancer', tier: 'elite',
    pattern: [
      { type: 'status', applyPoison: 4, label: 'Tocco della Morte' },
      { type: 'attack', value: 12, label: 'Raggio Oscuro' },
      { type: 'heal', value: 12, label: 'Drenaggio Vitale' },
      { type: 'attack', value: 16, applyPoison: 2, label: 'Maledizione Letale' },
    ]
  },

  berserker: {
    name: 'Berserker', hp: 80, emoji: '🪖', spriteKey: 'enemy-berserker', tier: 'elite',
    pattern: [
      { type: 'attack', value: 14, label: 'Ascia' },
      { type: 'attack', value: 14, label: 'Ascia' },
      { type: 'attack', value: 20, applyBurn: 6, label: 'Colpo Infuocato' },
      { type: 'defend', value: 8, label: 'Rabbia' },
      { type: 'attack', value: 25, label: 'Furia' },
    ]
  },

  lichKing: {
    name: 'Re Lich', hp: 150, emoji: '💀', spriteKey: 'enemy-lichKing', tier: 'boss',
    phases: [
      {
        hpThreshold: 150,
        name: 'Fase 1 — Dominio Oscuro',
        pattern: [
          { type: 'attack', value: 12, label: 'Lama d\'Ossa' },
          { type: 'status', applyPoison: 3, label: 'Maledizione' },
          { type: 'defend', value: 18, label: 'Scudo Arcano' },
          { type: 'attack', value: 16, label: 'Dardo Necrotico' },
        ]
      },
      {
        hpThreshold: 75,
        name: 'Fase 2 — Furia Non Morta',
        pattern: [
          { type: 'attack', value: 18, applyPoison: 2, label: 'Tocco Mortale' },
          { type: 'heal', value: 15, label: 'Drenaggio' },
          { type: 'status', applyBurn: 7, label: 'Fuoco Oscuro' },
          { type: 'attack', value: 22, label: 'Nova Oscura' },
        ]
      },
      {
        hpThreshold: 30,
        name: 'Fase 3 — Apocalisse Scheletrica',
        pattern: [
          { type: 'attack', value: 25, applyPoison: 4, label: 'Pestilenza' },
          { type: 'attack', value: 20, label: 'Tempesta d\'Ossa' },
          { type: 'status', applyPoison: 5, applyBurn: 5, label: 'Corruzione Totale' },
          { type: 'attack', value: 30, label: 'Falce della Morte' },
        ]
      },
    ]
  },

  // --- BOSS (multifase, M4) ---
  dragon: {
    name: 'Drago Antico', hp: 160, emoji: '🐉', spriteKey: 'enemy-dragon', tier: 'boss',
    phases: [
      {
        hpThreshold: 160,
        name: 'Fase 1 — Dormiente',
        pattern: [
          { type: 'attack', value: 14, label: 'Artiglio' },
          { type: 'defend', value: 16, label: 'Scaglie' },
          { type: 'attack', value: 20, label: 'Soffio di Fuoco' },
        ]
      },
      {
        hpThreshold: 80,
        name: 'Fase 2 — Risveglio',
        pattern: [
          { type: 'attack', value: 20, label: 'Soffio Infuocato' },
          { type: 'attack', value: 15, label: 'Colpo di Coda' },
          { type: 'defend', value: 10, label: 'Scaglie' },
          { type: 'attack', value: 25, label: 'Inferno' },
        ]
      },
      {
        hpThreshold: 35,
        name: 'Fase 3 — Furia Antica',
        pattern: [
          { type: 'attack', value: 28, label: 'Apocalisse di Fuoco' },
          { type: 'attack', value: 18, label: 'Artiglio Doppio' },
          { type: 'attack', value: 22, label: 'Soffio Glaciale' },
        ]
      },
    ]
  },

  demonLord: {
    name: 'Signore dei Demoni', hp: 140, emoji: '👹', spriteKey: 'enemy-demonLord', tier: 'boss',
    phases: [
      {
        hpThreshold: 140,
        name: 'Fase 1 — Arroganza',
        pattern: [
          { type: 'attack', value: 12, label: 'Fiammata' },
          { type: 'attack', value: 12, label: 'Fiammata' },
          { type: 'defend', value: 20, label: 'Aura Demoniaca' },
        ]
      },
      {
        hpThreshold: 70,
        name: 'Fase 2 — Ira Infernale',
        pattern: [
          { type: 'attack', value: 18, label: 'Lama Infernale' },
          { type: 'attack', value: 8,  label: 'Frustata' },
          { type: 'defend', value: 14, label: 'Scudo Oscuro' },
          { type: 'attack', value: 25, label: 'Esplosione Demoniaca' },
        ]
      },
      {
        hpThreshold: 30,
        name: 'Fase 3 — Apocalisse',
        pattern: [
          { type: 'attack', value: 30, label: 'Apocalisse' },
          { type: 'attack', value: 20, label: 'Raffica Infernale' },
          { type: 'attack', value: 15, label: 'Artiglio Oscuro' },
        ]
      },
    ]
  },

  // --- NUOVI BOSS ---
  stonGolem: {
    name: 'Golem di Pietra', hp: 160, emoji: '🗿', spriteKey: 'enemy-stonGolem', tier: 'boss',
    phases: [
      {
        hpThreshold: 160,
        name: 'Fase 1 — Roccia Incrollabile',
        pattern: [
          { type: 'attack', value: 18, label: 'Pugno di Pietra' },
          { type: 'defend', value: 18, label: 'Corazza di Roccia' }, // bilanciamento: ridotto da 25 a 18
        ]
      },
      {
        hpThreshold: 80,
        name: 'Fase 2 — Terra Tremante',
        pattern: [
          { type: 'attack', value: 22, label: 'Schianto Sismico' },
          { type: 'defend', value: 18, label: 'Corazza di Roccia' }, // bilanciamento: ridotto da 25 a 18
          { type: 'attack', value: 18, label: 'Pugno di Pietra' },
          { type: 'defend', value: 18, label: 'Corazza di Roccia' }, // bilanciamento: ridotto da 25 a 18
        ]
      },
      {
        hpThreshold: 35,
        name: 'Fase 3 — Valanga',
        pattern: [
          { type: 'attack', value: 28, label: 'Valanga' },
          { type: 'defend', value: 18, label: 'Corazza di Roccia' }, // bilanciamento: ridotto da 25 a 18
          { type: 'attack', value: 22, label: 'Schianto Sismico' },
        ]
      },
    ]
  },

  ancientVampire: {
    name: 'Vampiro Antico', hp: 130, emoji: '🧛', spriteKey: 'enemy-ancientVampire', tier: 'boss',
    phases: [
      {
        hpThreshold: 130,
        name: 'Fase 1 — Seduzione Oscura',
        pattern: [
          { type: 'attack', value: 14, label: 'Morso Vampirico' },
          { type: 'heal',   value: 6,  label: 'Drenaggio Vitale' },
          { type: 'attack', value: 14, label: 'Morso Vampirico' },
          { type: 'heal',   value: 6,  label: 'Drenaggio Vitale' },
        ]
      },
      {
        hpThreshold: 65,
        name: 'Fase 2 — Fame di Sangue',
        pattern: [
          { type: 'attack', value: 18, label: 'Zanna Letale' },
          { type: 'heal',   value: 10, label: 'Drenaggio Totale' },
          { type: 'attack', value: 14, label: 'Morso Vampirico' },
          { type: 'attack', value: 14, label: 'Morso Vampirico' },
          { type: 'heal',   value: 10, label: 'Drenaggio Totale' },
        ]
      },
      {
        hpThreshold: 25,
        name: 'Fase 3 — Eternità Oscura',
        pattern: [
          { type: 'attack', value: 22, label: 'Abbraccio della Morte' },
          { type: 'heal',   value: 15, label: 'Rinascita Vampirica' },
          { type: 'attack', value: 18, label: 'Zanna Letale' },
          { type: 'heal',   value: 15, label: 'Rinascita Vampirica' },
        ]
      },
    ]
  },

  poisonWitch: {
    name: 'Strega del Veleno', hp: 120, emoji: '🧙', spriteKey: 'enemy-poisonWitch', tier: 'boss',
    phases: [
      {
        hpThreshold: 120,
        name: 'Fase 1 — Calderone Tossico',
        pattern: [
          { type: 'status', applyPoison: 4, label: 'Veleno Primordiale' }, // bilanciamento: ridotto da 6 a 4
          { type: 'attack', value: 8,  applyPoison: 4, label: 'Dardo Avvelenato' },
          { type: 'attack', value: 8,  applyPoison: 4, label: 'Dardo Avvelenato' },
          { type: 'status', applyPoison: 4, label: 'Nube Tossica' },
        ]
      },
      {
        hpThreshold: 60,
        name: 'Fase 2 — Piaga Virulenta',
        pattern: [
          { type: 'status', applyPoison: 6, label: 'Maledizione Velenosa' },
          { type: 'attack', value: 12, applyPoison: 4, label: 'Freccia Avvelenata' },
          { type: 'defend', value: 10, label: 'Barriera di Spore' },
          { type: 'attack', value: 10, applyPoison: 4, label: 'Dardo Avvelenato' },
        ]
      },
      {
        hpThreshold: 25,
        name: 'Fase 3 — Pestilenza Mortale',
        pattern: [
          { type: 'status', applyPoison: 8, label: 'Pestilenza' },
          { type: 'attack', value: 15, applyPoison: 5, label: 'Esplosione Tossica' },
          { type: 'attack', value: 15, applyPoison: 5, label: 'Esplosione Tossica' },
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
