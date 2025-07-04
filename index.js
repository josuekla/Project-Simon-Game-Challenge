let gamePattern = [];
let playerPattern = [];
let highScore = 0;
let gameRunning = false;
let canClick = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// initial of the game
$(document).on("keypress", async function (event) {
  if (event.key.toLowerCase() === "a" && !gameRunning) {
    gameRunning = true;
    gamePattern.length = 0;
    playerPattern.length = 0;
    await nextSequence();
    playerInput();
  }
});

async function nextSequence() {
  let score = gamePattern.length;
  const colors = ["green", "red", "yellow", "blue"];
  const chosen = colors[Math.floor(Math.random() * 4)];
  gamePattern.push(chosen);
  $("#level-title").text(`Level ${gamePattern.length}`);
  $("#score").text("Score: " + score);

  canClick = false;

  let speed = 500 - gamePattern.length * 30;
  for (const color of gamePattern) {
    await clickButton(color);
    await sleep(speed);
  }

  playerPattern.length = 0;
  canClick = true;
}

async function clickButton(nameColor) {
  $(`#${nameColor}`).addClass("pressed");
  const audioButton = new Audio(`./sounds/${nameColor}.mp3`);
  audioButton.play();
  audioButton.volume = 0.1;

  await sleep(50);
  $(`#${nameColor}`).removeClass("pressed");
}

async function playerInput() {
  $(".btn").each(function () {
    $(this)
      .off("click")
      .on("click", async function () {
        if (!canClick) return;

        const colorClicked = $(this).attr("id");
        playerPattern.push(colorClicked);
        await clickButton(colorClicked);

        await checkAnswer(playerPattern.length - 1);
      });
  });
}

async function checkAnswer(index) {
  let correct = playerPattern[index] === gamePattern[index];

  if (!correct) {
    return gameOver();
  }

  if (playerPattern.length === gamePattern.length) {
    if (gamePattern.length > highScore) {
      highScore = gamePattern.length;
      $("#highscore").text("High Score: " + highScore);
    }
    let score = gamePattern.length;
    $("#score").text("Score: " + score);

    canClick = false;
    let speed = 1000 - gamePattern.length * 30;
    await sleep(speed);
    await nextSequence();
  }
}

function gameOver() {
  gameRunning = false;
  canClick = false;

  $("#level-title").text(`Game Over, Press any key to play again!`);

  $("body").addClass("game-over");
  new Audio(`./sounds/wrong.mp3`).play();

  setTimeout(() => {
    $("body").removeClass("game-over");
  }, 200);
}
