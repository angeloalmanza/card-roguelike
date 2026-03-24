import Phaser from 'phaser';
import { SaveManager } from '../managers/SaveManager.js';
import { MusicManager } from '../managers/MusicManager.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';

/**
 * SettingsScene — Scena dedicata alle impostazioni.
 *
 * Può essere avviata come scena standalone (dal MainMenu) o come overlay
 * durante il combattimento (via this.scene.launch('Settings')).
 */
export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('Settings');
  }

  create() {
    const W = 1280;
    const H = 720;
    const cx = W / 2;
    const cy = H / 2;

    this._settings = SaveManager.getSettings();

    // ── Overlay scuro se in overlay ──────────────────────────────────────────
    const overlay = this.add.rectangle(cx, cy, W, H, 0x000000, 0.6).setDepth(0);

    // ── Pannello centrale 600×480 ─────────────────────────────────────────────
    const panW = 600;
    const panH = 480;
    drawPanel(this, cx, cy, panW, panH, {
      fill: C.bgPanel,
      border: C.borderGold,
      borderWidth: 2,
      radius: 12,
      depth: 1,
    });

    // ── Titolo ────────────────────────────────────────────────────────────────
    const titleY = cy - panH / 2 + 38;
    this.add.text(cx, titleY, 'IMPOSTAZIONI', {
      fontFamily: FONT_TITLE,
      fontSize: '32px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 4,
    }).setOrigin(0.5).setDepth(2);

    drawDivider(this, cx, titleY + 26, panW - 40, { color: C.borderGold, alpha: 0.6, depth: 2 });

    // ── Layout interno ────────────────────────────────────────────────────────
    const startY = titleY + 52;
    let curY = startY;

    // ─── SEZIONE AUDIO ────────────────────────────────────────────────────────
    this._addSectionLabel('AUDIO', cx, curY);
    curY += 28;

    // Slider Musica
    this._musicSliderRefs = this._addSlider(
      cx - 280 / 2 + 10, curY,
      '🎵 Musica',
      this._settings.musicVolume,
      (val) => {
        this._settings.musicVolume = val;
        MusicManager.setVolume(this, val);
        this._saveSettings();
      }
    );
    curY += 52;

    // Slider Effetti
    this._sfxSliderRefs = this._addSlider(
      cx - 280 / 2 + 10, curY,
      '🔊 Effetti',
      this._settings.sfxVolume,
      (val) => {
        this._settings.sfxVolume = val;
        this._saveSettings();
      }
    );
    curY += 52;

    // Toggle Muto
    this._muteBtn = this._addToggleButton(
      cx, curY,
      () => this._settings.muted ? '🔇 Muto tutto: ON' : '🔇 Muto tutto: OFF',
      this._settings.muted,
      (active) => {
        this._settings.muted = active;
        this._saveSettings();
        // Applica muto alla musica
        if (active) {
          MusicManager.setVolume(this, 0);
        } else {
          MusicManager.setVolume(this, this._settings.musicVolume);
        }
      }
    );
    curY += 52;

    drawDivider(this, cx, curY, panW - 40, { color: C.borderSubtle, alpha: 0.5, depth: 2 });
    curY += 16;

    // ─── SEZIONE DISPLAY ──────────────────────────────────────────────────────
    this._addSectionLabel('DISPLAY', cx, curY);
    curY += 28;

    // Toggle Schermo Intero
    const isFS = !!document.fullscreenElement;
    this._fsBtn = this._addToggleButton(
      cx - 140, curY,
      () => document.fullscreenElement ? 'Schermo intero: ON' : 'Schermo intero: OFF',
      isFS,
      (active) => {
        this.scale.toggleFullscreen();
      }
    );

    // Toggle Animazioni
    this._animBtn = this._addToggleButton(
      cx + 140, curY,
      () => this._settings.animations ? 'Animazioni: ON' : 'Animazioni: OFF',
      this._settings.animations,
      (active) => {
        this._settings.animations = active;
        this._saveSettings();
      }
    );
    curY += 52;

    drawDivider(this, cx, curY, panW - 40, { color: C.borderSubtle, alpha: 0.5, depth: 2 });
    curY += 16;

    // ─── SEZIONE DATI ─────────────────────────────────────────────────────────
    this._addSectionLabel('DATI', cx, curY);
    curY += 28;

    // Bottone Reimposta progressi
    createButton(this, cx, curY, 260, 38, 'Reimposta progressi', {
      fill: C.btnDanger,
      hover: C.btnDangerHov,
      border: C.attack,
      fontSize: '13px',
      font: FONT_UI,
      letterSpacing: 1,
      depth: 2,
      onClick: () => this._showResetConfirm(),
    });
    curY += 50;

    // Versione
    this.add.text(cx, curY, 'v1.0', {
      fontFamily: FONT_BODY,
      fontSize: '11px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
    }).setOrigin(0.5).setDepth(2);

    // ── Bottone INDIETRO ──────────────────────────────────────────────────────
    createButton(this, cx - panW / 2 + 72, cy - panH / 2 + 22, 120, 34, '← INDIETRO', {
      fill: C.bgPanelDark,
      hover: C.btnHover,
      border: C.borderGoldDim,
      fontSize: '12px',
      font: FONT_UI,
      letterSpacing: 1,
      depth: 2,
      onClick: () => this._goBack(),
    });

    // Applica lo stato muto corrente al volume musica
    if (this._settings.muted) {
      MusicManager.setVolume(this, 0);
    } else {
      MusicManager.setVolume(this, this._settings.musicVolume);
    }
  }

  // ── Helpers UI ──────────────────────────────────────────────────────────────

  _addSectionLabel(label, x, y) {
    this.add.text(x, y, label, {
      fontFamily: FONT_UI,
      fontSize: '11px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      letterSpacing: 3,
      fontStyle: '700',
    }).setOrigin(0.5).setDepth(2);
  }

  /**
   * Aggiunge uno slider orizzontale.
   * @param {number} x       - X sinistra della barra
   * @param {number} y       - Y centro
   * @param {string} label   - Etichetta sinistra
   * @param {number} value   - Valore iniziale 0-1
   * @param {Function} onChange - Callback(val) quando cambia
   * @returns {{ fill: Phaser.GameObjects.Graphics, handle: Phaser.GameObjects.Arc }}
   */
  _addSlider(x, y, label, value, onChange) {
    const barW = 240;
    const barH = 8;
    const handleR = 10;
    const labelX = x;
    const barX = x + 100;
    const depth = 2;

    // Label
    this.add.text(labelX + 40, y + barH / 2, label, {
      fontFamily: FONT_UI,
      fontSize: '14px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
    }).setOrigin(0, 0.5).setDepth(depth);

    // Sfondo barra
    const sliderBg = this.add.graphics().setDepth(depth);
    sliderBg.fillStyle(C.bgPanelDark, 1);
    sliderBg.fillRoundedRect(barX, y, barW, barH, 4);

    // Barra fill
    const sliderFill = this.add.graphics().setDepth(depth + 1);
    const drawFill = (v) => {
      sliderFill.clear();
      sliderFill.fillStyle(C.borderGold, 1);
      sliderFill.fillRoundedRect(barX, y, Math.max(8, v * barW), barH, 4);
    };
    drawFill(value);

    // Handle
    const handle = this.add.circle(barX + value * barW, y + barH / 2, handleR, C.borderGold)
      .setDepth(depth + 2)
      .setInteractive({ draggable: true });
    // Bordo handle
    const handleBorder = this.add.graphics().setDepth(depth + 3);
    const drawHandleBorder = (hx) => {
      handleBorder.clear();
      handleBorder.lineStyle(2, C.borderBright, 1);
      handleBorder.strokeCircle(hx, y + barH / 2, handleR);
    };
    drawHandleBorder(barX + value * barW);

    this.input.setDraggable(handle);

    handle.on('drag', (_ptr, dx, _dy) => {
      const nx = Phaser.Math.Clamp(dx, barX, barX + barW);
      handle.x = nx;
      drawHandleBorder(nx);
      const val = (nx - barX) / barW;
      drawFill(val);
      onChange(val);
    });

    handle.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    handle.on('pointerout',  () => this.input.setDefaultCursor('default'));

    return { fill: sliderFill, handle };
  }

  /**
   * Aggiunge un bottone toggle.
   * @param {number} x
   * @param {number} y
   * @param {Function} labelFn  - Funzione che ritorna la stringa label
   * @param {boolean} initial   - Stato iniziale
   * @param {Function} onChange - Callback(active)
   */
  _addToggleButton(x, y, labelFn, initial, onChange) {
    let active = initial;
    const w = 200;
    const h = 36;
    const depth = 2;

    const fillOff = C.bgPanelDark;
    const fillOn  = C.btnSuccess;
    const hoverOff = C.btnPrimary;
    const hoverOn  = C.btnSuccessHov;
    const borderOff = C.borderSubtle;
    const borderOn  = C.skill;

    const getFill  = () => active ? fillOn  : fillOff;
    const getHover = () => active ? hoverOn : hoverOff;
    const getBorder = () => active ? borderOn : borderOff;

    const bg = this.add.graphics().setDepth(depth).setInteractive(
      new Phaser.Geom.Rectangle(x - w / 2, y - h / 2, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    const draw = (color) => {
      bg.clear();
      bg.fillStyle(0x000000, 0.2);
      bg.fillRoundedRect(x - w / 2 + 2, y - h / 2 + 2, w, h, 8);
      bg.fillStyle(color, 1);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
      bg.lineStyle(2, getBorder(), 1);
      bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 8);
    };
    draw(getFill());

    const txt = this.add.text(x, y, labelFn(), {
      fontFamily: FONT_UI,
      fontSize: '12px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: '700',
      letterSpacing: 1,
    }).setOrigin(0.5).setDepth(depth + 1);

    bg.on('pointerover',  () => { draw(getHover()); this.input.setDefaultCursor('pointer'); });
    bg.on('pointerout',   () => { draw(getFill());  this.input.setDefaultCursor('default'); });
    bg.on('pointerup', () => {
      active = !active;
      onChange(active);
      txt.setText(labelFn());
      draw(getFill());
    });

    return { bg, txt };
  }

  // ── Dialog conferma reset ────────────────────────────────────────────────────
  _showResetConfirm() {
    const W = 1280;
    const H = 720;
    const cx = W / 2;
    const cy = H / 2;
    const depth = 10;

    // Overlay scuro
    const dimOverlay = this.add.rectangle(cx, cy, W, H, 0x000000, 0.55).setDepth(depth);

    // Pannello dialog
    drawPanel(this, cx, cy, 420, 220, {
      fill: C.bgPanel,
      border: C.attack,
      borderWidth: 2,
      radius: 12,
      depth: depth + 1,
    });

    this.add.text(cx, cy - 60, 'REIMPOSTA PROGRESSI', {
      fontFamily: FONT_TITLE,
      fontSize: '18px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 2,
    }).setOrigin(0.5).setDepth(depth + 2);

    this.add.text(cx, cy - 20, 'Tutti i progressi, statistiche\ne collezione verranno cancellati.', {
      fontFamily: FONT_BODY,
      fontSize: '13px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      align: 'center',
    }).setOrigin(0.5).setDepth(depth + 2);

    const cleanup = () => {
      dimOverlay.destroy();
      panelRef.destroy();
      titleRef.destroy();
      bodyRef.destroy();
      confirmBtn.bg.destroy();
      confirmBtn.txt.destroy();
      cancelBtn.bg.destroy();
      cancelBtn.txt.destroy();
    };

    const confirmBtn = createButton(this, cx - 70, cy + 70, 120, 38, 'CONFERMA', {
      fill: C.btnDanger,
      hover: C.btnDangerHov,
      border: C.attack,
      fontSize: '13px',
      font: FONT_UI,
      letterSpacing: 2,
      depth: depth + 2,
      onClick: () => {
        // Cancella tutti i localStorage keys del gioco
        const keys = Object.keys(localStorage).filter(k => k.startsWith('cardRoguelike_'));
        keys.forEach(k => localStorage.removeItem(k));
        cleanup();
      },
    });

    const cancelBtn = createButton(this, cx + 70, cy + 70, 120, 38, 'ANNULLA', {
      fill: C.bgPanelDark,
      hover: C.btnPrimary,
      border: C.borderSubtle,
      fontSize: '13px',
      font: FONT_UI,
      letterSpacing: 2,
      depth: depth + 2,
      onClick: () => cleanup(),
    });

    // Teniamo riferimenti per il cleanup
    // (I testi e il pannello sono già aggiunti alla scena; li recuperiamo tramite le variabili locali)
    const panelRef   = this.children.getAll().slice(-7)[0]; // non affidabile — meglio usare riferimenti diretti
    const titleRef   = this.children.getAll().find(c => c.text === 'REIMPOSTA PROGRESSI');
    const bodyRef    = this.children.getAll().find(c => c.text && c.text.includes('progressi') && c.text.includes('cancellati'));

    // Metodo cleanup più robusto: teniamo solo riferimenti diretti
    const _cleanup = () => {
      dimOverlay.destroy();
      [confirmBtn.bg, confirmBtn.txt, cancelBtn.bg, cancelBtn.txt].forEach(o => { if (o && o.active) o.destroy(); });
      // Cerchiamo e distruggiamo i testi del dialog
      this.children.getAll().forEach(child => {
        if (child.depth >= depth + 1 && child !== dimOverlay) {
          try { child.destroy(); } catch (_) {}
        }
      });
    };

    // Aggiorna i callback con _cleanup corretto
    confirmBtn.bg.off('pointerup');
    confirmBtn.bg.on('pointerup', () => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cardRoguelike_'));
      keys.forEach(k => localStorage.removeItem(k));
      _cleanup();
    });
    cancelBtn.bg.off('pointerup');
    cancelBtn.bg.on('pointerup', () => _cleanup());
  }

  // ── Persistenza ─────────────────────────────────────────────────────────────
  _saveSettings() {
    SaveManager.saveSettings(this._settings);
  }

  // ── Navigazione ─────────────────────────────────────────────────────────────
  _goBack() {
    // Se siamo in overlay durante il combattimento
    if (this.scene.isPaused('Combat')) {
      this.scene.stop('Settings');
      this.scene.resume('Combat');
    } else {
      this.scene.start('MainMenu');
    }
  }
}
