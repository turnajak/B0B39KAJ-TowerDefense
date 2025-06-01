var TD = TD || {};
TD.app = TD.app || {};

document.addEventListener('DOMContentLoaded', function() {
  var mainMenu      = document.getElementById('main-menu');
  var startBtn      = document.getElementById('start-game-btn');
  var helpBtn       = document.getElementById('help-btn');
  var difficultyBtn = document.getElementById('difficulty-btn');
  var soundBtn      = document.getElementById('sound-btn');
  var gameContainer = document.getElementById('game-container');

  if (!mainMenu || !startBtn || !helpBtn || !difficultyBtn || !soundBtn || !gameContainer) {
    console.error("Key UI error!");
    return;
  }

  var game = new TD.app.Game();
  TD.app.currentGame = game;
  game.soundOn = true;
  var ui = new TD.ui.UIManager(game);

  var settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var nameInput = document.getElementById('player-name');
      var playerName = nameInput.value.trim();
      if (!playerName) {
        alert("Zadej jméno hráče.");
        return;
      }
      game.playerName = playerName;
      alert("Jméno hráče uloženo: " + playerName);
    });
  }

  function enterGame() {
    mainMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    game.init();
    history.pushState({ inGame: true }, "", "#game");
  }

  function returnToMenu() {
    if (!game.isGameOver) {
      window.location.reload();
      return;
    }
    gameContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  }

  startBtn.addEventListener('click', function() {
    enterGame();
  });

  helpBtn.addEventListener('click', function() {
    alert(
      "Nápověda:\n" +
      "- Pokládej věže a zastav včas nepřátele!\n" +
      "- Věže střílí automaticky na nepřátele v dosahu.\n" +
      "- Pozor! Věž se prodá pouze za polovinu ceny!\n" +
      "- S každou vlnou se zvyšuje HP nepřátel.\n" +
      "- Vlny přivoláš dřív klávesou 'F' nebo tlačítkem.\n" +
      "- Zpět tě vrátí do menu.\n" +
      "- Hru můžeš vždy uložit\n" +
      "- Good luck!\n"
    );
  });

  difficultyBtn.addEventListener('click', function() {
    var levels = TD.config.DIFFICULTY_LEVELS;
    var idx = levels.indexOf(game.difficulty);
    var nextDiff = levels[(idx + 1) % levels.length];
    game.setDifficulty(nextDiff);
    difficultyBtn.textContent = "Obtížnost: " + nextDiff;
  });

  soundBtn.addEventListener('click', function() {
    game.soundOn = !game.soundOn;
    var label = game.soundOn ? "Zapnuto" : "Vypnuto";
    soundBtn.textContent = "Zvuk: " + label;
  });

  var startWaveBtn = document.getElementById('start-wave-btn');
  if (startWaveBtn) {
    startWaveBtn.addEventListener('click', function() {
      new TD.app.WaveManager(game).start();
    });
  }

  var sellBtn = document.getElementById('sell-tower-btn');
  if (sellBtn) {
    sellBtn.addEventListener('click', function() {
      game.startSellingMode();
    });
  }

  var saveBtn = document.getElementById('save-state-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      game.saveState();
      alert("Hra uložena");
    });
  }

  var loadBtn = document.getElementById('load-state-btn');
  if (loadBtn) {
    loadBtn.addEventListener('click', function() {
      var success = game.loadState();
      if (success) alert("Hra načtena");
    });
  }

  var backBtn = document.getElementById('back-to-menu-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      if (history.state && history.state.inGame) {
        history.back();
      } else {
        returnToMenu();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (!mainMenu.classList.contains('hidden') || (e.key !== 'f' && e.key !== 'F')) return;
    new TD.app.WaveManager(game).start();
  });

  window.addEventListener('popstate', function(event) {
    if (!event.state || !event.state.inGame) {
      returnToMenu();
    }
  });
});
