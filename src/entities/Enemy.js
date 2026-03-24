/**
 * Enemy — Un nemico.
 * Supporta pattern ciclico e fasi multiple (boss multifase).
 */
export class Enemy {
  constructor(data) {
    if (!data) {
      data = { name: 'Nemico', hp: 40, pattern: [{ type: 'attack', value: 10, label: 'Attacco' }] };
    }
    const { name, hp, pattern, phases } = data;
    this.name = name || 'Nemico';
    this.maxHp = hp || 40;
    this.hp = this.maxHp;
    this.block = 0;
    this.statusEffects = { poison: 0, burn: 0, stun: 0, weakness: 0 };

    // Fase (M4)
    this.phases = phases || null;
    this.currentPhase = 0;

    if (phases && phases.length > 0 && phases[0].pattern) {
      this.pattern = phases[0].pattern;
    } else {
      this.pattern = pattern || [{ type: 'attack', value: 10, label: 'Attacco' }];
    }

    this.patternIndex = 0;
    this.currentIntent = null;
    this.nextIntent();
  }

  nextIntent() {
    this.currentIntent = this.pattern[this.patternIndex];
    this.patternIndex = (this.patternIndex + 1) % this.pattern.length;
  }

  /**
   * Controlla se è il momento di passare alla fase successiva.
   * Restituisce { name } se la fase è cambiata, false altrimenti.
   */
  checkPhaseTransition() {
    if (!this.phases || this.currentPhase >= this.phases.length - 1) return false;
    const nextPhase = this.phases[this.currentPhase + 1];
    if (this.hp <= nextPhase.hpThreshold) {
      this.currentPhase++;
      this.pattern = nextPhase.pattern;
      this.patternIndex = 0;
      this.nextIntent(); // Aggiorna intent alla prima azione della nuova fase
      return { name: nextPhase.name };
    }
    return false;
  }

  takeDamage(amount) {
    const blocked = Math.min(this.block, amount);
    this.block -= blocked;
    amount -= blocked;

    if (amount > 0) {
      this.hp = Math.max(0, this.hp - amount);
    }

    const phaseTransition = this.checkPhaseTransition();
    return { blocked, hpLost: amount, phaseTransition };
  }

  act() {
    const intent = this.currentIntent;
    this.block = 0;
    this.nextIntent();
    return intent;
  }

  isAlive() {
    return this.hp > 0;
  }
}
