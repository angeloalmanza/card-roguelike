/**
 * PerkManager — gestisce il sistema di abilità passive permanenti.
 * Usa localStorage con chiave `cardRoguelike_perks`.
 */

const STORAGE_KEY = 'cardRoguelike_perks';

export const PERK_DEFINITIONS = [
  // Livello 1 — nessun prerequisito
  {
    id: 'extra_hp',
    level: 1,
    name: 'Corpo Temprato',
    nameEn: 'Hardened Body',
    description: '+10 HP massimi\nall\'inizio di ogni run.',
    descriptionEn: '+10 max HP\nat the start of each run.',
    cost: 1,
    requires: [],
    emoji: '❤️',
  },
  {
    id: 'extra_gold',
    level: 1,
    name: 'Borsa Pesante',
    nameEn: 'Heavy Purse',
    description: 'Inizia ogni run\ncon 30 oro extra.',
    descriptionEn: 'Start each run\nwith 30 extra gold.',
    cost: 1,
    requires: [],
    emoji: '💰',
  },
  {
    id: 'extra_card',
    level: 1,
    name: 'Mente Svelta',
    nameEn: 'Quick Mind',
    description: 'Inizia ogni run con\n1 carta reward casuale.',
    descriptionEn: 'Start each run with\n1 random reward card.',
    cost: 1,
    requires: [],
    emoji: '🃏',
  },
  // Livello 2 — richiede almeno 1 perk L1
  {
    id: 'hp_recovery',
    level: 2,
    name: 'Resilienza',
    nameEn: 'Resilience',
    description: 'I nodi riposo guariscono\n35% HP invece di 25%.',
    descriptionEn: 'Rest nodes heal\n35% HP instead of 25%.',
    cost: 2,
    requires: ['extra_hp', 'extra_gold', 'extra_card'],
    emoji: '🩹',
  },
  {
    id: 'start_relic',
    level: 2,
    name: 'Eredità',
    nameEn: 'Legacy',
    description: 'Inizia ogni run con\nuna reliquia comune extra.',
    descriptionEn: 'Start each run with\nan extra common relic.',
    cost: 2,
    requires: ['extra_hp', 'extra_gold', 'extra_card'],
    emoji: '🏺',
  },
  // Livello 3 — richiede almeno 1 perk L2
  {
    id: 'energy_plus',
    level: 3,
    name: 'Flusso Energetico',
    nameEn: 'Energy Flow',
    description: '+1 energia massima\nper sempre.',
    descriptionEn: '+1 max energy\npermanently.',
    cost: 3,
    requires: ['hp_recovery', 'start_relic'],
    emoji: '⚡',
  },
];

export class PerkManager {
  static getPerks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"points": 0, "unlocked": []}');
    } catch (e) {
      return { points: 0, unlocked: [] };
    }
  }

  static savePerks(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  static hasUnlocked(id) {
    return PerkManager.getPerks().unlocked.includes(id);
  }

  static getPoints() {
    return PerkManager.getPerks().points || 0;
  }

  static addPoints(n) {
    const data = PerkManager.getPerks();
    data.points = (data.points || 0) + n;
    PerkManager.savePerks(data);
  }

  /**
   * Verifica se un perk è disponibile per lo sblocco.
   * Un perk L2/L3 richiede che almeno 1 dei prerequisiti sia sbloccato.
   */
  static isAvailable(id) {
    if (PerkManager.hasUnlocked(id)) return false;
    const def = PERK_DEFINITIONS.find(p => p.id === id);
    if (!def) return false;
    if (def.requires.length === 0) return true;
    return def.requires.some(reqId => PerkManager.hasUnlocked(reqId));
  }

  static unlock(id) {
    const data = PerkManager.getPerks();
    const def = PERK_DEFINITIONS.find(p => p.id === id);
    if (!def) return false;
    if (data.unlocked.includes(id)) return false;
    if ((data.points || 0) < def.cost) return false;
    if (!PerkManager.isAvailable(id)) return false;

    data.points -= def.cost;
    data.unlocked.push(id);
    PerkManager.savePerks(data);
    return true;
  }

  /**
   * Applica i bonus perk al runData prima di iniziare la run.
   * rewardCards e generateRelic vengono passati dal chiamante
   * per evitare dipendenze circolari al bootstrap.
   */
  static applyToRunData(runData, { rewardCards, generateRelic } = {}) {
    if (PerkManager.hasUnlocked('extra_hp')) {
      runData.maxHp = (runData.maxHp || 80) + 10;
      runData.playerHp = runData.maxHp;
    }

    if (PerkManager.hasUnlocked('extra_gold')) {
      runData.gold = (runData.gold || 0) + 30;
    }

    if (PerkManager.hasUnlocked('extra_card') && rewardCards) {
      if (!runData.deckCards) runData.deckCards = [];
      const pool = rewardCards.common || [];
      if (pool.length > 0) {
        const card = pool[Math.floor(Math.random() * pool.length)];
        runData.deckCards.push({ ...card, id: Date.now() + Math.random() });
      }
    }

    if (PerkManager.hasUnlocked('start_relic') && generateRelic) {
      if (!runData.relics) runData.relics = [];
      try {
        const relic = generateRelic('common');
        runData.relics.push(relic);
      } catch (e) {
        // Ignora se generateRelic fallisce
      }
    }

    if (PerkManager.hasUnlocked('energy_plus')) {
      runData.bonusEnergy = (runData.bonusEnergy || 0) + 1;
    }

    // hp_recovery viene applicato in MapScene durante handleRest
    if (PerkManager.hasUnlocked('hp_recovery')) {
      runData.perkHpRecovery = true;
    }

    return runData;
  }
}
