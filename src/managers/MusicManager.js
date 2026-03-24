/**
 * MusicManager — Gestisce la musica di sottofondo in modo globale.
 * La musica non si interrompe tra una scena e l'altra.
 */
export const MusicManager = {
  /**
   * Avvia la musica se non è già in riproduzione.
   * @param {Phaser.Scene} scene - La scena corrente
   * @param {number} volume - Volume (default 0.25)
   */
  start(scene, volume = 0.25) {
    try {
      if (!scene.cache.audio.exists('bg-music')) return;
      const already = scene.sound.sounds.find(s => s.key === 'bg-music');
      if (already && already.isPlaying) return;
      scene.sound.play('bg-music', { loop: true, volume });
    } catch (e) { /* graceful fallback */ }
  },

  /**
   * Cambia il volume della musica in corso.
   */
  setVolume(scene, volume) {
    try {
      const track = scene.sound.sounds.find(s => s.key === 'bg-music');
      if (track) track.setVolume(volume);
    } catch (e) {}
  },

  /**
   * Ferma la musica (es. su schermata game over).
   */
  stop(scene) {
    try {
      const track = scene.sound.sounds.find(s => s.key === 'bg-music');
      if (track) track.stop();
    } catch (e) {}
  }
};
