var TD = TD || {};
TD.ui = TD.ui || {};

function _isValidPlacementCell(cellEl) {
  if (!cellEl || !cellEl.classList.contains("cell")) return false;
  var row = parseInt(cellEl.getAttribute("data-row"), 10);
  var col = parseInt(cellEl.getAttribute("data-col"), 10);
  var game = TD.app.currentGame;
  if (game.isPathCell(row, col)) return false;
  if (cellEl.classList.contains("tower")) return false;
  return true;
}

function _clearAllValidDrop() {
  document.querySelectorAll(".cell.valid-drop").forEach(function(c) {
    c.classList.remove("valid-drop");
  });
}

document.addEventListener("DOMContentLoaded", function() {
  var towerIcon = document.querySelector(".tower-icon");
  if (towerIcon) {
    towerIcon.addEventListener("dragstart", function(e) {
      e.dataTransfer.setData("towerType", e.target.getAttribute("data-tower-type"));
      e.dataTransfer.effectAllowed = "copy";
    });
  }

  var gameArea = document.getElementById("game-area");
  gameArea.addEventListener("dragover", function(e) {
    e.preventDefault();
    var cellEl = e.target.closest(".cell");
    _clearAllValidDrop();
    if (_isValidPlacementCell(cellEl)) {
      cellEl.classList.add("valid-drop");
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  });

  gameArea.addEventListener("dragleave", function(e) {
    var cellEl = e.target.closest(".cell");
    if (cellEl) {
      cellEl.classList.remove("valid-drop");
    }
  });

  gameArea.addEventListener("drop", function(e) {
    e.preventDefault();
    _clearAllValidDrop();
    var cellEl = e.target.closest(".cell");
    if (!cellEl) return;

    var row = parseInt(cellEl.getAttribute("data-row"), 10);
    var col = parseInt(cellEl.getAttribute("data-col"), 10);
    var game = TD.app.currentGame;
    var placed = game.placeTower(row, col);

    if (!placed) {
      cellEl.classList.add("invalid-drop");
      setTimeout(function() {
        cellEl.classList.remove("invalid-drop");
      }, 600);
    }
  });
});
