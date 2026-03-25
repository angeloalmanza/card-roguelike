/**
 * LocaleManager — Gestisce la lingua del gioco (italiano / inglese).
 *
 * Uso nelle scene:
 *   import { LocaleManager } from '../managers/LocaleManager.js';
 *   const lang = LocaleManager.getLang(); // 'it' | 'en'
 *   const t = k => (T[lang] || T.it)[k] ?? T.it[k];
 *
 * Uso per oggetti dati con campi nameEn/descEn:
 *   LocaleManager.name(card)   // restituisce card.nameEn se lang=en, altrimenti card.name
 *   LocaleManager.desc(card)   // idem per desc/description
 */
const KEY = 'cardRoguelike_lang';

export class LocaleManager {
  static getLang() {
    return localStorage.getItem(KEY) || 'it';
  }

  static setLang(lang) {
    localStorage.setItem(KEY, lang);
  }

  static isEn() {
    return this.getLang() === 'en';
  }

  /** Restituisce il nome localizzato di un oggetto dati. */
  static name(obj) {
    if (!obj) return '';
    return (this.isEn() && obj.nameEn) ? obj.nameEn : (obj.name || '');
  }

  /** Restituisce la descrizione localizzata di un oggetto dati. */
  static desc(obj) {
    if (!obj) return '';
    const base = obj.desc || obj.description || '';
    return (this.isEn() && (obj.descEn || obj.descriptionEn))
      ? (obj.descEn || obj.descriptionEn)
      : base;
  }
}
