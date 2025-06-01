var TD = TD || {};
TD.app = TD.app || {};

// Spousti next wave
TD.app.WaveManager = function(game) {
  this.game = game;
};

TD.app.WaveManager.prototype.start = function() {
  this.game.startNextWave();
};
