import BaseScene from "./BaseScene";


const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene{
    constructor(config){
        super('PlayScene', config);

        this.bird = null;
        this.pipes = null;
        this.pause = null;
        this.isPaused = false;

        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [400, 600];
        this.flapVelocity = 250;

        this.score = 0;
        this.scoreText = '';

    }

    preload(){
        
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pause', 'assets/pause.png')
    }

    create(){
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();
    }

    update(){
        this.checkGameStatus();          
        this.recyclePipes();  
    }

    createBG(){
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
        this.bird.body.gravity.y = 400;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes(){
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
          const upperPipe = this.pipes.create(0, 0, 'pipe')
            .setImmovable(true)
            .setOrigin(0, 1);
          const lowerPipe = this.pipes.create(0, 0, 'pipe')
            .setImmovable(true)
            .setOrigin(0, 0);
      
          this.placePipe(upperPipe, lowerPipe)
        }
      
        this.pipes.setVelocityX(-200);
    }

    createColliders(){
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    createScore(){
        this.score = 0;
        const highestScore = localStorage.getItem('highestScore');
        this.scoreText = this.add.text(16, 16, `Score: ${0}`, {fontSize: '32px', fill:'#ccccff'} );
        this.highestScoreText = this.add.text(16, 48, `Highest Score: ${highestScore || 0}`, {fontSize: '22px', fill:'#ffcccc'} );
    }

    createPause(){
        const pauseButton =  this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
            .setInteractive()
            .setScale(3)
            .setOrigin(1,1)
            
        pauseButton.on('pointerdown', () =>{
            this.isPaused = !this.isPaused;

            if(this.isPaused){
              this.physics.pause();
              this.scene.pause();            
            }
            else{
              this.physics.resume();
              this.scene.resume();
            }

        })
       
    }

    handleInputs(){
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown-SPACE', this.flap, this);
    }

    checkGameStatus(){
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            this.gameOver();
           }
    }

    placePipe(uPipe, lPipe) {

        const rightMostXPos = this.getRightMostPipe();
      
        const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
      
        uPipe.x = rightMostXPos + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;
      
        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance
      }
      
      recyclePipes(){
        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
          if(pipe.getBounds().right <= 0){
            //recycle pipe
            tempPipes.push(pipe);
            if(tempPipes.length === 2){
              this.placePipe(...tempPipes);
              this.increaseScore();
              this.saveBestScore();
            }
          }
        })
      
      }

      getRightMostPipe() {
        let rightMostX = 0;
        this.pipes.getChildren().forEach(function(pipe){
          rightMostX = Math.max(pipe.x, rightMostX);
      
        })
        return rightMostX
      }

      saveBestScore(){
        const highestScoreText = localStorage.getItem('highestScore');
        const highestScore = highestScoreText && parseInt(highestScoreText, 10); // if there's a score && 10 for the decimal system
        if(!highestScore || this.score > highestScore){ // if there's no highest score or the current score is higher -> store
            localStorage.setItem('highestScore', this.score);
        }


      }
      
      gameOver() {
        this.physics.pause();
        this.bird.setTint(0xff0000);
        this.saveBestScore();       

        // add a delay after the game ends
        // by default the callback functions repeats indefinitely
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false,
        })
      }
      
      flap() {
        this.bird.body.velocity.y = -this.flapVelocity;
      }

      increaseScore(){
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`)
      }
}

export default PlayScene
