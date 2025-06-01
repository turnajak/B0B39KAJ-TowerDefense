var TD = TD || {};
TD.app = TD.app || {};

TD.app.Tower = function(row, col) {
  this.row = row;
  this.col = col;
  // TODO - dej do constants?
  this.radius = 2;
  this.damage = 20;
  this.fireRate = 1000;
  this._shootInterval = null;
};

TD.app.Tower.prototype.isInRange = function(enemyRow, enemyCol) {
  var dist = TD.utils.Helpers.euclideanDistance(this.row, this.col, enemyRow, enemyCol);
  return dist <= this.radius;
};

TD.app.Tower.prototype.startShooting = function(game) {
  var self = this;
  if (this._shootInterval) return;

  this._shootInterval = setInterval(function() {
    if (game.isGameOver) {
      clearInterval(self._shootInterval);
      self._shootInterval = null;
      return;
    }

    var inRange = game.enemies.filter(function(enemy) {
      return self.isInRange(enemy.row, enemy.col);
    });
    if (!inRange.length) return;

    var target = inRange.reduce(function(acc, enemy) {
      var ad = TD.utils.Helpers.euclideanDistance(self.row, self.col, acc.row, acc.col);
      var ed = TD.utils.Helpers.euclideanDistance(self.row, self.col, enemy.row, enemy.col);
      return ed < ad ? enemy : acc;
    });

    TD.utils.Helpers.playSound('sound-shoot');
    game.ui.drawProjectile(self.row, self.col, target.row, target.col);

    target.health -= self.damage;
    if (target.health <= 0) {
      target.isRemoved = true;
      game.ui.removeEnemy(target.row, target.col);
      TD.utils.Helpers.playSound('sound-enemy-death');
      game.gold += 5;
      game.ui.updateGold(game.gold);
    }
  }, this.fireRate);
};

TD.app.Tower.prototype.stopShooting = function() {
  if (this._shootInterval) {
    clearInterval(this._shootInterval);
    this._shootInterval = null;
  }
};
