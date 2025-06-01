var TD = TD || {};
TD.storage = TD.storage || {};

TD.storage.Manager = {
  saveState: function(stateObj) {
    localStorage.setItem('towerDefenseSave', JSON.stringify(stateObj));
  },
  loadState: function() {
    var data = localStorage.getItem('towerDefenseSave');
    return data ? JSON.parse(data) : null;
  }
};
