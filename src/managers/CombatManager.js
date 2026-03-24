/**
 * CombatManager — Gestisce tutta la logica del combattimento.
 * Supporta status effects (veleno, bruciatura, stordimento) e maledizioni.
 */
export class CombatManager {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
    this.turnNumber = 1;
    this.cardsPlayedThisTurn = 0;
    this.slancioCount = 0;    // consecutive attacks (resets on skill/defend)
    this.caricaPoints = 0;    // charge accumulated from defend cards
  }

  /**
   * Applica veleno e bruciatura a fine turno, decrementa contatori.
   * Ritorna il totale danno da status.
   */
  tickStatusEffects(entity) {
    const se = entity.statusEffects;
    let totalDamage = 0;

    if (se.poison > 0) {
      entity.hp = Math.max(0, entity.hp - se.poison);
      totalDamage += se.poison;
      se.poison = Math.max(0, se.poison - 1);
    }

    if (se.burn > 0) {
      entity.hp = Math.max(0, entity.hp - se.burn);
      totalDamage += se.burn;
      se.burn = 0; // bruciatura non fa stack, si azzera dopo
    }

    // Debolezza: decrementa a fine turno nemico
    if (se.weakness > 0) {
      se.weakness = Math.max(0, se.weakness - 1);
    }

    return totalDamage;
  }

  playCard(card) {
    if (!this.player.spendEnergy(card.cost)) {
      return { success: false, reason: 'not_enough_energy' };
    }

    this.cardsPlayedThisTurn++;
    const result = { success: true, type: card.type, card, drawCards: card.drawCards || 0 };

    switch (card.type) {
      case 'attack': {
        const hits = card.hits || 1;
        const slancioBonusPerHit = this.slancioCount * 2;
        const damagePerHit = card.value + this.player.strength + slancioBonusPerHit;
        result.slancioBonusDamage = slancioBonusPerHit;
        result.slancioCountBefore = this.slancioCount;
        this.slancioCount++;
        result.slancioCount = this.slancioCount;
        result.strengthTemporary = false; // attacks don't reset strength display
        let totalDamage = 0;
        let totalBlocked = 0;
        let totalHpLost = 0;

        for (let i = 0; i < hits; i++) {
          if (!this.enemy.isAlive()) break;
          const dmgResult = this.enemy.takeDamage(damagePerHit);
          totalDamage += damagePerHit;
          totalBlocked += dmgResult.blocked;
          totalHpLost += dmgResult.hpLost;
          if (dmgResult.phaseTransition) {
            result.phaseTransition = dmgResult.phaseTransition;
          }
        }

        result.damage = totalDamage;
        result.hits = hits;
        result.damagePerHit = damagePerHit;
        result.blocked = totalBlocked;
        result.hpLost = totalHpLost;
        result.enemyDead = !this.enemy.isAlive();

        // Carta speciale: bonus se slancio >= soglia
        if (card.slancioThreshold && result.slancioCountBefore >= card.slancioThreshold && card.slancioBonus && this.enemy.isAlive()) {
          const bonusDmg = this.enemy.takeDamage(card.slancioBonus);
          result.slancioBonusFromCard = card.slancioBonus;
        }

        if (card.blockOnAttack) {
          this.player.addBlock(card.blockOnAttack);
          result.blockGained = card.blockOnAttack;
        }

        if (card.healOnAttack) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + card.healOnAttack);
          result.healed = card.healOnAttack;
        }

        if (card.selfDamage) {
          this.player.hp = Math.max(1, this.player.hp - card.selfDamage);
          result.selfDamage = card.selfDamage;
        }

        // Status effects (M3)
        if (card.applyPoison && this.enemy.isAlive()) {
          this.enemy.statusEffects.poison = Math.max(this.enemy.statusEffects.poison, card.applyPoison);
          result.appliedPoison = card.applyPoison;
        }
        if (card.applyBurn && this.enemy.isAlive()) {
          this.enemy.statusEffects.burn = card.applyBurn;
          result.appliedBurn = card.applyBurn;
        }
        if (card.applyStun && this.enemy.isAlive()) {
          this.enemy.statusEffects.stun = card.applyStun;
          result.appliedStun = card.applyStun;
        }
        if (card.applyWeakness && this.enemy.isAlive()) {
          this.enemy.statusEffects.weakness = (this.enemy.statusEffects.weakness || 0) + card.applyWeakness;
          result.appliedWeakness = card.applyWeakness;
        }
        if (card.applyArmor) {
          this.player.armor = card.applyArmor.value;
          this.player.armorTurns = card.applyArmor.turns;
          result.appliedArmor = card.applyArmor;
        }
        break;
      }

      case 'defend': {
        this.player.addBlock(card.value);
        result.block = card.value;

        // Carica: accumula punti carica (chargeBonus overrides default +1)
        const chargeGain = card.chargeBonus || 1;
        this.caricaPoints += chargeGain;
        result.caricaPoints = this.caricaPoints;
        result.caricaGained = chargeGain;

        // Slancio reset on defend
        this.slancioCount = 0;
        result.slancioReset = true;
        result.slancioCount = 0;

        if (card.damageOnDefend && this.enemy.isAlive()) {
          const dmg = card.damageOnDefend + this.player.strength;
          const dmgResult = this.enemy.takeDamage(dmg);
          result.counterDamage = dmg;
          result.enemyDead = !this.enemy.isAlive();
          if (dmgResult.phaseTransition) {
            result.phaseTransition = dmgResult.phaseTransition;
          }
        }
        break;
      }

      case 'skill': {
        // Slancio reset on skill
        this.slancioCount = 0;
        result.slancioReset = true;
        result.slancioCount = 0;

        const strengthGain = card.extraStrength || 0;
        const permanentStrengthGain = card.extraStrengthPermanent || 0;
        if (strengthGain > 0) {
          this.player.strength += strengthGain;
          result.strengthGained = strengthGain;
          result.strengthTemporary = true;
        }
        if (permanentStrengthGain > 0) {
          this.player.combatStrength += permanentStrengthGain;
          this.player.strength += permanentStrengthGain;
          result.strengthGained = (result.strengthGained || 0) + permanentStrengthGain;
          result.strengthTemporary = false;
        }

        if (card.blockFromSkill) {
          this.player.addBlock(card.blockFromSkill);
          result.block = card.blockFromSkill;
        }

        if (card.heal) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + card.heal);
          result.healed = card.heal;
        }

        if (card.giveEnergy) {
          this.player.energy += card.giveEnergy;
          result.energyGained = card.giveEnergy;
        }

        // Status effects da skill (es: Polvere Paralizzante)
        if (card.applyStun && this.enemy.isAlive()) {
          this.enemy.statusEffects.stun = card.applyStun;
          result.appliedStun = card.applyStun;
        }
        if (card.applyPoison && this.enemy.isAlive()) {
          this.enemy.statusEffects.poison = Math.max(this.enemy.statusEffects.poison, card.applyPoison);
          result.appliedPoison = card.applyPoison;
        }
        if (card.applyWeakness && this.enemy.isAlive()) {
          this.enemy.statusEffects.weakness = (this.enemy.statusEffects.weakness || 0) + card.applyWeakness;
          result.appliedWeakness = card.applyWeakness;
        }
        if (card.applyArmor) {
          this.player.armor = card.applyArmor.value;
          this.player.armorTurns = card.applyArmor.turns;
          result.appliedArmor = card.applyArmor;
        }
        break;
      }

      case 'curse': {
        // Le maledizioni si autoinfliggono effetti negativi
        if (card.selfDamage) {
          this.player.hp = Math.max(0, this.player.hp - card.selfDamage);
          result.selfDamage = card.selfDamage;
        }
        if (card.curseDiscard) {
          result.curseDiscard = card.curseDiscard;
        }
        if (card.curseBlock && this.enemy.isAlive()) {
          this.enemy.block += card.curseBlock;
          result.curseBlock = card.curseBlock;
        }
        break;
      }
    }

    return result;
  }

  endPlayerTurn() {
    if (!this.enemy.isAlive()) {
      return { type: 'enemy_dead' };
    }

    // Tick status effects nemico
    const statusDamage = this.tickStatusEffects(this.enemy);

    if (!this.enemy.isAlive()) {
      return { type: 'enemy_dead', statusDamage };
    }

    // Controlla stordimento
    if (this.enemy.statusEffects.stun > 0) {
      this.enemy.statusEffects.stun--;
      this.enemy.nextIntent(); // avanza il pattern senza agire
      return { type: 'stunned', statusDamage };
    }

    const intent = this.enemy.act();
    const result = { ...intent, statusDamage };

    switch (intent.type) {
      case 'attack': {
        // Debolezza: riduce i danni del nemico del 30%
        let attackValue = intent.value;
        if (this.enemy.statusEffects.weakness > 0) {
          attackValue = Math.floor(attackValue * 0.7);
          result.weaknessReduced = true;
        }
        const damageResult = this.player.takeDamage(attackValue);
        result.blocked = damageResult.blocked;
        result.hpLost = damageResult.hpLost;
        result.playerDead = !this.player.isAlive();
        if (intent.applyPoison) {
          this.player.statusEffects.poison = Math.max(this.player.statusEffects.poison, intent.applyPoison);
          result.appliedPoisonToPlayer = intent.applyPoison;
        }
        if (intent.applyBurn) {
          this.player.statusEffects.burn = intent.applyBurn;
          result.appliedBurnToPlayer = intent.applyBurn;
        }
        break;
      }
      case 'defend': {
        this.enemy.block += intent.value;
        break;
      }
      case 'heal': {
        this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + intent.value);
        result.enemyHealed = intent.value;
        break;
      }
      case 'status': {
        if (intent.applyPoison) {
          this.player.statusEffects.poison = Math.max(this.player.statusEffects.poison, intent.applyPoison);
          result.appliedPoisonToPlayer = intent.applyPoison;
        }
        if (intent.applyBurn) {
          this.player.statusEffects.burn = intent.applyBurn;
          result.appliedBurnToPlayer = intent.applyBurn;
        }
        break;
      }
    }

    return result;
  }

  startPlayerTurn() {
    this.turnNumber++;
    this.cardsPlayedThisTurn = 0;
    this.player.startTurn();
    // Tick status effects giocatore
    return this.tickStatusEffects(this.player);
  }

  consumeCarica() {
    const points = this.caricaPoints;
    this.caricaPoints = 0;
    return points;
  }

  isCombatOver() {
    if (!this.enemy.isAlive()) return 'victory';
    if (!this.player.isAlive()) return 'defeat';
    return null;
  }
}
