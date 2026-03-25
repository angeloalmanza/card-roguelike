/**
 * Card — Modello dati di una carta.
 * Supporta tutti gli effetti speciali.
 */
export class Card {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.nameEn = data.nameEn || '';
    this.type = data.type;
    this.cost = data.cost;
    this.value = data.value;
    this.description = data.description;
    this.descriptionEn = data.descriptionEn || '';
    this.isCurse = data.isCurse || false;
    // Effetti speciali
    this.hits = data.hits || 0;
    this.drawCards = data.drawCards || 0;
    this.heal = data.heal || 0;
    this.giveEnergy = data.giveEnergy || 0;
    this.extraStrength = data.extraStrength || 0;
    this.selfDamage = data.selfDamage || 0;
    this.blockFromSkill = data.blockFromSkill || 0;
    this.blockOnAttack = data.blockOnAttack || 0;
    this.damageOnDefend = data.damageOnDefend || 0;
    this.healOnAttack = data.healOnAttack || 0;
    // Status effects (M3)
    this.applyPoison = data.applyPoison || 0;
    this.applyBurn = data.applyBurn || 0;
    this.applyStun = data.applyStun || 0;
    // Curse effects (M2B)
    this.curseDiscard = data.curseDiscard || 0;
    this.curseBlock = data.curseBlock || 0;
    this.retain = data.retain || false;
  }

  canPlay(currentEnergy) {
    return currentEnergy >= this.cost;
  }
}
