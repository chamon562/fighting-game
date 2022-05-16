// function for hit detection
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}
let timerEL = document.querySelector("#timer");
let timer = 60;
let matchResultEl = document.querySelector("#matchResult");

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  if (player.health === enemy.health) {
    matchResultEl.innerHTML = "Draw Game";
  } else if (player.health > enemy.health) {
    matchResultEl.innerHTML = "Player One Wins";
  } else if (enemy.health > player.health) {
    matchResultEl.innerHTML = "Player Two Wins";
  } else if (enemy.health === 0) {
    matchResultEl.innerHTML = "Player One Wins";
  }
}
let timerId;
function decreaseTimer() {
  // want timer to be greater than 0 because we dont want it to decrease passed zero
  // giving negative values

  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    timerEL.innerHTML = timer;
  }
  // under the if statement determine who won
  if (timer === 0) {
    matchResultEl.style.display = "flex";

    determineWinner({ player, enemy, timerId });
  }
}
