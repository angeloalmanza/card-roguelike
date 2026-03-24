/**
 * AchievementManager — Gestisce gli achievement del gioco.
 *
 * Gli achievement vengono salvati in localStorage con la chiave
 * 'cardRoguelike_achievements' come array di ID sbloccati.
 *
 * Uso:
 *   AchievementManager.check({ type: 'victory', classId, deckSize, gold, floorsVisited })
 *   AchievementManager.check({ type: 'combat_end', damageTaken })
 *   AchievementManager.check({ type: 'deck_size', deckSize })
 */

const ACHIEVEMENTS_KEY = 'cardRoguelike_achievements';

export const ACHIEVEMENT_LIST = [
  {
    id: 'first_win',
    name: 'Prima Vittoria',
    description: 'Vinci la tua prima run.',
    emoji: '🏆',
  },
  {
    id: 'warrior_win',
    name: 'Guerriero Invincibile',
    description: 'Vinci una run con il Guerriero.',
    emoji: '⚔️',
  },
  {
    id: 'rogue_win',
    name: 'Ombra nella Notte',
    description: 'Vinci una run con il Ladro.',
    emoji: '🗡️',
  },
  {
    id: 'alchemist_win',
    name: 'Grande Alchimista',
    description: 'Vinci una run con l\'Alchimista.',
    emoji: '⚗️',
  },
  {
    id: 'no_damage',
    name: 'Intoccabile',
    description: 'Completa un combattimento senza subire danni.',
    emoji: '🛡️',
  },
  {
    id: 'big_deck',
    name: 'Collezionista',
    description: 'Raggiungi 20 carte nel mazzo.',
    emoji: '📚',
  },
  {
    id: 'rich',
    name: 'Mercante',
    description: 'Accumula 150 oro in una run.',
    emoji: '💰',
  },
  {
    id: 'speed_run',
    name: 'Fulmine',
    description: 'Completa una run visitando meno di 12 nodi.',
    emoji: '⚡',
  },
];

export class AchievementManager {
  /**
   * Restituisce la lista degli ID achievement sbloccati.
   */
  static getUnlockedIds() {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      // ignore
    }
    return [];
  }

  /**
   * Restituisce tutti gli achievement con campo `unlocked`.
   */
  static getAchievements() {
    const unlockedIds = this.getUnlockedIds();
    return ACHIEVEMENT_LIST.map(a => ({
      ...a,
      unlocked: unlockedIds.includes(a.id),
    }));
  }

  /**
   * Controlla se un achievement è sbloccato.
   */
  static isUnlocked(id) {
    return this.getUnlockedIds().includes(id);
  }

  /**
   * Sblocca un achievement e lo salva. Non fa nulla se già sbloccato.
   * @returns {Object|null} l'oggetto achievement con justUnlocked:true se appena sbloccato, null se già lo era.
   */
  static unlock(id) {
    const unlocked = this.getUnlockedIds();
    if (unlocked.includes(id)) return null;
    unlocked.push(id);
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
    } catch (e) {
      console.warn('Salvataggio achievement fallito:', e);
    }
    const achievement = ACHIEVEMENT_LIST.find(a => a.id === id);
    if (achievement) {
      console.log(`[Achievement sbloccato] ${achievement.emoji} ${achievement.name}`);
      return { ...achievement, justUnlocked: true };
    }
    return null;
  }

  /**
   * Controlla e sblocca achievement in base all'evento.
   * Restituisce un array degli achievement appena sbloccati (con justUnlocked:true).
   *
   * Tipi di evento supportati:
   *   { type: 'victory', classId, deckSize, gold, floorsVisited }
   *   { type: 'combat_end', damageTaken }
   *   { type: 'deck_size', deckSize }
   */
  static check(event) {
    if (!event || !event.type) return [];

    const justUnlocked = [];

    const tryUnlock = (id) => {
      const result = this.unlock(id);
      if (result) justUnlocked.push(result);
    };

    switch (event.type) {
      case 'victory': {
        tryUnlock('first_win');

        if (event.classId === 'warrior') tryUnlock('warrior_win');
        if (event.classId === 'rogue') tryUnlock('rogue_win');
        if (event.classId === 'alchemist') tryUnlock('alchemist_win');

        if (event.deckSize >= 20) tryUnlock('big_deck');
        if (event.gold >= 150) tryUnlock('rich');
        if (typeof event.floorsVisited === 'number' && event.floorsVisited < 12) {
          tryUnlock('speed_run');
        }
        break;
      }

      case 'combat_end': {
        if (event.damageTaken === 0) tryUnlock('no_damage');
        break;
      }

      case 'deck_size': {
        if (event.deckSize >= 20) tryUnlock('big_deck');
        break;
      }

      default:
        break;
    }

    return justUnlocked;
  }
}
