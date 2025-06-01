var TD = TD || {};
TD.app = TD.app || {};

TD.app.Enemy = function(pathCells, health) {
  this.pathCells = pathCells;
  this.pathIndex = 0;
  this.row = pathCells[0].row;
  this.col = pathCells[0].col;
  this.health = health || TD.utils.Constants.ENEMY_BASE_HEALTH;
  this.maxHealth = this.health;
  this.isRemoved = false;
};

TD.app.Enemy.prototype.advance = function() {
  this.pathIndex += 1;
  if (this.pathIndex >= this.pathCells.length) {
    return true;
  }
  this.row = this.pathCells[this.pathIndex].row;
  this.col = this.pathCells[this.pathIndex].col;
  return false;
};
