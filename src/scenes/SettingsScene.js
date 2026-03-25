import Phaser from 'phaser';
import { SaveManager } from '../managers/SaveManager.js';
import { MusicManager } from '../managers/MusicManager.js';
import { LocaleManager } from '../managers/LocaleManager.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';

const T = {
  it: {
    title:        'IMPOSTAZIONI',
    audio:        'AUDIO',
    music:        '🎵 Musica',
    sfx:          '🔊 Effetti',
    muteOn:       '🔇 Muto tutto: ON',
    muteOff:      '🔇 Muto tutto: OFF',
    display:      'DISPLAY',
    fullscreenOn: 'Schermo intero: ON',
    fullscreenOff:'Schermo intero: OFF',
    animOn:       'Animazioni: ON',
    animOff:      'Animazioni: OFF',
    data:         'DATI',
    reset:        'Reimposta progressi',
    back:         '← INDIETRO',
    resetTitle:   'REIMPOSTA PROGRESSI',
    resetBody:    'Tutti i progressi, statistiche\ne collezione verranno cancellati.',
    confirm:      'CONFERMA',
    cancel:       'ANNULLA',
    applying:     'Applicazione...',
  },
  en: {
    title:        'SETTINGS',
    audio:        'AUDIO',
    music:        '🎵 Music',
    sfx:          '🔊 Effects',
    muteOn:       '🔇 Mute all: ON',
    muteOff:      '🔇 Mute all: OFF',
    display:      'DISPLAY',
    fullscreenOn: 'Fullscreen: ON',
    fullscreenOff:'Fullscreen: OFF',
    animOn:       'Animations: ON',
    animOff:      'Animations: OFF',
    data:         'DATA',
    reset:        'Reset progress',
    back:         '← BACK',
    resetTitle:   'RESET PROGRESS',
    resetBody:    'All progress, statistics\nand collection will be deleted.',
    confirm:      'CONFIRM',
    cancel:       'CANCEL',
    applying:     'Applying...',
  },
};

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('Settings');
  }

  create() {
    const W = 1280;
    const H = 720;
    const cx = W / 2;
    const cy = H / 2;

    const lang = LocaleManager.getLang();
    const t = k => (T[lang] || T.it)[k] ?? T.it[k];

    this._settings = SaveManager.getSettings();

    this.add.rectangle(cx, cy, W, H, 0x000000, 0.6).setDepth(0);

    const panW = 600;
    const panH = 540;
    drawPanel(this, cx, cy, panW, panH, {
      fill: C.bgPanel, border: C.borderGold, borderWidth: 2, radius: 12, depth: 1,
    });

    const titleY = cy - panH / 2 + 38;
    this.add.text(cx, titleY, t('title'), {
      fontFamily: FONT_TITLE, fontSize: '32px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'), letterSpacing: 4,
    }).setOrigin(0.5).setDepth(2);

    drawDivider(this, cx, titleY + 26, panW - 40, { color: C.borderGold, alpha: 0.6, depth: 2 });

    const startY = titleY + 52;
    let curY = startY;

    // ─── AUDIO ────────────────────────────────────────────────────────────────
    this._addSectionLabel(t('audio'), cx, curY);
    curY += 28;

    this._musicSliderRefs = this._addSlider(
      cx - 280 / 2 + 10, curY, t('music'), this._settings.musicVolume,
      (val) => { this._settings.musicVolume = val; MusicManager.setVolume(this, val); this._saveSettings(); }
    );
    curY += 52;

    this._sfxSliderRefs = this._addSlider(
      cx - 280 / 2 + 10, curY, t('sfx'), this._settings.sfxVolume,
      (val) => { this._settings.sfxVolume = val; this._saveSettings(); }
    );
    curY += 52;

    this._muteBtn = this._addToggleButton(
      cx, curY,
      () => this._settings.muted ? t('muteOn') : t('muteOff'),
      this._settings.muted,
      (active) => {
        this._settings.muted = active;
        this._saveSettings();
        MusicManager.setVolume(this, active ? 0 : this._settings.musicVolume);
      }
    );
    curY += 52;

    drawDivider(this, cx, curY, panW - 40, { color: C.borderSubtle, alpha: 0.5, depth: 2 });
    curY += 16;

    // ─── DISPLAY ──────────────────────────────────────────────────────────────
    this._addSectionLabel(t('display'), cx, curY);
    curY += 28;

    this._fsBtn = this._addToggleButton(
      cx - 140, curY,
      () => document.fullscreenElement ? t('fullscreenOn') : t('fullscreenOff'),
      !!document.fullscreenElement,
      () => { this.scale.toggleFullscreen(); }
    );

    this._animBtn = this._addToggleButton(
      cx + 140, curY,
      () => this._settings.animations ? t('animOn') : t('animOff'),
      this._settings.animations,
      (active) => { this._settings.animations = active; this._saveSettings(); }
    );
    curY += 52;

    drawDivider(this, cx, curY, panW - 40, { color: C.borderSubtle, alpha: 0.5, depth: 2 });
    curY += 16;

    // ─── LINGUA ───────────────────────────────────────────────────────────────
    this._addSectionLabel('LINGUA / LANGUAGE', cx, curY);
    curY += 28;
    this._langBtn = this._addLangToggle(cx, curY, t('applying'));
    curY += 52;

    drawDivider(this, cx, curY, panW - 40, { color: C.borderSubtle, alpha: 0.5, depth: 2 });
    curY += 16;

    // ─── DATI ─────────────────────────────────────────────────────────────────
    this._addSectionLabel(t('data'), cx, curY);
    curY += 28;

    createButton(this, cx, curY, 260, 38, t('reset'), {
      fill: C.btnDanger, hover: C.btnDangerHov, border: C.attack,
      fontSize: '13px', font: FONT_UI, letterSpacing: 1, depth: 2,
      onClick: () => this._showResetConfirm(t),
    });
    curY += 50;

    this.add.text(cx, curY, 'v1.0', {
      fontFamily: FONT_BODY, fontSize: '11px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
    }).setOrigin(0.5).setDepth(2);

    createButton(this, cx - panW / 2 + 72, cy - panH / 2 + 22, 120, 34, t('back'), {
      fill: C.bgPanelDark, hover: C.btnHover, border: C.borderGoldDim,
      fontSize: '12px', font: FONT_UI, letterSpacing: 1, depth: 2,
      onClick: () => this._goBack(),
    });

    if (this._settings.muted) {
      MusicManager.setVolume(this, 0);
    } else {
      MusicManager.setVolume(this, this._settings.musicVolume);
    }
  }

  // ── Helpers UI ──────────────────────────────────────────────────────────────

  _addSectionLabel(label, x, y) {
    this.add.text(x, y, label, {
      fontFamily: FONT_UI, fontSize: '11px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      letterSpacing: 3, fontStyle: '700',
    }).setOrigin(0.5).setDepth(2);
  }

  _addSlider(x, y, label, value, onChange) {
    const barW = 240, barH = 8, handleR = 10;
    const labelX = x, barX = x + 100, depth = 2;

    this.add.text(labelX + 40, y + barH / 2, label, {
      fontFamily: FONT_UI, fontSize: '14px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
    }).setOrigin(0, 0.5).setDepth(depth);

    const sliderBg = this.add.graphics().setDepth(depth);
    sliderBg.fillStyle(C.bgPanelDark, 1);
    sliderBg.fillRoundedRect(barX, y, barW, barH, 4);

    const sliderFill = this.add.graphics().setDepth(depth + 1);
    const drawFill = (v) => {
      sliderFill.clear();
      sliderFill.fillStyle(C.borderGold, 1);
      sliderFill.fillRoundedRect(barX, y, Math.max(8, v * barW), barH, 4);
    };
    drawFill(value);

    const handle = this.add.circle(barX + value * barW, y + barH / 2, handleR, C.borderGold)
      .setDepth(depth + 2).setInteractive({ draggable: true });
    const handleBorder = this.add.graphics().setDepth(depth + 3);
    const drawHandleBorder = (hx) => {
      handleBorder.clear();
      handleBorder.lineStyle(2, C.borderBright, 1);
      handleBorder.strokeCircle(hx, y + barH / 2, handleR);
    };
    drawHandleBorder(barX + value * barW);
    this.input.setDraggable(handle);

    handle.on('drag', (_ptr, dx) => {
      const nx = Phaser.Math.Clamp(dx, barX, barX + barW);
      handle.x = nx;
      drawHandleBorder(nx);
      drawFill((nx - barX) / barW);
      onChange((nx - barX) / barW);
    });
    handle.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    handle.on('pointerout',  () => this.input.setDefaultCursor('default'));

    return { fill: sliderFill, handle };
  }

  _addToggleButton(x, y, labelFn, initial, onChange) {
    let active = initial;
    const w = 200, h = 36, depth = 2;

    const getFill   = () => active ? C.btnSuccess    : C.bgPanelDark;
    const getHover  = () => active ? C.btnSuccessHov : C.btnPrimary;
    const getBorder = () => active ? C.skill         : C.borderSubtle;

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
      fontFamily: FONT_UI, fontSize: '12px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: '700', letterSpacing: 1,
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

  _addLangToggle(x, y, applyingLabel) {
    const w = 260, h = 36, depth = 2;
    const getLang = () => LocaleManager.getLang();
    const getLabelText = () => getLang() === 'en' ? '🌍 LANGUAGE: ENGLISH' : '🌍 LINGUA: ITALIANO';

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
      bg.lineStyle(2, C.borderGoldDim, 1);
      bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 8);
    };
    draw(C.bgPanelDark);

    const txt = this.add.text(x, y, getLabelText(), {
      fontFamily: FONT_UI, fontSize: '13px',
      color: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      fontStyle: '700', letterSpacing: 1,
    }).setOrigin(0.5).setDepth(depth + 1);

    const msg = this.add.text(x, y + h / 2 + 10, '', {
      fontFamily: FONT_BODY, fontSize: '11px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
    }).setOrigin(0.5).setDepth(depth + 1);

    bg.on('pointerover',  () => { draw(C.btnHover); this.input.setDefaultCursor('pointer'); });
    bg.on('pointerout',   () => { draw(C.bgPanelDark); this.input.setDefaultCursor('default'); });
    bg.on('pointerup', () => {
      const newLang = getLang() === 'en' ? 'it' : 'en';
      LocaleManager.setLang(newLang);
      txt.setText(getLabelText());
      draw(C.bgPanelDark);
      msg.setText(applyingLabel);
      this.time.delayedCall(400, () => window.location.reload());
    });

    return { bg, txt, msg };
  }

  _showResetConfirm(t) {
    const W = 1280, H = 720, cx = W / 2, cy = H / 2, depth = 10;

    const dimOverlay = this.add.rectangle(cx, cy, W, H, 0x000000, 0.55).setDepth(depth);
    drawPanel(this, cx, cy, 420, 220, {
      fill: C.bgPanel, border: C.attack, borderWidth: 2, radius: 12, depth: depth + 1,
    });

    const titleTxt = this.add.text(cx, cy - 60, t('resetTitle'), {
      fontFamily: FONT_TITLE, fontSize: '18px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'), letterSpacing: 2,
    }).setOrigin(0.5).setDepth(depth + 2);

    const bodyTxt = this.add.text(cx, cy - 20, t('resetBody'), {
      fontFamily: FONT_BODY, fontSize: '13px',
      color: '#' + C.textSecondary.toString(16).padStart(6, '0'), align: 'center',
    }).setOrigin(0.5).setDepth(depth + 2);

    const panelChildren = this.children.getAll().filter(c => c.depth >= depth + 1);

    const _cleanup = () => {
      panelChildren.forEach(c => { try { c.destroy(); } catch (_) {} });
      dimOverlay.destroy();
      titleTxt.destroy();
      bodyTxt.destroy();
      try { confirmBtn.bg.destroy(); confirmBtn.txt.destroy(); } catch (_) {}
      try { cancelBtn.bg.destroy();  cancelBtn.txt.destroy();  } catch (_) {}
    };

    const confirmBtn = createButton(this, cx - 70, cy + 70, 120, 38, t('confirm'), {
      fill: C.btnDanger, hover: C.btnDangerHov, border: C.attack,
      fontSize: '13px', font: FONT_UI, letterSpacing: 2, depth: depth + 2,
      onClick: () => {
        Object.keys(localStorage).filter(k => k.startsWith('cardRoguelike_')).forEach(k => localStorage.removeItem(k));
        _cleanup();
      },
    });

    const cancelBtn = createButton(this, cx + 70, cy + 70, 120, 38, t('cancel'), {
      fill: C.bgPanelDark, hover: C.btnPrimary, border: C.borderSubtle,
      fontSize: '13px', font: FONT_UI, letterSpacing: 2, depth: depth + 2,
      onClick: () => _cleanup(),
    });
  }

  _saveSettings() {
    SaveManager.saveSettings(this._settings);
  }

  _goBack() {
    if (this.scene.isPaused('Combat')) {
      this.scene.stop('Settings');
      this.scene.resume('Combat');
    } else {
      this.scene.start('MainMenu');
    }
  }
}
