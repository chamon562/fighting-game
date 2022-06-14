class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    // this will change the image size
    this.scale = scale;
    this.framesMax = framesMax;
    // making a variable for the max amount of frames with our image.
    // so it doesnt mess up each different image
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }
  draw() {
    
    ctx.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
    // make the smoke go faster when enemy or player health is less than 30 health pointsd
    // if (player.health < .30 || enemy.health < .30) {
    //   if (this.frameCurrent < this.framesMax - 1) {
    //     this.framesHold = 3;
    //     this.frameCurrent++;
    //   } else {
    //     this.frameCurrent = 0;
    //   }
    // }
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}
// by using extends Sprite were going to get all the methods within the Sprite class
// and put them within the fighter class if theyre not available
// if theyre available within our fighter class then our methods are going to overwrite
// the same ones that are within Sprite, so we need to determine what we want overwritten
// and what we want to keep directly from sprite
class Fighter extends Sprite {
  // constructor is fired whenever creating a new object
  // from the Sprite class
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    // this will contain all the sprites for our specfic fighter
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    // once adding in the other properties from Sprite we can call a function called super()
    // super simply calls the contructor of the parent, and the parent of Fighter is Sprite,
    // its going to call the Sprite constructor which sets the properties for us
    // but we have to declare what properties we want set, within that parent contructor
    // and to set the properties we open an object and choose which properties to set
    // going to call position and inherit from the parent Sprite

    // define properties associated with a sprite
    this.velocity = velocity;
    // this.position = position;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    // when having a shadow copy the position.x is no longer directly linked to this.position
    // need to make sure that attackBox position updates manuely based off position of the parent
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    // slow down the animation frame
    // framesElapsed is how many frames we currently elapsed over throughout
    // our whole animation, this is going to increase over time as our game
    // continues to run. how many frames should we actualy go through before we change
    // frames current the actual animation
    this.framesElapsed = 0;
    // if this.framesHold = 10 then its saying for every 10 frames loop through this animation
    // how do we use it. we know framesElapsed should be increasing over time
    // so within this.update() add in this.framesElapsed++
    // this.framesHold is in charge of fast we are making the animate run the higher the number the slower
    // the lower the number the faster
    // we are going to have different framesHold for different sprites
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    // loop through sprites object
    // declaring sprite as a const because sprite is never going to change
    for (const sprite in this.sprites) {
      // add on a property to this object sprites were currently looping over
      // going to add a .image property to sprites[sprite].image equal to  = new Image()
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    // console.log(this.sprites);
  }

  // by getting rid of this draw method in our Fighter class will be automatically using the draw
  // method in the Sprite class
  // draw() {
  //   ctx.fillStyle = this.color;
  //   ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

  //   // if we want our attackBox drawn out do here in the draw function
  //   // attack box
  //   // if this.isAttacking then do this code to show the sword come out on spacebar
  //   if (this.isAttacking) {
  //     ctx.fillStyle = "pink";
  //     ctx.fillRect(
  //       this.attackBox.position.x,
  //       this.attackBox.position.y,
  //       this.attackBox.width,
  //       this.attackBox.height
  //     );
  //   }
  // }

  //   to have things moving around
  //   to get player and enemy to stop at the bottom of screen focus on update funciton
  // if want sprites to stop moving have to set velocity back to zero at some point
  update() {
    // updated to move sprites across the screen
    // first thing call this.draw()
    this.draw();
    // if not dead making it true rather than false then continue animateFrames()
    // keeping the game going
    if (!this.dead) this.animateFrames();
    // attack boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // hit box
    // this is where we drew the attackBox and comment out to make it invisible
    // ctx.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    // select their position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // GRAVITY
    // if this.position.y += this.height  is equal to the bottom of the enemy rectangle
    // is greater than or equal to the bottom of our canvas
    // set the velocity of rectangle to zero, itll prevent it from falling through the canvas
    // as long as this is true they will not go past the floor
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {
      // select this.position.y = 331 and the number 331 i got from logging the position.y when
      // the character lands to stop him from twitching when hitting the ground becaues its trying to
      // reach gravity back to zero from the velocity.y
      this.velocity.y = 0;
      this.position.y = 331;
    } else {
      this.velocity.y += gravity;
    }
    // trying to fix the strange bounce when reaching the ground
    // console.log(this.position.y);
  }

  // add attack method
  attack() {
    // need a way to activate attack, so should be done in the event listeners
    this.switchSprites("attack1");
    this.isAttacking = true;
  }

  takeHit() {
    //  we dont reference enemy instead this.health
    // enemy.health -= 20;
    this.health -= 20;

    if (this.health <= 0) {
      // console.log("sombody dead")
      // similar to take hit , make sure death animation doesnt
      // allow anything to override it, as a result go into switch sprite
      // and none of these animations should run unless our death animation is activated
      this.switchSprites("death");
    } else {
      this.switchSprites("takeHit");
    }
  }

  // WHERE would we call switchSprites() to activate take hit
  // right where we are detecting for collision.
  // responsible for switching between different sprites
  // it will take an argument of whitch sprite we want to switch to
  switchSprites(sprite) {
    // if this.image strict equals the sprites death image then
    // return because we dont want anything else beneath to run since
    // death is true stoping the game
    // this will still run and we dont want any more movement once they hit the ground
    // so will add a new property to our Fighter called this.dead
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
      this.dead = true;
      console.log(this.dead);

      return;
    }
    // This is overrding all other animation with the attack animation
    // this is the conditional to stop the and start the attack animation to trigger onces per spacebar
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    // override when fighter gets hit
    // if were not attacking and getting hit we dont
    // we dont want to run anything beneath this if statement
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    if (sprite === "idle") {
      if (this.image !== this.sprites.idle.image) {
        this.image = this.sprites.idle.image;
        this.framesMax = this.sprites.idle.framesMax;
        // resetting framesCurrent to 0 so that whatever frame the current animation is on
        // that it leave a blank space when transitioning to a different sprite animation
        // because sprites dont all have the same frames
        this.framesCurrent = 0;
      }
    } else if (sprite === "run") {
      if (this.image !== this.sprites.run.image) {
        this.image = this.sprites.run.image;
        // to differentiate each animation also add the images framesMax
        this.framesMax = this.sprites.run.framesMax;
        this.framesCurrent = 0;
      }
    } else if (sprite === "jump") {
      if (this.image !== this.sprites.jump.image) {
        this.image = this.sprites.jump.image;
        this.framesMax = this.sprites.jump.framesMax;
        this.framesCurrent = 0;
      }
    } else if (sprite === "fall") {
      if (this.image !== this.sprites.fall.image) {
        this.image = this.sprites.fall.image;
        this.framesMax = this.sprites.fall.framesMax;
        this.framesCurrent = 0;
      }
    } else if (sprite === "attack1") {
      if (this.image !== this.sprites.attack1.image) {
        this.image = this.sprites.attack1.image;
        this.framesMax = this.sprites.attack1.framesMax;
        this.framesCurrent = 0;
      }
    } else if (sprite === "takeHit") {
      // in animation loop detect for collision this is where we use the animation for getting hit
      if (this.image !== this.sprites.takeHit.image) {
        this.image = this.sprites.takeHit.image;
        this.framesMax = this.sprites.takeHit.framesMax;
        this.framesCurrent = 0;
      }
    } else if (sprite === "death") {
      // this will be used in the takeHit() method in classes
      // because thats where the player enemy loses their health.
      // if their health is <= 0 then call the death animation
      if (this.image !== this.sprites.death.image) {
        this.image = this.sprites.death.image;
        this.framesMax = this.sprites.death.framesMax;
        this.framesCurrent = 0;
      }
    } else if (sprite === "exploder"){
      this.image = this.sprites.exploder.image;
      this.framesMax = this.sprites.exploder.framesMax;
      this.framesCurrent = 0;
      this.scale = 5

    }
  }
}
