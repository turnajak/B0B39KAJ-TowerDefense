var TD = TD || {};
TD.ui = TD.ui || {};

TD.ui.UIManager = function(game) {
  this.game = game;
  this.game.ui = this;

  this.gameArea = document.getElementById('game-area');
  this.healthCountEl = document.getElementById('health-count');
  this.goldCountEl = document.getElementById('gold-count');
  this.waveCountEl = document.getElementById('wave-count');

  this.rows = TD.utils.Constants.GRID_ROWS;
  this.cols = TD.utils.Constants.GRID_COLS;
  this.cellSize = TD.utils.Constants.CELL_SIZE;

  this.gameArea.style.setProperty('--grid-rows', this.rows);
  this.gameArea.style.setProperty('--grid-cols', this.cols);
  this.gameArea.style.setProperty('--cell-size', this.cellSize + 'px');
  this.gameArea.style.position = 'relative';

  this.cells = [];
};

TD.ui.UIManager.prototype.drawGrid = function() {
  this.gameArea.innerHTML = '';
  this.cells = [];
  for (var r = 0; r < this.rows; r++) {
    this.cells[r] = [];
    for (var c = 0; c < this.cols; c++) {
      var cellEl = TD.utils.Helpers.createElement('div', 'cell', {
        'data-row': r,
        'data-col': c
      });
      this.gameArea.appendChild(cellEl);
      this.cells[r][c] = cellEl;
      this._attachCellClickHandler(cellEl, r, c);
    }
  }
};

TD.ui.UIManager.prototype.highlightPath = function(pathCells) {
  pathCells.forEach(function(c) {
    var cellEl = this.cells[c.row][c.col];
    if (cellEl) {
      cellEl.classList.add('path');
    }
  }, this);
};

TD.ui.UIManager.prototype.showTower = function(row, col) {
  var cellEl = this.cells[row][col];
  if (!cellEl) return;

  cellEl.innerHTML = '';
  cellEl.insertAdjacentHTML('beforeend', `
    <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="48" height="48" fill="blue" stroke="black" stroke-width="4"/>
      <path d="M32 16 L42 32 L32 28 L22 32 Z" fill="black"/>
    </svg>
  `);
  cellEl.classList.add('tower');
};

TD.ui.UIManager.prototype.removeTower = function(row, col) {
  var cellEl = this.cells[row][col];
  if (!cellEl) return;
  cellEl.textContent = '';
  cellEl.classList.remove('tower');
};

TD.ui.UIManager.prototype.showEnemy = function(row, col) {
  var cellEl = this.cells[row][col];
  if (!cellEl) return;

  cellEl.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" fill="purple" stroke="black" stroke-width="4"/>
      <circle cx="24" cy="24" r="4" fill="white"/>
      <circle cx="40" cy="24" r="4" fill="white"/>
      <path d="M24 44 Q32 36 40 44" stroke="white" stroke-width="4" fill="none"/>
    </svg>
  `;
  cellEl.classList.add('enemy');
};

TD.ui.UIManager.prototype.removeEnemy = function(row, col) {
  var cellEl = this.cells[row][col];
  if (!cellEl) return;
  cellEl.textContent = '';
  cellEl.classList.remove('enemy');
};

TD.ui.UIManager.prototype.drawProjectile = function(startRow, startCol, targetRow, targetCol) {
  var startX = startCol * this.cellSize + this.cellSize / 2;
  var startY = startRow * this.cellSize + this.cellSize / 2;
  var targetX = targetCol * this.cellSize + this.cellSize / 2;
  var targetY = targetRow * this.cellSize + this.cellSize / 2;

  var dx = targetX - startX, dy = targetY - startY;
  var length = Math.sqrt(dx * dx + dy * dy);

  var lineEl = document.createElement('div');
  lineEl.classList.add('projectile-line');
  lineEl.style.position = 'absolute';
  lineEl.style.left = startX + 'px';
  lineEl.style.top  = (startY - 1.5) + 'px';
  lineEl.style.width = length + 'px';
  lineEl.style.height = '3px';
  lineEl.style.backgroundColor = 'yellow';
  lineEl.style.transformOrigin = '0 50%';
  var angleRad = Math.atan2(dy, dx);
  lineEl.style.transform = 'rotate(' + angleRad + 'rad)';
  lineEl.style.zIndex = '100';

  this.gameArea.appendChild(lineEl);
  setTimeout(function() {
    if (lineEl.parentElement) {
      lineEl.parentElement.removeChild(lineEl);
    }
  }, 200);
};

TD.ui.UIManager.prototype.updateHealth = function(value) {
  this.healthCountEl.textContent = value;
};

TD.ui.UIManager.prototype.updateGold = function(value) {
  this.goldCountEl.textContent = value;
};

TD.ui.UIManager.prototype.updateWave = function(value) {
  this.waveCountEl.textContent = value;
};

TD.ui.UIManager.prototype.enterPlacingMode = function() {
  this.exitActionMode();
  this.gameArea.classList.add('placing');
  for (var r = 0; r < this.rows; r++) {
    for (var c = 0; c < this.cols; c++) {
      var cellEl = this.cells[r][c];
      if (!cellEl.classList.contains('path') && !cellEl.classList.contains('tower')) {
        cellEl.classList.add('valid-placement');
      }
    }
  }
};

TD.ui.UIManager.prototype.enterSellingMode = function() {
  this.exitActionMode();
  this.gameArea.classList.add('selling');
  for (var r = 0; r < this.rows; r++) {
    for (var c = 0; c < this.cols; c++) {
      var cellEl = this.cells[r][c];
      if (cellEl.classList.contains('tower')) {
        cellEl.classList.add('can-sell');
      }
    }
  }
};

TD.ui.UIManager.prototype.exitActionMode = function() {
  this.gameArea.classList.remove('placing');
  this.gameArea.classList.remove('selling');
  for (var r = 0; r < this.rows; r++) {
    for (var c = 0; c < this.cols; c++) {
      var cellEl = this.cells[r][c];
      cellEl.classList.remove('valid-placement');
      cellEl.classList.remove('can-sell');
    }
  }
};

TD.ui.UIManager.prototype._attachCellClickHandler = function(cellEl, row, col) {
  var self = this;
  cellEl.addEventListener('click', function() {
    if (self.game.isPlacingMode) {
      var placed = self.game.placeTower(row, col);
      if (placed) self.game.exitActionModes();
    } else if (self.game.isSellingMode) {
      var sold = self.game.sellTower(row, col);
      if (sold) self.game.exitActionModes();
    }
  });
};
