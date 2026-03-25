export const POTIONS = {
  health:   { id: 'health',   name: 'Pozione Salute',  nameEn: 'Health Potion',    emoji: '🧴', effect: { heal: 30 },    price: 50 },
  block:    { id: 'block',    name: 'Pozione Blocco',  nameEn: 'Block Potion',     emoji: '🫙', effect: { block: 15 },   price: 45 },
  strength: { id: 'strength', name: 'Pozione Forza',   nameEn: 'Strength Potion',  emoji: '⚗️', effect: { strength: 4 }, price: 55 },
  energy:   { id: 'energy',   name: 'Pozione Energia', nameEn: 'Energy Potion',    emoji: '🔋', effect: { energy: 1 },   price: 50 },
};

export function randomPotion() {
  const keys = Object.keys(POTIONS);
  return { ...POTIONS[keys[Math.floor(Math.random() * keys.length)]] };
}
