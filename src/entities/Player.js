/**
 * Player — Il giocatore.
 */
export class Player {
  constructor() {
    this.maxHp = 80;
    this.hp = 80;
    this.maxEnergy = 3;
    this.energy = 3;
    this.block = 0;
    this.strength = 0;
    this.combatStrength = 0; // forza permanente per la durata del combattimento
    this.statusEffects = { poison: 0, burn: 0 };
    // Corazza: riduce i danni ricevuti
    this.armor = 0;       // riduzione danno per turno
    this.armorTurns = 0;  // turni rimanenti di corazza
  }

  spendEnergy(amount) {
    if (this.energy < amount) return false;
    this.energy -= amount;
    return true;
  }

  takeDamage(amount) {
    const result = { blocked: 0, hpLost: 0 };

    // Corazza: riduce il danno in ingresso
    if (this.armor > 0 && this.armorTurns > 0) {
      amount = Math.max(0, amount - this.armor);
    }

    if (this.block > 0) {
      const blockedDamage = Math.min(this.block, amount);
      this.block -= blockedDamage;
      amount -= blockedDamage;
      result.blocked = blockedDamage;
    }

    if (amount > 0) {
      this.hp = Math.max(0, this.hp - amount);
      result.hpLost = amount;
    }

    return result;
  }

  addBlock(amount) {
    this.block += amount;
  }

  startTurn() {
    this.energy = this.maxEnergy;
    this.block = 0;
    this.strength = this.combatStrength; // ripristina forza permanente da combattimento
    // statusEffects persist and are ticked by CombatManager
    // Corazza: decrementa i turni rimanenti
    if (this.armorTurns > 0) {
      this.armorTurns--;
      if (this.armorTurns <= 0) {
        this.armor = 0;
        this.armorTurns = 0;
      }
    }
  }

  isAlive() {
    return this.hp > 0;
  }
}
