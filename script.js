(function () {
  "use strict";

  const startGame = document.querySelector("#startgame");
  const game = document.querySelector("#game");
  const actions = document.querySelector("#actions");
  const score = document.querySelector("#score");
  const control = document.querySelector("#gamecontrol");
  const playerNum = document.querySelector("#playerNum");
  const playerDiv = document.querySelector("#playerform");
  const playerSubmit = document.querySelector("#playersubmit");
  const playerNumForm = document.querySelector("#playerNum-form");
  const pointsForm = document.querySelector("#points-form");

  const gameData = {
    diceImage: ["images/dice1.png", "images/dice2.png", "images/dice3.png", "images/dice4.png", "images/dice5.png", "images/dice6.png"],
    players: [],
    score: [],
    dice: [0, 0],
    diceTotal: 0,
    turnTotal: 0,
    index: 0,
    turn: 1,
    gameEnd: [],
  };

  // Click event on startBtn to change player names, h2 and btn text

  playerSubmit.addEventListener("click", function () {
    for (var i = 1; i <= playerNum.value; i++) {
      gameData.players.push(i);
      playerNumForm.innerHTML = "";
      playerDiv.innerHTML += `<form>Enter Player ${i} name: <input type="text" id="player" />`;
      gameData.score.push(0);

      pointsForm.innerHTML = `<h2>How many points for a win?</h2>
      <p class="note">(Note: the default number of points for a win is 100)</p>
      <form><input type="number" id="points" /></form>`

      startGame.style.display = "inline";
    }
  });

  startGame.addEventListener("click", function () {
    players();
    gameEnd();

    gameData.index = 0;
    control.innerHTML = `
    <h2 id="h2-title">The game has started</h2>
    <button id="quit">Wanna quit?</button>`;

    // Click event to reload page on quit button

    const quitBtn = document.querySelector("#quit");

    quitBtn.addEventListener("click", function () {
      location.reload();
    });
    setUpTurn();
  });

  // Player names function

  function players() {
    const player = document.querySelectorAll("#player");
    for (var i = 0; i < gameData.players.length; i++) {
      gameData.players[i] = player[i].value;
      if (player[i].value === "") {
        gameData.players[i] = `Player ${i + 1}`;
      }
    }
  }

  // Game end function

  function gameEnd() {
    gameData.gameEnd = document.querySelector("#points").value;
    if (gameData.gameEnd === "") {
      gameData.gameEnd = 100;
    }
  }

  // Set up turn function

  function setUpTurn() {
    game.innerHTML = `<p id="roll-paragraph">Rolling the dice for ${gameData.players[gameData.index]}</p>`;
    actions.innerHTML = `<button id="roll">Roll the Dice</button>`;
    const rollBtn = document.querySelector("#roll");
    rollBtn.addEventListener("click", function () {
      gameData.turnTotal = 0;
      throwDice();
    });
  }

  // Throw dice function

  function throwDice() {
    actions.innerHTML = "";
    let dice1 = gameData.dice[0] = Math.floor(Math.random() * 6 + 1);
    let dice2 = gameData.dice[1] = Math.floor(Math.random() * 6 + 1);

    game.innerHTML = `
    <p id="roll-paragraph">Rolling the dice for ${gameData.players[gameData.index]}</p>
    <img src="" id="image1" />
    <img src="" id="image2" />`;

    document.querySelector("#image1").src = gameData.diceImage[dice1 - 1];
    document.querySelector("#image2").src = gameData.diceImage[dice2 - 1];

    gameData.dice[0] = 0;
    gameData.dice[1] = 0;

    if (gameData.turn > 1) {
      let counter = 0;
      for(var i = 2; i < gameData.dice.length; i++) {
        gameData.dice[i] = Math.floor(Math.random() * 6 + 1);
        counter += gameData.dice[i];
        gameData.diceTotal = dice1 + dice2 + counter;
          game.innerHTML += `
            <img src="" id="image${[i + 1]}" />`;
          document.querySelector(`#image${[i + 1]}`).src = gameData.diceImage[gameData.dice[i] - 1]; 
          gameData.dice[i] = 0;
      }
    }
    else {
      gameData.diceTotal = dice1 + dice2;
    }
    gameData.turnTotal += gameData.diceTotal;

    if (gameData.diceTotal === 2) {
      game.innerHTML += "<p>Snakes eyes! 🎲🎲 Your score is now zeroed out</p>";
      gameData.score[gameData.index] = 0;
      gameData.index++;
      if (gameData.index == gameData.players.length) {
        gameData.index = 0;
        gameData.turn++;
        gameData.dice.push(0);
      }
      if (gameData.dice.length === 6) {
        gameData.dice.pop();
      }
      currentScore();
      setTimeout(setUpTurn, 2000);
    } else if (dice1 === 1 || dice2 === 1) {
        currentScoreMinusTotalTurn();
        gameData.index++;
        if (gameData.index == gameData.players.length) {
          currentScoreMinusTotalTurn();
          gameData.index = 0;
          gameData.turn++;
          gameData.dice.push(0);
        }
        if (gameData.dice.length === 6) {
          gameData.dice.pop();
        }
      game.innerHTML += "<p>You rolled a 1, you get no points for this turn and your turn is over!</p>";
      setTimeout(setUpTurn, 2000);
    } else {
      gameData.score[gameData.index] = gameData.score[gameData.index] + gameData.diceTotal;
      actions.innerHTML = `<button id="rollagain">Roll again</button> or <button id="pass">Pass</button>`;
      document.querySelector("#rollagain").addEventListener("click", function () {
        throwDice();
      });
    document.querySelector("#pass").addEventListener("click", function () {
      if (gameData.index == gameData.players.length - 1) {
            gameData.index = 0;
            gameData.turn++;
            gameData.dice.push(0);
          } 
          else {
            gameData.index++;
          }
          if (gameData.dice.length === 6) {
            gameData.dice.pop();
          }
        setUpTurn();
      });
      checkWinningCondition();
    }
  }

  // Winning condition

  function checkWinningCondition() {
    if (gameData.score[gameData.index] >= gameData.gameEnd) {
      score.innerHTML = `<h2>${gameData.players[gameData.index]} has won with ${gameData.score[gameData.index]} points! Congratulations! 🎉 </h2>`;
      actions.innerHTML = "";
      document.querySelector("#roll-paragraph").innerHTML = "";
      document.querySelector("#quit").innerHTML = "Start a New Game?";
      document.querySelector("#h2-title").innerHTML = "The game has ended";
    } else {
      currentScore();
    }
  }

  function currentScore() {
    score.innerHTML = `The current score is: <br>`;
    for (var i = 0; i < gameData.players.length; i++) {
      score.innerHTML += `${gameData.players[i]}: ${gameData.score[i]} points<br>`;
    }
  }

  function currentScoreMinusTotalTurn() {
    gameData.score[gameData.index] = gameData.score[gameData.index] - gameData.turnTotal + gameData.diceTotal;
    score.innerHTML = `The current score is: <br>`;
    for (var i = 0; i < gameData.players.length; i++) {
      score.innerHTML += `${gameData.players[i]}: ${gameData.score[i]} points<br>`;
    }
  }
})();
