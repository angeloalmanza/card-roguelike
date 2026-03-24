/**
 * SaveManager — Gestisce il salvataggio e caricamento della run.
 *
 * Usa localStorage per salvare:
 * - La run in corso (HP, oro, mazzo, reliquie, posizione sulla mappa)
 * - Statistiche globali (run completate, nemici sconfitti, ecc.)
 *
 * Il salvataggio avviene automaticamente ogni volta che il giocatore
 * torna alla mappa (dopo combattimenti, eventi, ecc.)
 */
const SAVE_KEY        = 'cardRoguelike_save';
const STATS_KEY       = 'cardRoguelike_stats';
const COLLECTION_KEY  = 'cardRoguelike_collection';
const HISTORY_KEY     = 'cardRoguelike_history';
const LAST_RUN_KEY    = 'cardRoguelike_lastRunStats';
const LEADERBOARD_KEY = 'cardRoguelike_leaderboard';

export class SaveManager {
  /**
   * Salva la run corrente.
   */
  static saveRun(runData) {
    try {
      const saveData = {
        classId: runData.classId || 'warrior',
        playerHp: runData.playerHp,
        maxHp: runData.maxHp,
        gold: runData.gold,
        deckCards: runData.deckCards,
        currentFloor: runData.currentFloor,
        currentCol: runData.currentCol,
        map: runData.map,
        relics: runData.relics,
        flags: runData.flags || {},
        relicStacks: runData.relicStacks || {},
        potions: runData.potions || [],
        permanentStrength: runData.permanentStrength || 0,
        inCombat: runData.inCombat || null,
        timestamp: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.warn('Salvataggio fallito:', e);
    }
  }

  /**
   * Carica la run salvata. Ritorna null se non c'è.
   */
  static loadRun() {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.warn('Caricamento fallito:', e);
      return null;
    }
  }

  /**
   * Cancella la run salvata (dopo vittoria o sconfitta).
   */
  static clearRun() {
    localStorage.removeItem(SAVE_KEY);
  }

  /**
   * Controlla se esiste una run salvata.
   */
  static hasSave() {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  /**
   * Salva statistiche globali.
   */
  static updateStats(update) {
    const stats = this.getStats();

    if (update.victory) stats.victories++;
    if (update.defeat) stats.defeats++;
    if (update.enemiesKilled) stats.enemiesKilled += update.enemiesKilled;
    if (update.goldEarned) stats.goldEarned += update.goldEarned;
    if (update.cardsPlayed) stats.cardsPlayed += update.cardsPlayed;
    if (update.victory || update.defeat) stats.totalRuns++;

    // Traccia il piano più alto raggiunto
    if (update.highestFloor && update.highestFloor > stats.highestFloor) {
      stats.highestFloor = update.highestFloor;
    }

    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Salvataggio statistiche fallito:', e);
    }
  }

  /**
   * Leggi statistiche globali.
   */
  static getStats() {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      // ignore
    }
    return {
      totalRuns: 0,
      victories: 0,
      defeats: 0,
      enemiesKilled: 0,
      goldEarned: 0,
      cardsPlayed: 0,
      highestFloor: 0,
    };
  }

  /**
   * Registra una carta nella collezione (glossario).
   */
  static trackCard(cardName) {
    const collection = this.getCollection();
    if (!collection.cards.includes(cardName)) {
      collection.cards.push(cardName);
      this._saveCollection(collection);
    }
  }

  /**
   * Registra una reliquia nella collezione (glossario).
   */
  static trackRelic(relicId) {
    const collection = this.getCollection();
    if (!collection.relics.includes(relicId)) {
      collection.relics.push(relicId);
      this._saveCollection(collection);
    }
  }

  /**
   * Leggi la collezione.
   */
  static getCollection() {
    try {
      const data = localStorage.getItem(COLLECTION_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      // ignore
    }
    return { cards: [], relics: [] };
  }

  static _saveCollection(collection) {
    try {
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    } catch (e) {
      console.warn('Salvataggio collezione fallito:', e);
    }
  }

  /**
   * Salva una run nello storico (ultime 10).
   * @param {object} runData - Dati della run corrente
   * @param {'victory'|'defeat'} result - Esito della run
   */
  static saveRunToHistory(runData, result) {
    const entry = {
      classId: runData.classId || 'warrior',
      maxHp: runData.maxHp || 0,
      floorsVisited: (runData.currentFloor != null ? runData.currentFloor : -1) + 1,
      result,
      gold: runData.gold || 0,
      deckSize: runData.deckCards ? runData.deckCards.length : 0,
      timestamp: Date.now(),
    };

    const history = this.getRunHistory();
    history.unshift(entry);

    // Mantieni solo le ultime 10 run
    if (history.length > 10) history.length = 10;

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Salvataggio storico run fallito:', e);
    }
  }

  /**
   * Restituisce lo storico delle run (array, più recente per prima).
   */
  static getRunHistory() {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      // ignore
    }
    return [];
  }

  /**
   * Salva le statistiche dell'ultima run (usato da EndRunScene).
   * @param {object} stats - Oggetto statistiche della run
   */
  static saveRunStats(stats) {
    try {
      localStorage.setItem(LAST_RUN_KEY, JSON.stringify({ ...stats, timestamp: Date.now() }));
    } catch (e) {
      console.warn('Salvataggio stats ultima run fallito:', e);
    }
  }

  /**
   * Carica le statistiche dell'ultima run.
   */
  static getLastRunStats() {
    try {
      const data = localStorage.getItem(LAST_RUN_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      // ignore
    }
    return null;
  }

  /**
   * Aggiunge la run alla classifica locale (ultime 10, ordinate per piano DESC poi danno totale DESC).
   * @param {object} runData - Dati della run corrente
   * @param {number} totalDamage - Danno totale inflitto in questa run
   */
  static saveToLeaderboard(runData, totalDamage) {
    const entry = {
      classId:        runData.classId || 'warrior',
      floorsReached:  (runData.currentFloor != null ? runData.currentFloor : -1) + 1,
      result:         runData.result || 'defeat',
      gold:           runData.gold || 0,
      deckSize:       runData.deckCards ? runData.deckCards.length : 0,
      ascensionLevel: runData.ascensionLevel || 0,
      totalDamage:    totalDamage || 0,
      timestamp:      Date.now(),
    };

    const board = this.getLeaderboard();
    board.push(entry);

    // Ordina: piano DESC, poi danno totale DESC
    board.sort((a, b) => {
      if (b.floorsReached !== a.floorsReached) return b.floorsReached - a.floorsReached;
      return b.totalDamage - a.totalDamage;
    });

    // Max 10 entry
    if (board.length > 10) board.length = 10;

    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
    } catch (e) {
      console.warn('Salvataggio classifica fallito:', e);
    }
  }

  /**
   * Restituisce la classifica locale (array ordinato).
   */
  static getLeaderboard() {
    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      // ignore
    }
    return [];
  }

  /**
   * Salva le impostazioni utente.
   */
  static saveSettings(s) {
    try { localStorage.setItem('cardRoguelike_settings', JSON.stringify(s)); } catch (e) {}
  }

  /**
   * Carica le impostazioni utente (con valori di default).
   */
  static getSettings() {
    const def = { musicVolume: 0.28, sfxVolume: 1.0, muted: false, animations: true };
    try {
      const d = localStorage.getItem('cardRoguelike_settings');
      return d ? { ...def, ...JSON.parse(d) } : def;
    } catch { return def; }
  }
}
