import { Card } from '../entities/Card.js';

/**
 * DeckManager — Gestisce mazzo, mano, e pila degli scarti.
 *
 * Come funziona un mazzo in un deckbuilder:
 *
 * [Mazzo] → peschi → [Mano] → giochi → [Scarti]
 *                                           ↓
 *                     quando il mazzo è vuoto, gli scarti
 *                     vengono rimescolati nel mazzo
 *
 * Questo ciclo è fondamentale: significa che TUTTE le tue carte
 * tornano sempre. Aggiungere carte buone al mazzo le vedrai spesso,
 * ma aggiungere troppe carte "diluisce" il mazzo (le carte buone
 * appaiono meno frequentemente).
 */
export class DeckManager {
  constructor() {
    this.drawPile = [];    // Mazzo (da cui peschi)
    this.hand = [];        // Mano (carte che puoi giocare)
    this.discardPile = []; // Pila degli scarti
    this.handSize = 5;     // Quante carte peschi per turno
  }

  /**
   * Inizializza il mazzo con le carte di partenza.
   */
  initDeck(cardDataArray) {
    let idCounter = 0;
    this.drawPile = cardDataArray.map(data =>
      new Card({ ...data, id: idCounter++ })
    );
    this.shuffle(this.drawPile);
  }

  /**
   * Pesca carte dal mazzo alla mano.
   * Se il mazzo è vuoto, rimescola gli scarti nel mazzo.
   */
  drawCards(count = this.handSize) {
    const drawnCards = [];

    for (let i = 0; i < count; i++) {
      // Se il mazzo è vuoto, rimescola gli scarti
      if (this.drawPile.length === 0) {
        if (this.discardPile.length === 0) break; // Niente carte rimaste!
        this.drawPile = [...this.discardPile];
        this.discardPile = [];
        this.shuffle(this.drawPile);
      }

      // Pesca dalla cima del mazzo
      const card = this.drawPile.pop();
      this.hand.push(card);
      drawnCards.push(card);
    }

    return drawnCards;
  }

  /**
   * Gioca una carta: rimuovila dalla mano e mettila negli scarti.
   */
  playCard(card) {
    const index = this.hand.findIndex(c => c.id === card.id);
    if (index === -1) return false;

    this.hand.splice(index, 1);
    this.discardPile.push(card);
    return true;
  }

  /**
   * Fine turno: scarta tutta la mano.
   * Le carte con retain: true restano in mano.
   */
  discardHand() {
    const retained = this.hand.filter(c => c.retain);
    const toDiscard = this.hand.filter(c => !c.retain);
    this.discardPile.push(...toDiscard);
    this.hand = retained;
    return retained;
  }

  /**
   * Mescola un array in modo casuale (algoritmo Fisher-Yates).
   * Questo è l'algoritmo standard per mescolare — garantisce
   * che ogni ordinamento sia ugualmente probabile.
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Scambia
    }
    return array;
  }
}
