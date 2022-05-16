const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// 16:9
canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.8;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background/backgroundFull.png",
});

const shop = new Sprite({
  position: {
    x: 620,
    y: 128,
  },
  imageSrc: "./assets/decorations/shop_anim.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samuraiTwo/Idle.png",
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiTwo/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samuraiTwo/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiTwo/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiTwo/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiTwo/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samuraiTwo/TakeHitBlinker.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/samuraiTwo/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/samuraiOne/Idle.png",
  scale: 2.5,
  framesMax: 4,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiOne/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/samuraiOne/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiOne/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiOne/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiOne/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/samuraiOne/TakeHit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/samuraiOne/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};
// console.log(keys);

decreaseTimer();
function animate() {
  window.requestAnimationFrame(animate);
  //   black background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // background imagea
  background.update();

  shop.update();
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  // //   player.velocity.y = 0;
  enemy.velocity.x = 0;
  // playermovement
  // animates the player to stand idle when letting go of d
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprites("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprites("run");
  } else {
    // else if were not moving on the x axis then show the character idle
    player.switchSprites("idle");
  }

  // JUMP
  // if the player.velocity.y is less than 0 bcause going up is negative number
  // then show the jump animation
  if (player.velocity.y < 0) {
    // right now this code runs for all the other sprites so we want to abstract and
    // add a new method called switchSprites in the Fighter class
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprites("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }

  if (enemy.velocity.y < 0) {
    // right now this code runs for all the other sprites so we want to abstract and
    // add a new method called switchSprites in the Fighter class
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }
  // DETECT COLLSION & enemy gets hit
  // Detect for collision is done inside the animation loop
  // if the right side of our attack box greater than or equal the left side of the enemy
  // getting right side of attackBox
  // && get the left side of the attackBox
  // player.attackBox.y is top of position and to get the bottom add on
  // adding another condition for when attacking to only take health on the 4th frame of the swing animation
  // player.framesCurrent the current frame were on we only want to subtract player health if this hits the enemy
  // with player.framesCurrent  === 4
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    // to have the hit count only once
    enemy.takeHit();
    player.isAttacking = false;
    // whenever hitting enemy select the enemy.health
    // document.querySelector("#enemyHP").style.width = enemy.health + "%";
    gsap.to("#enemyHP", {
      // animate the width
      width: enemy.health + "%",
    });
  }
  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // enemy attack to register on 2nd frame which shows the swing it being index 1
  // this is where our player gets hit
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 1
  ) {
    // to have the hit count only once
    player.takeHit();
    enemy.isAttacking = false;
    // document.querySelector("#playerHP").style.width = player.health + "%";
    // console.log("enemy attack successful");
    // gsap gives a decline animation when getting hit
    gsap.to("#playerHP", {
      // animate the width
      width: player.health + "%",
    });
  }
  // if enemy misses make it so the attack when finished when runing into the player
  // doesnt count as a hit and only count on their 2nd frame
  if (enemy.isAttacking && enemy.framesCurrent === 1) {
    enemy.isAttacking = false;
  }

  // end the game based off health
  if (enemy.health <= 0 || player.health <= 0) {
    matchResultEl.style.display = "flex";
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", ({ key }) => {
  if (!player.dead) {
    // console.log(key);
    // player keys
    if (key === "w") {
      player.velocity.y = -20;
    }
    if (key === "a") {
      keys.a.pressed = true;
      player.lastKey = "a";
    }
    if (key === "d") {
      keys.d.pressed = true;
      player.lastKey = "d";
    }

    if (key === " ") {
      player.attack();
      // player.switchSprites("attack1")
    }
  }

  if (!enemy.dead) {
    // enemy keys
    if (key === "ArrowUp") {
      enemy.velocity.y = -20;
    }
    if (key === "ArrowLeft") {
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
    }
    if (key === "ArrowRight") {
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
    }
    if (key === "ArrowDown") {
      enemy.attack();
    }
  }
});

window.addEventListener("keyup", ({ key }) => {
  if (key === "a") keys.a.pressed = false;
  if (key === "d") keys.d.pressed = false;

  // enemy keys
  if (key === "ArrowLeft") keys.ArrowLeft.pressed = false;
  if (key === "ArrowRight") keys.ArrowRight.pressed = false;
});
