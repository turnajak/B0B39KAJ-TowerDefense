var TD = TD || {};
TD.app = TD.app || {};

TD.app.Game = function() {
  this.health = TD.utils.Constants.STARTING_HEALTH;
  this.gold = TD.utils.Constants.STARTING_GOLD;
  this.currentWave = 0;
  this.difficulty = TD.config.DEFAULT_DIFFICULTY;

  this.towers = [];
  this.enemies = [];
  this.pathCells = TD.utils.Constants.PATH_CELLS.map(function(c) {
    return { row: c[0], col: c[1] };
  });

  this.enemiesToSpawn = 0;
  this.spawnTimer = null;
  this.moveTimer = null;
  this.pauseBetweenWaves = 3000;
  this.isGameOver = false;
  this.ui = null;
};

TD.app.Game.prototype.init = function() {
  if (!this.ui) return;
  this.ui.updateHealth(this.health);
  this.ui.updateGold(this.gold);
  this.ui.updateWave(this.currentWave);

  this.ui.drawGrid();
  this.ui.highlightPath(this.pathCells);

  this.towers.forEach(function(tower) {
    tower.startShooting(this);
  }, this);
};

TD.app.Game.prototype.isPathCell = function(row, col) {
  return this.pathCells.some(function(c) {
    return c.row === row && c.col === col;
  });
};

TD.app.Game.prototype.placeTower = function(row, col) {
  if (this.isPathCell(row, col)) return false;
  var occupied = this.towers.some(function(t) {
    return t.row === row && t.col === col;
  });
  if (occupied || this.gold < TD.utils.Constants.TOWER_COST) {
    return false;
  }
  this.gold -= TD.utils.Constants.TOWER_COST;
  this.ui.updateGold(this.gold);

  var tower = new TD.app.Tower(row, col);
  this.towers.push(tower);
  this.ui.showTower(row, col);
  tower.startShooting(this);
  return true;
};

TD.app.Game.prototype.sellTower = function(row, col) {
  for (var i = 0; i < this.towers.length; i++) {
    var t = this.towers[i];
    if (t.row === row && t.col === col) {
      t.stopShooting();
      this.towers.splice(i, 1);
      this.gold += TD.utils.Constants.TOWER_SELL_REFUND;
      this.ui.updateGold(this.gold);
      this.ui.removeTower(row, col);
      return true;
    }
  }
  return false;
};

TD.app.Game.prototype.startPlacingMode = function() {
  this.isPlacingMode = true;
  this.isSellingMode = false;
  this.ui.enterPlacingMode();
};

TD.app.Game.prototype.startSellingMode = function() {
  this.isSellingMode = true;
  this.isPlacingMode = false;
  this.ui.enterSellingMode();
};

TD.app.Game.prototype.exitActionModes = function() {
  this.isPlacingMode = false;
  this.isSellingMode = false;
  this.ui.exitActionMode();
};

TD.app.Game.prototype.setDifficulty = function(newDifficulty) {
  if (TD.config.DIFFICULTY_LEVELS.indexOf(newDifficulty) !== -1) {
    this.difficulty = newDifficulty;
  }
};

TD.app.Game.prototype.startNextWave = function() {
  if (this.isGameOver) return;

  this.currentWave += 1;
  this.ui.updateWave(this.currentWave);

  var baseCount = 5 + (this.currentWave - 1) * 2;
  var multiplier = TD.config.DIFFICULTY_MULTIPLIER[this.difficulty] || 1.0;
  this.enemiesToSpawn = Math.ceil(baseCount * multiplier);

  var healthPerEnemy =
    TD.utils.Constants.ENEMY_BASE_HEALTH +
    (this.currentWave - 1) * TD.utils.Constants.ENEMY_HEALTH_INCREMENT;

  clearInterval(this.spawnTimer);
  clearInterval(this.moveTimer);

  var self = this;
  this.spawnTimer = setInterval(function() {
    if (self.enemiesToSpawn <= 0) {
      clearInterval(self.spawnTimer);
      return;
    }
    var enemy = new TD.app.Enemy(self.pathCells, healthPerEnemy);
    self.enemies.push(enemy);
    self.ui.showEnemy(enemy.row, enemy.col);
    self.enemiesToSpawn -= 1;
  }, 1000);

  this.moveTimer = setInterval(function() {
    self.enemies.slice().forEach(function(enemy) {
      self.ui.removeEnemy(enemy.row, enemy.col);
      var reachedEnd = enemy.advance();
      if (reachedEnd) {
        self._onEnemyReachEnd(enemy);
      } else if (!enemy.isRemoved) {
        self.ui.showEnemy(enemy.row, enemy.col);
      }
    });
    self.enemies = self.enemies.filter(function(e) {
      return !e.isRemoved;
    });

    if (self.enemiesToSpawn === 0 && self.enemies.length === 0) {
      clearInterval(self.moveTimer);
      setTimeout(function() {
        self.startNextWave();
      }, self.pauseBetweenWaves);
    }
  }, 500);
};

TD.app.Game.prototype._onEnemyReachEnd = function(enemy) {
  enemy.isRemoved = true;
  this.health -= 1;
  this.ui.updateHealth(this.health);
  TD.utils.Helpers.playSound('sound-enemy-reach-end');
  if (this.health <= 0) {
    this._gameOver();
  }
};

TD.app.Game.prototype._gameOver = function() {
  this.isGameOver = true;
  clearInterval(this.spawnTimer);
  clearInterval(this.moveTimer);
  this.towers.forEach(function(tower) {
    tower.stopShooting();
  });
  alert("GAME OVER!");
  window.location.reload();
};

TD.app.Game.prototype.saveState = function() {
  var stateObj = {
    health: this.health,
    gold: this.gold,
    currentWave: this.currentWave,
    towers: this.towers.map(function(t) {
      return { row: t.row, col: t.col };
    }),
    difficulty: this.difficulty
  };
  TD.storage.Manager.saveState(stateObj);
};

TD.app.Game.prototype.loadState = function() {
  var data = TD.storage.Manager.loadState();
  if (!data) {
    alert("Nebyla nalezena ulozena hra!");
    return false;
  }

  clearInterval(this.spawnTimer);
  clearInterval(this.moveTimer);
  this.towers.forEach(function(t) {
    t.stopShooting();
  });
  this.towers = [];
  this.enemies = [];

  this.ui.drawGrid();
  this.ui.highlightPath(this.pathCells);

  this.health = data.health;
  this.gold = data.gold;
  this.currentWave = data.currentWave;
  this.difficulty = data.difficulty || this.difficulty;

  this.ui.updateHealth(this.health);
  this.ui.updateGold(this.gold);
  this.ui.updateWave(this.currentWave);

  var self = this;
  data.towers.forEach(function(tdata) {
    var tower = new TD.app.Tower(tdata.row, tdata.col);
    self.towers.push(tower);
    self.ui.showTower(tdata.row, tdata.col);
    tower.startShooting(self);
  });

  return true;
};
