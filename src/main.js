import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { ClassSelectionScene } from './scenes/ClassSelectionScene.js';
import { MapScene } from './scenes/MapScene.js';
import { CombatScene } from './scenes/CombatScene.js';
import { RewardScene } from './scenes/RewardScene.js';
import { StatsScene } from './scenes/StatsScene.js';
import { GlossaryScene } from './scenes/GlossaryScene.js';
import { PerkScene } from './scenes/PerkScene.js';
import { ChallengeScene } from './scenes/ChallengeScene.js';
import { EndRunScene } from './scenes/EndRunScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: document.body,
  backgroundColor: '#151519',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  // L'ordine delle scene: Boot carica gli asset, poi MainMenu, Map, Combat
  scene: [BootScene, MainMenuScene, ClassSelectionScene, MapScene, CombatScene, RewardScene, StatsScene, GlossaryScene, PerkScene, ChallengeScene, EndRunScene, SettingsScene]
};

const game = new Phaser.Game(config);
