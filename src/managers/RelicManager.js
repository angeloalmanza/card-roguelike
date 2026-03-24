/**
 * RelicManager — Gestisce le reliquie e i loro effetti.
 *
 * Ogni reliquia ha un trigger che determina quando si attiva.
 * Il RelicManager viene interrogato dalla CombatScene nei momenti giusti:
 * - Inizio combattimento → trigger 'onCombatStart'
 * - Inizio turno → trigger 'onTurnStart'
 * - Carta giocata → trigger 'onPlayAttack' / 'onPlayDefend'
 * - Danno ricevuto → trigger 'onTakeDamage'
 * - Nemico ucciso → trigger 'onKill'
 */
export class RelicManager {
  constructor(relics = [], relicStacks = {}) {
    this.relics = relics;
    this.attackCount = 0; // Contatore per reliquie tipo "ogni N attacchi"
    this.relicStacks = relicStacks;
    this.activatableUsed = {}; // { relicId: boolean } — true = already used this combat
  }

  hasRelic(relicId) {
    return this.relics.some(r => r.id === relicId);
  }

  /**
   * Applica effetti passivi al giocatore (energia extra, pesca extra, ecc.)
   * Chiamato una volta all'inizio del combattimento per settare i valori.
   */
  getPassiveEffects() {
    const effects = { maxEnergy: 0, drawCards: 0, maxHp: 0 };

    this.relics.forEach(relic => {
      if (relic.trigger === 'passive') {
        if (relic.effect.maxEnergy) effects.maxEnergy += relic.effect.maxEnergy;
        if (relic.effect.drawCards) effects.drawCards += relic.effect.drawCards;
        if (relic.effect.maxHp) effects.maxHp += relic.effect.maxHp;
      }
    });

    return effects;
  }

  /**
   * Trigger un evento e ritorna tutti gli effetti da applicare.
   * @param {string} trigger - Il tipo di evento
   * @param {object} context - Contesto extra (es: danno ricevuto)
   * @returns {Array} - Array di { relic, effect } da applicare
   */
  trigger(triggerType, context = {}) {
    const results = [];

    this.relics.forEach(relic => {
      if (relic.activatable) return;

      // Handle stacking increments
      if (relic.stacking && relic.stackEvent === triggerType) {
        this.incrementStack(relic.id);
      }

      if (relic.trigger !== triggerType) return;

      // Skip pure stacking relics that have no immediate trigger effect
      if (relic.stacking && Object.keys(relic.effect).length === 0) return;

      const effect = { ...relic.effect };

      // Logica speciale per "ogni N attacchi"
      if (triggerType === 'onPlayAttack' && effect.doubleEveryN) {
        this.attackCount++;
        if (this.attackCount % effect.doubleEveryN === 0) {
          effect.doubleDamage = true;
        } else {
          return; // Non è il turno giusto, salta
        }
      }

      results.push({ relic, effect });
    });

    return results;
  }

  activateRelic(relicId) {
    const relic = this.relics.find(r => r.id === relicId);
    if (!relic || !relic.activatable) return null;
    if (this.activatableUsed[relicId]) return null; // already used
    this.activatableUsed[relicId] = true;
    return { ...relic.activateEffect };
  }

  isRelicCharged(relicId) {
    return !this.activatableUsed[relicId];
  }

  incrementStack(relicId, amount = 1) {
    if (!this.relicStacks[relicId]) this.relicStacks[relicId] = 0;
    this.relicStacks[relicId] += amount;
  }

  getStack(relicId) {
    return this.relicStacks[relicId] || 0;
  }

  /**
   * Reset contatori a inizio combattimento.
   */
  resetCombat() {
    this.attackCount = 0;
    this.activatableUsed = {};
    this.relics.filter(r => r.activatable).forEach(r => {
      this.activatableUsed[r.id] = false;
    });
  }
}
