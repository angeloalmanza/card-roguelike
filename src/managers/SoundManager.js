/**
 * SoundManager — Suoni procedurali via Web Audio API.
 * Nessun file audio esterno richiesto. Importabile da qualsiasi scena:
 *   import { SoundManager } from '../managers/SoundManager.js';
 */
export class SoundManager {
  static _ctx = null;
  static _muted = false;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  static getContext() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('[SoundManager] Web Audio API non disponibile:', e);
        return null;
      }
    }
    // Resume se sospeso (policy autoplay browser)
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
    return this._ctx;
  }

  static mute()       { this._muted = true; }
  static unmute()     { this._muted = false; }
  static toggleMute() { this._muted = !this._muted; }
  static isMuted()    { return this._muted; }

  // ---------------------------------------------------------------------------
  // Primitive interna
  // ---------------------------------------------------------------------------

  /**
   * Genera un singolo tono sintetico.
   * @param {object} opts
   * @param {OscillatorType} opts.type      - tipo oscillatore ('sine'|'sawtooth'|'square'|'triangle')
   * @param {number}         opts.freq      - frequenza iniziale (Hz)
   * @param {number|null}    opts.endFreq   - frequenza finale (ramp lineare)
   * @param {number}         opts.duration  - durata in ms
   * @param {number}         opts.gain      - volume iniziale (0–1)
   * @param {number}         opts.endGain   - volume finale (ramp lineare)
   * @param {number}         opts.startOffset - ritardo prima dell'avvio (ms)
   */
  static _playTone({
    type = 'sine',
    freq = 440,
    endFreq = null,
    duration = 100,
    gain = 0.3,
    endGain = 0,
    startOffset = 0,
  }) {
    const ctx = this.getContext();
    if (!ctx || this._muted) return;

    const osc      = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = type;

    const now    = ctx.currentTime + startOffset / 1000;
    const dur    = duration / 1000;

    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== null) {
      osc.frequency.linearRampToValueAtTime(endFreq, now + dur);
    }

    gainNode.gain.setValueAtTime(gain, now);
    gainNode.gain.linearRampToValueAtTime(endGain, now + dur);

    osc.start(now);
    osc.stop(now + dur + 0.01);
  }

  // ---------------------------------------------------------------------------
  // API pubblica
  // ---------------------------------------------------------------------------

  /**
   * Carta giocata.
   * @param {'attack'|'defend'|'skill'} cardType
   */
  static playCardPlay(cardType) {
    switch (cardType) {
      case 'attack':
        this._playTone({ type: 'sawtooth', freq: 220, endFreq: 440, duration: 80,  gain: 0.3, endGain: 0 });
        break;
      case 'defend':
        this._playTone({ type: 'sine',     freq: 330, endFreq: 220, duration: 80,  gain: 0.2, endGain: 0 });
        break;
      case 'skill':
        // Andamento freq 440 → 550 → 440 simulato con due toni sovrapposti
        this._playTone({ type: 'sine', freq: 440, endFreq: 550, duration: 75,  gain: 0.15, endGain: 0.1 });
        this._playTone({ type: 'sine', freq: 550, endFreq: 440, duration: 75,  gain: 0.1,  endGain: 0,   startOffset: 75 });
        break;
      default:
        this._playTone({ type: 'sine', freq: 440, endFreq: 550, duration: 100, gain: 0.15, endGain: 0 });
    }
  }

  /** Nemico riceve danno. */
  static playDamageHit() {
    this._playTone({ type: 'sawtooth', freq: 150, endFreq: 150, duration: 60,  gain: 0.4, endGain: 0 });
    this._playTone({ type: 'square',   freq: 80,  endFreq: 80,  duration: 80,  gain: 0.2, endGain: 0 });
  }

  /** Giocatore riceve danno. */
  static playPlayerHit() {
    this._playTone({ type: 'sawtooth', freq: 80,  endFreq: 80,  duration: 60,  gain: 0.5, endGain: 0 });
    this._playTone({ type: 'square',   freq: 50,  endFreq: 50,  duration: 80,  gain: 0.35, endGain: 0 });
  }

  /** Blocco attivato. */
  static playBlock() {
    this._playTone({ type: 'sine', freq: 600, endFreq: 800, duration: 50, gain: 0.15, endGain: 0 });
  }

  /** Nemico sconfitto. */
  static playEnemyDeath() {
    this._playTone({ type: 'sawtooth', freq: 300, endFreq: 50,  duration: 400, gain: 0.4, endGain: 0 });
    this._playTone({ type: 'sine',     freq: 500, endFreq: 200, duration: 300, gain: 0.25, endGain: 0 });
  }

  /** Vittoria combattimento. */
  static playVictory() {
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      this._playTone({
        type: 'sine',
        freq,
        endFreq: freq,
        duration: 120,
        gain: 0.3,
        endGain: 0,
        startOffset: i * 150,
      });
    });
  }

  /** Sconfitta. */
  static playDefeat() {
    this._playTone({ type: 'sine', freq: 300, endFreq: 100, duration: 800, gain: 0.3, endGain: 0 });
  }

  /** Raccolta reliquia. */
  static playRelicPickup() {
    const notes = [440, 550, 660];
    notes.forEach((freq, i) => {
      this._playTone({
        type: 'sine',
        freq,
        endFreq: freq,
        duration: 80,
        gain: 0.2,
        endGain: 0,
        startOffset: i * 80,
      });
    });
  }

  /** Raccolta oro. */
  static playGoldPickup() {
    this._playTone({ type: 'sine', freq: 880, endFreq: 1100, duration: 60, gain: 0.15, endGain: 0 });
  }

  /** Click UI generico. */
  static playButtonClick() {
    this._playTone({ type: 'sine', freq: 1000, endFreq: 1000, duration: 30, gain: 0.1, endGain: 0 });
  }

  /** Achievement / ascensione. */
  static playLevelUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      this._playTone({
        type: 'sine',
        freq,
        endFreq: freq,
        duration: 100,
        gain: 0.25,
        endGain: 0,
        startOffset: i * 120,
      });
    });
  }

  /** Tick veleno. */
  static playPoison() {
    this._playTone({ type: 'sine', freq: 200, endFreq: 180, duration: 100, gain: 0.1, endGain: 0 });
  }
}
