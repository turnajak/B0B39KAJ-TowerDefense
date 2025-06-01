var TD = TD || {};
TD.utils = TD.utils || {};

TD.utils.Constants = {
  // Bacha na grid size, musi se manualne menit path
  GRID_ROWS: 10,
  GRID_COLS: 16,
  CELL_SIZE: 64,

  // Balanc, nezapomen zmenit v napovede
  STARTING_HEALTH: 20,
  STARTING_GOLD: 50,
  TOWER_COST: 20,
  TOWER_SELL_REFUND: 10,

  PATH_CELLS: [
  [0, 1], [1, 1], [2, 1], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [5, 2], [6, 2], [6, 1], [6, 0], [7, 0], [8, 0],
  [8, 1], [8, 2], [8, 3], [8, 4], [7, 4], [6, 4], [5, 4], [4, 4], [3, 4], [2, 4], [2, 3], [1, 3], [0, 3], [0, 4],
  [0, 5], [0, 6], [1, 6], [2, 6], [3, 6], [3, 7], [3, 8], [3, 9], [4, 9], [5, 9], [5, 8], [5, 7], [5, 6], [6, 6],
  [7, 6], [7, 7], [7, 8], [8, 8], [8, 9], [8, 10], [8, 11], [7, 11], [6, 11], [5, 11], [4, 11], [3, 11], [2, 11],
  [1, 11], [1, 12], [1, 13], [1, 14], [2, 14], [3, 14], [3, 13], [4, 13], [5, 13], [5, 14], [6, 14], [7, 14],
  [8, 14], [8, 15]
  ],

  ENEMY_BASE_HEALTH: 30,
  ENEMY_HEALTH_INCREMENT: 15
};
