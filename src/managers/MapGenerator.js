/**
 * MapGenerator — Genera la mappa procedurale a nodi.
 *
 * Come funziona la mappa in Slay the Spire:
 * - La mappa ha più "piani" (righe), dal basso verso l'alto
 * - Ogni piano ha diversi nodi (combattimento, evento, negozio, riposo, boss)
 * - I nodi sono collegati tra loro: da un nodo puoi andare solo
 *   ai nodi collegati nel piano successivo
 * - Il giocatore sceglie il percorso, bilanciando rischio e ricompensa
 *
 * La generazione funziona così:
 * 1. Crea una griglia di nodi (piani x colonne)
 * 2. Per ogni piano, genera connessioni casuali al piano successivo
 * 3. Assegna tipi ai nodi (combattimento è il più comune)
 * 4. Il primo piano ha sempre combattimenti facili
 * 5. L'ultimo piano è sempre il boss
 */
import { FLOOR_CONDITIONS } from '../data/floorConditions.js';

export class MapGenerator {
  /**
   * Genera una mappa con un certo numero di piani.
   * @param {number} floors - Numero di piani (default 15, come StS)
   * @param {number} maxColumns - Massime colonne per piano (default 4)
   * @returns {object} - { floors: [...], connections: [...] }
   */
  static generate(floors = 15, maxColumns = 4) {
    const map = {
      floors: [],       // Array di piani, ogni piano è un array di nodi
      connections: [],   // Connessioni tra nodi: { from: {floor, col}, to: {floor, col} }
    };

    // Step 1: Genera i nodi per ogni piano
    for (let f = 0; f < floors; f++) {
      const floor = [];

      if (f === floors - 1) {
        // Ultimo piano: BOSS (un solo nodo)
        floor.push(this.createNode(f, 0, 'boss'));
      } else if (f === 0) {
        // Primo piano: 2-3 combattimenti facili (punti di partenza)
        const count = 3;
        for (let c = 0; c < count; c++) {
          floor.push(this.createNode(f, c, 'combat'));
        }
      } else {
        // Piani intermedi: 2-4 nodi con tipi misti
        const count = this.randomInt(2, Math.min(maxColumns, 4));
        for (let c = 0; c < count; c++) {
          const type = this.getRandomNodeType(f, floors);
          floor.push(this.createNode(f, c, type));
        }
      }

      map.floors.push(floor);
    }

    // Step 2: Genera le connessioni tra piani (evitando incroci)
    for (let f = 0; f < floors - 1; f++) {
      const currentFloor = map.floors[f];
      const nextFloor = map.floors[f + 1];

      // Ogni nodo si connette al nodo più vicino proporzionalmente
      currentFloor.forEach((node, ci) => {
        const pos = currentFloor.length > 1
          ? ci / (currentFloor.length - 1)
          : 0.5;

        const targetIndex = Math.round(pos * (nextFloor.length - 1));

        // Connetti al nodo più vicino
        this.addConnection(map, f, ci, f + 1, targetIndex);

        // 25% di probabilità di connessione extra a UN adiacente
        // (meno connessioni = meno incroci)
        if (Math.random() < 0.25) {
          const direction = Math.random() < 0.5 ? -1 : 1;
          const adj = targetIndex + direction;
          if (adj >= 0 && adj < nextFloor.length) {
            this.addConnection(map, f, ci, f + 1, adj);
          }
        }
      });

      // Assicura che ogni nodo del piano successivo sia raggiungibile
      nextFloor.forEach((node, ni) => {
        const hasIncoming = map.connections.some(
          c => c.to.floor === f + 1 && c.to.col === ni
        );
        if (!hasIncoming) {
          // Trova il nodo del piano precedente la cui posizione proporzionale
          // è più vicina (evita connessioni lunghe che creano incroci)
          const targetPos = nextFloor.length > 1
            ? ni / (nextFloor.length - 1)
            : 0.5;
          let bestIdx = 0;
          let bestDist = Infinity;
          currentFloor.forEach((_, ci) => {
            const srcPos = currentFloor.length > 1
              ? ci / (currentFloor.length - 1)
              : 0.5;
            const dist = Math.abs(srcPos - targetPos);
            if (dist < bestDist) {
              bestDist = dist;
              bestIdx = ci;
            }
          });
          this.addConnection(map, f, bestIdx, f + 1, ni);
        }
      });

      // Rimuovi connessioni che si incrociano (tieni quella più corta)
      this.removeCrossings(map, f);
    }

    // Condizioni di piano: random, non sul piano 0 né sull'ultimo (boss)
    map.floorConditions = [];
    const totalFloors = map.floors.length;
    for (let f = 0; f < totalFloors; f++) {
      if (f === 0 || f === totalFloors - 1) {
        map.floorConditions.push(null);
      } else if (Math.random() < 0.40) {
        const cond = FLOOR_CONDITIONS[Math.floor(Math.random() * FLOOR_CONDITIONS.length)];
        map.floorConditions.push(cond);
      } else {
        map.floorConditions.push(null);
      }
    }

    return map;
  }

  static createNode(floor, col, type) {
    return {
      floor,
      col,
      type,               // 'combat', 'elite', 'event', 'shop', 'rest', 'boss'
      completed: false,
      id: `${floor}-${col}`
    };
  }

  /**
   * Assegna un tipo di nodo casuale in base al piano.
   * Più sali, più è probabile trovare elite e meno combattimenti normali.
   */
  static getRandomNodeType(floor, totalFloors) {
    const progress = floor / totalFloors; // 0 = inizio, 1 = fine
    const roll = Math.random();

    // Piano prima del boss: sempre riposo o negozio
    if (floor === totalFloors - 2) {
      return roll < 0.5 ? 'rest' : 'shop';
    }

    // Distribuzione pesata
    if (progress < 0.3) {
      // Inizio: molti combattimenti, qualche evento, possibilità negozio
      if (roll < 0.55) return 'combat';
      if (roll < 0.75) return 'event';
      if (roll < 0.88) return 'shop';
      return 'rest';
    } else if (progress < 0.6) {
      // Metà: mix di tutto
      if (roll < 0.40) return 'combat';
      if (roll < 0.55) return 'elite';
      if (roll < 0.70) return 'event';
      if (roll < 0.85) return 'shop';
      return 'rest';
    } else {
      // Fine: più elite e combattimenti difficili
      if (roll < 0.35) return 'combat';
      if (roll < 0.60) return 'elite';
      if (roll < 0.75) return 'event';
      if (roll < 0.85) return 'rest';
      return 'shop';
    }
  }

  /**
   * Rimuove connessioni che si incrociano da un piano.
   * Se due connessioni si incrociano, rimuove quella più lunga,
   * ma solo se entrambi i nodi mantengono almeno una connessione.
   */
  static removeCrossings(map, floor) {
    const conns = map.connections.filter(c => c.from.floor === floor);

    const toRemove = new Set();

    for (let i = 0; i < conns.length; i++) {
      for (let j = i + 1; j < conns.length; j++) {
        const a = conns[i];
        const b = conns[j];

        // Incrocio: a.from < b.from ma a.to > b.to (o viceversa)
        const crosses = (a.from.col < b.from.col && a.to.col > b.to.col) ||
                        (a.from.col > b.from.col && a.to.col < b.to.col);

        if (crosses) {
          // Rimuovi la connessione più lunga (in termini di distanza orizzontale)
          const distA = Math.abs(a.from.col - a.to.col);
          const distB = Math.abs(b.from.col - b.to.col);
          const candidate = distA >= distB ? a : b;

          // Verifica che la rimozione non lasci nodi isolati
          const fromConns = conns.filter(c =>
            c.from.col === candidate.from.col && !toRemove.has(conns.indexOf(c))
          );
          const toConns = conns.filter(c =>
            c.to.col === candidate.to.col && !toRemove.has(conns.indexOf(c))
          );

          if (fromConns.length > 1 && toConns.length > 1) {
            toRemove.add(candidate === a ? i : j);
          }
        }
      }
    }

    // Rimuovi le connessioni incrociate
    const toRemoveConns = [...toRemove].map(idx => conns[idx]);
    map.connections = map.connections.filter(c => !toRemoveConns.includes(c));
  }

  static addConnection(map, fromFloor, fromCol, toFloor, toCol) {
    // Evita duplicati
    const exists = map.connections.some(
      c => c.from.floor === fromFloor && c.from.col === fromCol &&
           c.to.floor === toFloor && c.to.col === toCol
    );
    if (!exists) {
      map.connections.push({
        from: { floor: fromFloor, col: fromCol },
        to: { floor: toFloor, col: toCol }
      });
    }
  }

  /**
   * Genera piani extra per la modalità Endless.
   * @param {number} count - Numero di piani da aggiungere (default 5)
   * @param {number} cols - Numero massimo di colonne (default 4)
   * @param {number} difficulty - Difficoltà 1-10, aumenta elite/combat, riduce rest/shop
   * @returns {object} - Mappa parziale con floors e connections da appendere
   */
  static generateEndlessFloors(count = 5, cols = 4, difficulty = 1) {
    // Clamp difficulty
    const d = Math.max(1, Math.min(10, difficulty));
    // Elite weight increases with difficulty, rest/shop decrease
    const eliteBonus   = d * 0.04;   // +4% per livello
    const restPenalty  = d * 0.025;  // -2.5% per livello
    const shopPenalty  = d * 0.02;   // -2% per livello

    const partial = {
      floors: [],
      connections: [],
    };

    for (let f = 0; f < count; f++) {
      const floor = [];

      if (f === count - 1) {
        // Ultimo piano aggiuntivo: sempre boss
        floor.push(this.createNode(f, 0, 'boss'));
      } else if (f === count - 2) {
        // Piano pre-boss: riposo o negozio
        const nodeCount = this.randomInt(2, Math.min(cols, 3));
        for (let c = 0; c < nodeCount; c++) {
          floor.push(this.createNode(f, c, Math.random() < 0.5 ? 'rest' : 'shop'));
        }
      } else {
        const nodeCount = this.randomInt(2, Math.min(cols, 4));
        for (let c = 0; c < nodeCount; c++) {
          const type = this._getEndlessNodeType(f, count, eliteBonus, restPenalty, shopPenalty);
          floor.push(this.createNode(f, c, type));
        }
      }

      partial.floors.push(floor);
    }

    // Genera connessioni interne al blocco partial
    for (let f = 0; f < count - 1; f++) {
      const currentFloor = partial.floors[f];
      const nextFloor = partial.floors[f + 1];

      currentFloor.forEach((node, ci) => {
        const pos = currentFloor.length > 1 ? ci / (currentFloor.length - 1) : 0.5;
        const targetIndex = Math.round(pos * (nextFloor.length - 1));
        this._addPartialConnection(partial, f, ci, f + 1, targetIndex);

        if (Math.random() < 0.25) {
          const dir = Math.random() < 0.5 ? -1 : 1;
          const adj = targetIndex + dir;
          if (adj >= 0 && adj < nextFloor.length) {
            this._addPartialConnection(partial, f, ci, f + 1, adj);
          }
        }
      });

      nextFloor.forEach((node, ni) => {
        const hasIncoming = partial.connections.some(
          c => c.to.floor === f + 1 && c.to.col === ni
        );
        if (!hasIncoming) {
          const targetPos = nextFloor.length > 1 ? ni / (nextFloor.length - 1) : 0.5;
          let bestIdx = 0, bestDist = Infinity;
          currentFloor.forEach((_, ci) => {
            const srcPos = currentFloor.length > 1 ? ci / (currentFloor.length - 1) : 0.5;
            const dist = Math.abs(srcPos - targetPos);
            if (dist < bestDist) { bestDist = dist; bestIdx = ci; }
          });
          this._addPartialConnection(partial, f, bestIdx, f + 1, ni);
        }
      });
    }

    return partial;
  }

  static _getEndlessNodeType(floor, totalFloors, eliteBonus, restPenalty, shopPenalty) {
    const progress = floor / totalFloors;
    const roll = Math.random();

    if (progress < 0.4) {
      const combat = Math.max(0.25, 0.50 - eliteBonus);
      const elite  = Math.min(0.45, 0.15 + eliteBonus);
      const event  = 0.20;
      const shop   = Math.max(0.05, 0.10 - shopPenalty);
      // rest = remaining
      if (roll < combat) return 'combat';
      if (roll < combat + elite) return 'elite';
      if (roll < combat + elite + event) return 'event';
      if (roll < combat + elite + event + shop) return 'shop';
      return 'rest';
    } else {
      const combat = Math.max(0.20, 0.30 - eliteBonus * 0.5);
      const elite  = Math.min(0.55, 0.35 + eliteBonus);
      const event  = 0.15;
      const shop   = Math.max(0.03, 0.10 - shopPenalty);
      if (roll < combat) return 'combat';
      if (roll < combat + elite) return 'elite';
      if (roll < combat + elite + event) return 'event';
      if (roll < combat + elite + event + shop) return 'shop';
      return 'rest';
    }
  }

  static _addPartialConnection(partial, fromFloor, fromCol, toFloor, toCol) {
    const exists = partial.connections.some(
      c => c.from.floor === fromFloor && c.from.col === fromCol &&
           c.to.floor === toFloor && c.to.col === toCol
    );
    if (!exists) {
      partial.connections.push({
        from: { floor: fromFloor, col: fromCol },
        to: { floor: toFloor, col: toCol }
      });
    }
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
