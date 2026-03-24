import Phaser from 'phaser';
import { SaveManager } from '../managers/SaveManager.js';
import { CLASS_EMOJIS } from '../data/classes.js';
import { C, FONT_TITLE, FONT_UI, FONT_BODY, drawPanel, createButton, drawDivider } from '../ui/Theme.js';

export class StatsScene extends Phaser.Scene {
  constructor() {
    super('Stats');
  }

  create() {
    const { width, height } = this.scale;

    this._buildBackground(width, height);

    // Tab state: 'stats' | 'leaderboard'
    this._activeTab = 'stats';

    // Container per il contenuto di ogni tab (destroyed on tab switch)
    this._contentContainer = null;

    this._buildTabs(width);
    this._showStats(width, height);
    this._buildBackButton(width, height);
  }

  // ----------------------------------------------------------------
  // Background
  // ----------------------------------------------------------------
  _buildBackground(width, height) {
    // Sfondo principale
    this.add.rectangle(width / 2, height / 2, width, height, C.bg);

    // Header bar
    drawPanel(this, width / 2, 40, width, 80, {
      radius: 0,
      fill: C.bgHeader,
      border: C.borderGold,
      borderWidth: 0,
    });

    // Linea dorata top
    this.add.rectangle(width / 2, 0, width, 3, C.borderGold).setOrigin(0.5, 0);

    // Titolo
    this.add.text(width / 2, 28, 'STATISTICHE', {
      fontFamily: FONT_TITLE,
      fontSize: '32px',
      color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
      letterSpacing: 4,
    }).setOrigin(0.5);

    // Divider sotto header
    drawDivider(this, width / 2, 65, width, { color: C.borderGold, alpha: 0.4 });
  }

  // ----------------------------------------------------------------
  // Tab bar
  // ----------------------------------------------------------------
  _buildTabs(width) {
    const tabY = 88;
    const tabs = [
      { id: 'stats',       label: 'GLOBALI' },
      { id: 'leaderboard', label: '🏆 CLASSIFICA' },
    ];

    this._tabObjs = {};

    tabs.forEach((tab, i) => {
      const x = width / 2 - 115 + i * 230;
      const isActive = tab.id === this._activeTab;

      const g = this.add.graphics().setDepth(10).setInteractive(
        new Phaser.Geom.Rectangle(x - 105, tabY - 16, 210, 32),
        Phaser.Geom.Rectangle.Contains
      );

      const drawTab = (active) => {
        g.clear();
        g.fillStyle(active ? C.bgPanel : C.bgPanelDark, 1);
        g.fillRoundedRect(x - 105, tabY - 16, 210, 32, { tl: 8, tr: 8, bl: 0, br: 0 });
        g.lineStyle(1, active ? C.borderGold : C.borderSubtle, 1);
        g.strokeRoundedRect(x - 105, tabY - 16, 210, 32, { tl: 8, tr: 8, bl: 0, br: 0 });
      };

      drawTab(isActive);

      const txt = this.add.text(x, tabY, tab.label, {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: isActive
          ? '#' + C.textGoldBright.toString(16).padStart(6, '0')
          : '#' + C.textSecondary.toString(16).padStart(6, '0'),
        fontStyle: '700',
        letterSpacing: 2,
      }).setOrigin(0.5).setDepth(11);

      this._tabObjs[tab.id] = { g, txt, drawTab };

      g.on('pointerover', () => {
        if (tab.id !== this._activeTab) {
          g.clear();
          g.fillStyle(C.bgPanel, 0.7);
          g.fillRoundedRect(x - 105, tabY - 16, 210, 32, { tl: 8, tr: 8, bl: 0, br: 0 });
          g.lineStyle(1, C.borderGoldDim, 1);
          g.strokeRoundedRect(x - 105, tabY - 16, 210, 32, { tl: 8, tr: 8, bl: 0, br: 0 });
        }
      });
      g.on('pointerout', () => {
        if (tab.id !== this._activeTab) drawTab(false);
      });
      g.on('pointerup', () => {
        if (tab.id === this._activeTab) return;
        this._switchTab(tab.id, width, this.scale.height);
      });
    });
  }

  _switchTab(tabId, width, height) {
    Object.entries(this._tabObjs).forEach(([id, obj]) => {
      const active = id === tabId;
      obj.drawTab(active);
      obj.txt.setColor(
        active
          ? '#' + C.textGoldBright.toString(16).padStart(6, '0')
          : '#' + C.textSecondary.toString(16).padStart(6, '0')
      );
    });

    this._activeTab = tabId;

    if (this._contentContainer) {
      this._contentContainer.destroy(true);
      this._contentContainer = null;
    }

    if (tabId === 'stats') {
      this._showStats(width, height);
    } else {
      this._showLeaderboard(width, height);
    }
  }

  // ----------------------------------------------------------------
  // Tab: Statistiche globali
  // ----------------------------------------------------------------
  _showStats(width, height) {
    const container = this.add.container(0, 0);
    this._contentContainer = container;

    const stats = SaveManager.getStats();
    const collection = SaveManager.getCollection();

    const entries = [
      { icon: '⚔️',  label: 'Run totali',        value: stats.totalRuns },
      { icon: '🏆',  label: 'Vittorie',            value: stats.victories },
      { icon: '💀',  label: 'Sconfitte',           value: stats.defeats },
      { icon: '📊',  label: 'Tasso vittoria',      value: stats.totalRuns > 0 ? Math.round((stats.victories / stats.totalRuns) * 100) + '%' : '-' },
      { icon: '🗺️',  label: 'Piano massimo',       value: stats.highestFloor + 1 },
      { icon: '💀',  label: 'Nemici sconfitti',    value: stats.enemiesKilled },
      { icon: '💰',  label: 'Oro guadagnato',      value: stats.goldEarned },
      { icon: '🃏',  label: 'Carte scoperte',      value: `${collection.cards.length}` },
      { icon: '🔮',  label: 'Reliquie scoperte',   value: `${collection.relics.length}` },
    ];

    const startY = 115;
    const rowH   = 46;
    const panelW = 560;
    const leftX  = width / 2 - panelW / 2 + 24;
    const rightX = width / 2 + panelW / 2 - 24;

    // Pannello contenitore statistiche
    drawPanel(this, width / 2, startY + (entries.length * rowH) / 2 - rowH / 2 + 8, panelW, entries.length * rowH + 16, {
      radius: 12,
      fill: C.bgPanel,
      border: C.borderSubtle,
      borderWidth: 1,
    });

    entries.forEach((entry, i) => {
      const y = startY + i * rowH;

      // Riga alternata
      if (i % 2 === 0) {
        const rowG = this.add.graphics();
        rowG.fillStyle(0xffffff, 0.03);
        rowG.fillRect(width / 2 - panelW / 2 + 2, y - rowH / 2 + 4, panelW - 4, rowH - 2);
        container.add(rowG);
      }

      container.add(this.add.text(leftX, y, `${entry.icon}  ${entry.label}`, {
        fontFamily: FONT_UI,
        fontSize: '15px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0, 0.5));

      container.add(this.add.text(rightX, y, String(entry.value), {
        fontFamily: FONT_TITLE,
        fontSize: '17px',
        color: '#' + C.textGoldBright.toString(16).padStart(6, '0'),
        fontStyle: '700',
      }).setOrigin(1, 0.5));
    });

    // --- ULTIME RUN ---
    const historyBaseY = startY + entries.length * rowH + 36;

    drawDivider(this, width / 2, historyBaseY - 12, panelW, { color: C.borderGold, alpha: 0.3 });
    container.add(this.add.text(width / 2, historyBaseY + 4, 'ULTIME RUN', {
      fontFamily: FONT_TITLE,
      fontSize: '13px',
      color: '#' + C.textGold.toString(16).padStart(6, '0'),
      letterSpacing: 3,
    }).setOrigin(0.5));

    const history     = SaveManager.getRunHistory();
    const historyRowH = 38;
    const histStartY  = historyBaseY + 26;

    if (history.length === 0) {
      container.add(this.add.text(width / 2, histStartY + 16, 'Nessuna run completata', {
        fontFamily: FONT_BODY,
        fontSize: '13px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0.5));
    } else {
      // Pannello storico
      const lastFive = history.slice(0, 5);
      drawPanel(this, width / 2, histStartY + (lastFive.length * historyRowH) / 2 - historyRowH / 2 + 4, panelW, lastFive.length * historyRowH + 12, {
        radius: 10,
        fill: C.bgPanelDark,
        border: C.borderSubtle,
        borderWidth: 1,
      });

      lastFive.forEach((run, i) => {
        const y = histStartY + i * historyRowH;

        if (i % 2 === 0) {
          const rowG = this.add.graphics();
          rowG.fillStyle(0xffffff, 0.03);
          rowG.fillRect(width / 2 - panelW / 2 + 2, y - historyRowH / 2 + 4, panelW - 4, historyRowH - 2);
          container.add(rowG);
        }

        const classEmoji  = CLASS_EMOJIS[run.classId] || '⚔️';
        const resultEmoji = run.result === 'victory' ? '✓' : '✗';
        const resultColor = run.result === 'victory'
          ? '#' + C.poison.toString(16).padStart(6, '0')
          : '#' + C.hp.toString(16).padStart(6, '0');

        container.add(this.add.text(leftX, y, classEmoji, {
          fontFamily: FONT_UI, fontSize: '18px',
        }).setOrigin(0, 0.5));

        container.add(this.add.text(leftX + 32, y, resultEmoji, {
          fontFamily: FONT_UI, fontSize: '16px', color: resultColor, fontStyle: '700',
        }).setOrigin(0, 0.5));

        container.add(this.add.text(leftX + 68, y, `Piano ${run.floorsVisited}`, {
          fontFamily: FONT_UI, fontSize: '13px',
          color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        }).setOrigin(0, 0.5));

        container.add(this.add.text(width / 2 + 20, y, `${run.gold} 💰`, {
          fontFamily: FONT_UI, fontSize: '13px',
          color: '#' + C.textGold.toString(16).padStart(6, '0'),
        }).setOrigin(0, 0.5));

        container.add(this.add.text(rightX, y, `${run.deckSize} carte`, {
          fontFamily: FONT_UI, fontSize: '13px',
          color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
        }).setOrigin(1, 0.5));
      });
    }
  }

  // ----------------------------------------------------------------
  // Tab: Classifica locale
  // ----------------------------------------------------------------
  _showLeaderboard(width, height) {
    const container = this.add.container(0, 0);
    this._contentContainer = container;

    const leaderboard = SaveManager.getLeaderboard();
    const startY = 118;

    if (leaderboard.length === 0) {
      container.add(this.add.text(width / 2, height / 2, 'Nessuna run completata ancora', {
        fontFamily: FONT_UI,
        fontSize: '16px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(0.5));
      return;
    }

    // Intestazione colonne
    const headerY = startY + 10;
    const cols = {
      pos:    100,
      classe: 180,
      piano:  360,
      oro:    500,
      mazzo:  630,
      asc:    740,
      data:   1010,
    };

    const goldBright = '#' + C.textGoldBright.toString(16).padStart(6, '0');
    const headerStyle = { fontFamily: FONT_UI, fontSize: '11px', color: goldBright, fontStyle: '700', letterSpacing: 1 };
    container.add(this.add.text(cols.pos,    headerY, 'POS',    headerStyle).setOrigin(0.5, 0.5));
    container.add(this.add.text(cols.classe, headerY, 'CLASSE', headerStyle).setOrigin(0, 0.5));
    container.add(this.add.text(cols.piano,  headerY, 'PIANO',  headerStyle).setOrigin(0.5, 0.5));
    container.add(this.add.text(cols.oro,    headerY, 'ORO',    headerStyle).setOrigin(0.5, 0.5));
    container.add(this.add.text(cols.mazzo,  headerY, 'MAZZO',  headerStyle).setOrigin(0.5, 0.5));
    container.add(this.add.text(cols.asc,    headerY, 'ASC',    headerStyle).setOrigin(0.5, 0.5));
    container.add(this.add.text(cols.data,   headerY, 'DATA',   headerStyle).setOrigin(1, 0.5));

    drawDivider(this, width / 2, headerY + 14, width - 100, { color: C.borderSubtle, alpha: 0.8 });

    // Righe
    const rowH       = 40;
    const rowsStartY = headerY + 26;

    leaderboard.forEach((entry, i) => {
      const y = rowsStartY + i * rowH;
      const isFirst = i === 0;

      const rowG = this.add.graphics();
      if (isFirst) {
        rowG.fillStyle(0xc9a84c, 0.08);
        rowG.fillRoundedRect(width / 2 - (width - 100) / 2, y - rowH / 2 + 1, width - 100, rowH - 2, 6);
        rowG.lineStyle(1, C.borderGold, 0.5);
        rowG.strokeRoundedRect(width / 2 - (width - 100) / 2, y - rowH / 2 + 1, width - 100, rowH - 2, 6);
      } else if (i % 2 === 0) {
        rowG.fillStyle(0xffffff, 0.02);
        rowG.fillRect(width / 2 - (width - 100) / 2, y - rowH / 2 + 1, width - 100, rowH - 2);
      }
      container.add(rowG);

      const textColor  = isFirst ? goldBright : '#' + C.textPrimary.toString(16).padStart(6, '0');
      const labelStyle = (color) => ({ fontFamily: FONT_UI, fontSize: '13px', color, fontStyle: isFirst ? '700' : '400' });

      const posEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
      container.add(this.add.text(cols.pos, y, posEmoji, {
        fontFamily: FONT_UI, fontSize: isFirst ? '16px' : '13px', color: textColor, fontStyle: '700',
      }).setOrigin(0.5, 0.5));

      const classEmoji  = CLASS_EMOJIS[entry.classId] || '⚔️';
      const resultColor = entry.result === 'victory'
        ? '#' + C.poison.toString(16).padStart(6, '0')
        : '#' + C.hp.toString(16).padStart(6, '0');
      const resultMark  = entry.result === 'victory' ? '✓' : '✗';
      container.add(this.add.text(cols.classe, y, `${classEmoji} ${entry.classId || '?'}`, {
        fontFamily: FONT_UI, fontSize: '13px', color: textColor,
      }).setOrigin(0, 0.5));
      container.add(this.add.text(cols.classe + 120, y, resultMark, {
        fontFamily: FONT_UI, fontSize: '13px', color: resultColor, fontStyle: '700',
      }).setOrigin(0, 0.5));

      container.add(this.add.text(cols.piano, y, `${entry.floorsReached}`, labelStyle(textColor)).setOrigin(0.5, 0.5));
      container.add(this.add.text(cols.oro,   y, `${entry.gold}`,          labelStyle(goldBright)).setOrigin(0.5, 0.5));
      container.add(this.add.text(cols.mazzo, y, `${entry.deckSize}`,      labelStyle(textColor)).setOrigin(0.5, 0.5));
      container.add(this.add.text(cols.asc,   y, `${entry.ascensionLevel}`,labelStyle(textColor)).setOrigin(0.5, 0.5));

      const date    = new Date(entry.timestamp);
      const dateStr = `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear().toString().slice(-2)}`;
      container.add(this.add.text(cols.data, y, dateStr, {
        fontFamily: FONT_BODY, fontSize: '12px',
        color: '#' + C.textSecondary.toString(16).padStart(6, '0'),
      }).setOrigin(1, 0.5));
    });
  }

  // ----------------------------------------------------------------
  // Back button
  // ----------------------------------------------------------------
  _buildBackButton(width, height) {
    createButton(this, 100, height - 36, 160, 44, 'INDIETRO', {
      fill: C.bgPanel,
      hover: C.btnHover,
      border: C.borderGold,
      borderWidth: 2,
      radius: 8,
      fontSize: '14px',
      font: FONT_UI,
      textColor: '#' + C.textPrimary.toString(16).padStart(6, '0'),
      letterSpacing: 2,
      depth: 20,
      onClick: () => this.scene.start('MainMenu'),
    });
  }
}
