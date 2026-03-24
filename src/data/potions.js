export const POTIONS = {
  health:   { id: 'health',   name: 'Pozione Salute',  emoji: '🧴', effect: { heal: 30 },    price: 50 },
  block:    { id: 'block',    name: 'Pozione Blocco',  emoji: '🫙', effect: { block: 15 },   price: 45 },
  strength: { id: 'strength', name: 'Pozione Forza',   emoji: '⚗️', effect: { strength: 4 }, price: 55 },
  energy:   { id: 'energy',   name: 'Pozione Energia', emoji: '🔋', effect: { energy: 1 },   price: 50 },
};

export function randomPotion() {
  const keys = Object.keys(POTIONS);
  return { ...POTIONS[keys[Math.floor(Math.random() * keys.length)]] };
}
