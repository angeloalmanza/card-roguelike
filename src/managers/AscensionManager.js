/**
 * AscensionManager — Gestisce il livello di ascensione (difficoltà progressiva).
 *
 * Il livello aumenta dopo ogni vittoria (boss sconfitto) fino a un massimo di 10.
 * Ogni livello aggiunge modificatori cumulativi alla run.
 *
 * localStorage key: 'cardRoguelike_ascension'
 * Struttura: { level: 0 }
 */
const ASCENSION_KEY = 'cardRoguelike_ascension';

export class AscensionManager {
  /**
   * Legge il livello di ascensione corrente dal localStorage.
   * @returns {number} livello (0-10)
   */
  static getLevel() {
    try {
      const data = localStorage.getItem(ASCENSION_KEY);
      if (!data) return 0;
      const parsed = JSON.parse(data);
      return typeof parsed.level === 'number' ? Math.min(10, Math.max(0, parsed.level)) : 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Incrementa il livello di ascensione di 1 (max 10).
   * Chiamato dopo una vittoria boss.
   */
  static incrementLevel() {
    const current = this.getLevel();
    const next = Math.min(10, current + 1);
    try {
      localStorage.setItem(ASCENSION_KEY, JSON.stringify({ level: next }));
    } catch (e) {
      console.warn('AscensionManager: salvataggio fallito', e);
    }
    return next;
  }

  /**
   * Restituisce i modificatori cumulativi per il livello dato.
   * I modificatori si accumulano: ogni livello include quelli precedenti.
   * @param {number} level - livello di ascensione (0-10)
   * @returns {{ enemyHpMultiplier: number, enemyDamageBonus: number, startCurses: number, shopPriceMultiplier: number, eliteEarlier: boolean, noCombatHeal: boolean }}
   */
  static getModifiers(level) {
    const mods = {
      enemyHpMultiplier: 1.0,
      enemyDamageBonus: 0,
      startCurses: 0,
      shopPriceMultiplier: 1.0,
      eliteEarlier: false,
      noCombatHeal: false,
    };

    if (level <= 0) return mods;

    // Livello 1: nemici +10% HP
    if (level >= 1) {
      mods.enemyHpMultiplier += 0.1;
    }

    // Livello 2: nemici +2 danno
    if (level >= 2) {
      mods.enemyDamageBonus += 2;
    }

    // Livello 3: si inizia con una carta Maledizione nel mazzo
    if (level >= 3) {
      mods.startCurses += 1;
    }

    // Livello 4: shop prezzi +25%
    if (level >= 4) {
      mods.shopPriceMultiplier = 1.25;
    }

    // Livello 5: nemici elite appaiono prima (dal piano 3 invece che 5)
    if (level >= 5) {
      mods.eliteEarlier = true;
    }

    // Livello 6: il giocatore non recupera HP tra i combattimenti
    if (level >= 6) {
      mods.noCombatHeal = true;
    }

    // Livello 7: nemici +20% HP totale (si somma al +10% del L1 → totale +30%)
    if (level >= 7) {
      mods.enemyHpMultiplier += 0.2;
    }

    // Livello 8: +4 danno nemici totale (si somma al +2 del L2 → totale +6)
    if (level >= 8) {
      mods.enemyDamageBonus += 4;
    }

    // Livello 9: 2 carte Maledizione iniziali (si somma a L3 → totale 2)
    if (level >= 9) {
      mods.startCurses += 1;
    }

    // Livello 10: boss hanno 35% HP extra (gestito via bossHpMultiplier)
    if (level >= 10) {
      // Segnalato come flag separato per i boss
      mods.bossHpMultiplier = 1.35; // bilanciamento: ridotto da 1.5 a 1.35
    }

    return mods;
  }

  /**
   * Resetta il livello di ascensione a 0 (debug).
   */
  static reset() {
    try {
      localStorage.setItem(ASCENSION_KEY, JSON.stringify({ level: 0 }));
    } catch (e) {
      console.warn('AscensionManager: reset fallito', e);
    }
  }
}
