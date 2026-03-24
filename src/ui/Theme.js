/**
 * Theme — Design system condiviso tra tutte le scene.
 *
 * Palette ispirata a un card game premium: sfondi profondi, accenti dorati,
 * colori vivaci per i tipi di carta. Font Cinzel per i titoli, Rajdhani per il corpo.
 */

// ─── Font ────────────────────────────────────────────────────────────────────
export const FONT_TITLE  = 'Cinzel, serif';        // titoli, nomi carte, boss
export const FONT_UI     = 'Rajdhani, sans-serif'; // UI, bottoni, stat
export const FONT_BODY   = 'Inter, sans-serif';    // testo secondario, descrizioni

// ─── Colori base ─────────────────────────────────────────────────────────────
export const C = {
  // Sfondi
  bg:           0x0a0c10,   // sfondo principale (quasi nero blu)
  bgPanel:      0x111520,   // pannelli
  bgPanelDark:  0x0d1018,   // pannelli più profondi
  bgCard:       0x161c2a,   // sfondo carte
  bgHeader:     0x0d1018,   // header barre

  // Bordi
  borderGold:   0xc9a84c,   // bordo dorato principale
  borderGoldDim:0x6b5a26,   // bordo dorato scuro
  borderSubtle: 0x1e2538,   // bordo sottile
  borderBright: 0xe8c96a,   // bordo dorato luminoso (hover/selected)

  // Testo
  textPrimary:  0xeaf0ff,   // testo principale
  textSecondary:0x7a89aa,   // testo secondario
  textGold:     0xc9a84c,   // testo dorato
  textGoldBright:0xf0d880,  // testo dorato brillante

  // Tipi carte
  attack:       0xe05555,   // rosso attacco
  attackDark:   0x2a0f0f,
  attackBorder: 0xc03030,
  defend:       0x4a90d9,   // blu difesa
  defendDark:   0x0f1a2a,
  defendBorder: 0x2a60b0,
  skill:        0x50c878,   // verde abilità
  skillDark:    0x0f2018,
  skillBorder:  0x2a7a40,
  curse:        0x9b59b6,   // viola maledizione
  curseDark:    0x1a0a22,
  curseBorder:  0x6a3080,
  rare:         0xf0a030,   // arancio raro

  // Stato
  hp:           0xe05555,
  hpDark:       0x3a1010,
  mana:         0x4a90d9,
  gold:         0xc9a84c,
  poison:       0x50c878,
  burn:         0xff6b35,
  stun:         0xf0d060,

  // UI
  btnPrimary:   0x1a2540,
  btnHover:     0x253560,
  btnDanger:    0x3a1515,
  btnDangerHov: 0x551f1f,
  btnSuccess:   0x152a18,
  btnSuccessHov:0x1e3f22,
  btnDisabled:  0x151820,

  // Overlay
  overlay:      0x000000,
  overlayAlpha: 0.75,
};

// ─── Helper: disegna pannello con bordo arrotondato ───────────────────────────
/**
 * Disegna un pannello con angoli arrotondati tramite Graphics.
 * @param {Phaser.Scene} scene
 * @param {number} x  centro X
 * @param {number} y  centro Y
 * @param {number} w  larghezza
 * @param {number} h  altezza
 * @param {object} opts
 * @param {number} [opts.radius=10]
 * @param {number} [opts.fill=C.bgPanel]
 * @param {number} [opts.border=C.borderGold]
 * @param {number} [opts.borderWidth=2]
 * @param {number} [opts.depth=0]
 * @param {number} [opts.fillAlpha=1]
 * @returns {Phaser.GameObjects.Graphics}
 */
export function drawPanel(scene, x, y, w, h, opts = {}) {
  const {
    radius = 10,
    fill = C.bgPanel,
    border = C.borderGold,
    borderWidth = 2,
    depth = 0,
    fillAlpha = 1,
  } = opts;

  const g = scene.add.graphics().setDepth(depth);
  const rx = x - w / 2;
  const ry = y - h / 2;

  // Ombra
  g.fillStyle(0x000000, 0.4);
  g.fillRoundedRect(rx + 4, ry + 4, w, h, radius);

  // Sfondo
  g.fillStyle(fill, fillAlpha);
  g.fillRoundedRect(rx, ry, w, h, radius);

  // Bordo
  if (borderWidth > 0) {
    g.lineStyle(borderWidth, border, 1);
    g.strokeRoundedRect(rx, ry, w, h, radius);
  }

  return g;
}

/**
 * Disegna un pannello con gradiente verticale simulato (due rettangoli sovrapposti).
 */
export function drawPanelGradient(scene, x, y, w, h, colorTop, colorBot, opts = {}) {
  const { radius = 10, border = C.borderGold, borderWidth = 2, depth = 0 } = opts;
  const g = scene.add.graphics().setDepth(depth);
  const rx = x - w / 2;
  const ry = y - h / 2;

  // Ombra
  g.fillStyle(0x000000, 0.35);
  g.fillRoundedRect(rx + 3, ry + 5, w, h, radius);

  // Corpo principale (colore base = colorBot)
  g.fillStyle(colorBot, 1);
  g.fillRoundedRect(rx, ry, w, h, radius);

  // Metà superiore con colore più chiaro
  g.fillStyle(colorTop, 0.7);
  g.fillRoundedRect(rx, ry, w, h / 2, { tl: radius, tr: radius, bl: 0, br: 0 });

  if (borderWidth > 0) {
    g.lineStyle(borderWidth, border, 1);
    g.strokeRoundedRect(rx, ry, w, h, radius);
  }
  return g;
}

/**
 * Crea un bottone interattivo con stile coerente.
 * Restituisce { bg, label } — entrambi aggiunti alla scena.
 */
export function createButton(scene, x, y, w, h, label, opts = {}) {
  const {
    fill = C.btnPrimary,
    hover = C.btnHover,
    border = C.borderGold,
    borderWidth = 2,
    radius = 8,
    depth = 0,
    fontSize = '16px',
    font = FONT_UI,
    textColor = '#' + C.textPrimary.toString(16).padStart(6, '0'),
    fontStyle = '700',
    letterSpacing = 2,
    onClick = null,
    onDown = null,
  } = opts;

  const bg = scene.add.graphics().setDepth(depth).setInteractive(
    new Phaser.Geom.Rectangle(x - w / 2, y - h / 2, w, h),
    Phaser.Geom.Rectangle.Contains
  );

  const draw = (color) => {
    bg.clear();
    // Ombra
    bg.fillStyle(0x000000, 0.3);
    bg.fillRoundedRect(x - w / 2 + 2, y - h / 2 + 3, w, h, radius);
    // Corpo
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);
    // Bordo
    bg.lineStyle(borderWidth, border, 1);
    bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius);
  };

  draw(fill);

  const txt = scene.add.text(x, y, label, {
    fontFamily: font,
    fontSize,
    color: textColor,
    fontStyle,
    letterSpacing,
  }).setOrigin(0.5).setDepth(depth + 1);

  bg.on('pointerover',  () => { draw(hover); scene.input.setDefaultCursor('pointer'); });
  bg.on('pointerout',   () => { draw(fill);  scene.input.setDefaultCursor('default'); });
  if (onClick)  bg.on('pointerup',   onClick);
  if (onDown)   bg.on('pointerdown', onDown);

  return { bg, txt };
}

/**
 * Crea una linea separatrice stilizzata.
 */
export function drawDivider(scene, x, y, w, opts = {}) {
  const { color = C.borderSubtle, alpha = 0.8, depth = 0 } = opts;
  const g = scene.add.graphics().setDepth(depth);
  g.lineStyle(1, color, alpha);
  g.lineBetween(x - w / 2, y, x + w / 2, y);
  return g;
}

/**
 * Mappa colori per tipo carta.
 */
export const CARD_COLORS = {
  attack: { bg: C.attackDark,  border: C.attackBorder,  text: '#e87070' },
  defend: { bg: C.defendDark,  border: C.defendBorder,  text: '#6aaad9' },
  skill:  { bg: C.skillDark,   border: C.skillBorder,   text: '#70d990' },
  curse:  { bg: C.curseDark,   border: C.curseBorder,   text: '#c080e0' },
};
