# Ironveil

A dark fantasy roguelike deckbuilder built with Phaser 3 and vanilla JavaScript. Playable directly in the browser.

**[Play on itch.io →](https://angeloalmanza.itch.io/ironveil)**

---

## Gameplay

Build a deck of cards, collect relics, and fight your way through 15 floors of increasingly dangerous enemies. Every run is different — choose your class, adapt your strategy, and face the boss.

- **3 playable classes** — Warrior, Rogue, Alchemist (unlock through victories)
- **Card-based combat** — attack, defend, and use skills with an energy system
- **Relics** — 39 passive items that synergize with your playstyle
- **Map exploration** — combat, elite, boss, event, shop, rest, and forge nodes
- **Meta-progression** — permanent ability tree (Perks) and Ascension system
- **Daily Challenge** — a new seeded run every day
- **Endless mode** — keep going after defeating the final boss

---

## Tech Stack

| | |
|---|---|
| **Game Engine** | [Phaser 3](https://phaser.io/) |
| **Language** | JavaScript ES6+ |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Audio** | Web Audio API + MP3 |
| **Persistence** | localStorage |
| **Fonts** | Google Fonts (Cinzel, Rajdhani, Inter) |
| **Hosting** | itch.io |

No backend. No database. No framework. Fully client-side.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Dev server runs at `http://localhost:5174`

---

## Project Structure

```
src/
├── scenes/          # Phaser scenes (MainMenu, Map, Combat, Reward, ...)
├── managers/        # Game logic (SaveManager, DeckManager, RelicManager, ...)
├── entities/        # Player and Enemy classes
├── data/            # Cards, relics, enemies, classes, potions definitions
└── ui/              # Theme, CardSprite, reusable UI components

public/
└── assets/
    ├── backgrounds/ # Dungeon scene backgrounds
    ├── cards/       # Card artwork (layered PNG)
    ├── enemies/     # Pixel art enemy portraits
    ├── icons/       # HUD and node icons
    ├── relics/      # Relic item icons
    ├── potions/     # Potion icons
    └── sounds/      # Music and SFX
```

---

## Content

- 81 cards across 4 types (Attack, Defend, Skill, Curse)
- 39 relics
- 21 enemies including 6 multi-phase bosses
- 3 playable classes with unique starter decks and relics
- 15-floor procedurally generated maps

---

## Features

- IT / EN localization
- Keyboard shortcuts (Space = end turn, ESC = pause)
- Pause menu with quit run option on all scenes
- Fullscreen support
- Procedural music and SFX via Web Audio API

---

## Assets

- Dungeon backgrounds, card frames, icons — various packs from [itch.io](https://itch.io/game-assets)
- Enemy portraits — [30 Free Pixel Art Monster Portrait Icons](https://itch.io)
- Item icons — SODA item icon set

---

## License

Code: MIT
Assets: respective original authors
