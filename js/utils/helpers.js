var TD = TD || {};
TD.utils = TD.utils || {};

TD.utils.Helpers = {
  createElement: function(tag, classNames, attributes) {
    var el = document.createElement(tag);
    if (classNames) {
      classNames.split(' ').forEach(function(cls) {
        if (cls) el.classList.add(cls);
      });
    }
    if (attributes) {
      Object.keys(attributes).forEach(function(key) {
        el.setAttribute(key, attributes[key]);
      });
    }
    return el;
  },

  euclideanDistance: function(r1, c1, r2, c2) {
    var dr = r1 - r2, dc = c1 - c2;
    return Math.sqrt(dr * dr + dc * dc);
  },

  playSound: function(soundId) {
    var game = TD.app.currentGame;
    if (!game || !game.soundOn) return;
    var audioEl = document.getElementById(soundId);
    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play();
    }
  }
};
