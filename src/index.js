
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      //gravity: { y: 300 } to apply it only to the bird
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};


const VELOCITY = 200;
const FLAP_VELOCITY = 250;
const initialBirdPosition = {x: config.width * 0.1, y:config.height/2 }

let bird = null;
let pipes = [];
let totalDelta = null;
let outOfBounds = false;
const pipeVerticalDistanceRange = [100, 300];
let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);

function preload () {
  // this context - scene
  // contains functions and properties we can use
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
  
}

function create () {
  // x y 'sky'--> key of the image

  this.add.image(0,0,'sky').setOrigin(0,0); // 0 to 1
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 300;
  
  pipes.push(this.physics.add.sprite(400, 100, 'pipe').setOrigin(0,1));
  pipes.push(this.physics.add.sprite(400, pipeVerticalDistance + pipes[0].y, 'pipe').setOrigin(0));

  this.input.on('pointerdown',flap);
  this.input.keyboard.on('keydown-SPACE', flap); 
  console.log(bird.body)
  debugger

}

// 60fps 
// 60 times per second it's called
function update(time, delta){
  if(checkOutOfBounds()){
    restartBirdPosition();
  }
}

//------HELPER FUNCTIONS-----//
function flap(){
  bird.body.velocity.y = -FLAP_VELOCITY;
}

function checkOutOfBounds(){
  return( (bird.y > config.height || bird.y < 0) ? true: false)
}

function restartBirdPosition(){
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}


new Phaser.Game(config);