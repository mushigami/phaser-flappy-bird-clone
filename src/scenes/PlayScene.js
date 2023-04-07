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
        this.flapVelocity = 250;

        this.score = 0;
        this.scoreText = '';

        this.currentDifficulty = 'easy';
        this.difficulties = {
          'easy':{
            pipeHorizontalDistanceRange: [400, 500],
            pipeVerticalDistanceRange : [150, 250],
          },
          'medium':{
            pipeHorizontalDistanceRange: [300, 400],
            pipeVerticalDistanceRange : [140, 190],

          },
          'hard':{
            pipeHorizontalDistanceRange: [200, 250],
            pipeVerticalDistanceRange : [120, 170],
          }
        }
      }
    preload(){
        
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pause', 'assets/pause.png')
    }

    create(){
      this.currentDifficulty = 'easy';
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();
        this.listenToEvents();

        this.anims.create({
          key: 'fly',
          frames: this.anims.generateFrameNumbers('bird', { start: 8, end: 15 }),
          frameRate: 10, // 10 frames per second
          repeat: -1, //repeat forever
        })
        this.bird.play('fly');
    }

    update(){
        this.checkGameStatus();          
        this.recyclePipes();  
    }

    listenToEvents(){
      if(this.pauseEvent){ return;}
      this.pauseEvent = this.events.on('resume', () => {
        this.initialTime = 3;
        this.countDownText = this.add.text(this.config.width / 2, this.config.height / 2, 'Fly in: ' + this.initialTime, {fontSize: '32px', fill:'#cd00ff'} ).setOrigin(0.5);
        this.timedEvent = this.time.addEvent({ 
          delay: 1000, 
          callback: this.countDown, 
          callbackScope: this, 
          loop: true });
      })
    }

    countDown(){
      this.initialTime--;
      this.countDownText.setText('Fly in: ' + this.initialTime);
      if (this.initialTime === 0){
        this.isPaused = false;
        this.countDownText.destroy();
        this.timedEvent.destroy();
        this.physics.resume();
      }
    }
    createBG(){
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
          .setFlipX(true)
          .setOrigin(0)
          .setScale(3);

        this.bird.setBodySize(this.bird.width - 2, this.bird.height - 8);
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
      this.isPaused = false;
      const pauseButton =  this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
          .setInteractive()
          .setScale(3)
          .setOrigin(1,1)
          
      pauseButton.on('pointerdown', () =>{
        this.isPaused = true;
        this.physics.pause();
        this.scene.pause();
        this.scene.launch('PauseScene');

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
      const difficulty = this.difficulties[this.currentDifficulty];

      const rightMostXPos = this.getRightMostPipe();
    
      const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
      const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
      const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
    
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
              this.increaseDifficult();
            }
          }
        })
      
      }

      increaseDifficult(){
        if(this.score === 5){
          this.currentDifficulty = 'medium';
        }
        if(this.score === 10){
          this.currentDifficulty = 'hard';
        }
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
        if(this.isPaused){return;}
        this.bird.body.velocity.y = -this.flapVelocity;
      }

      increaseScore(){
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`)
      }
}

export default PlayScene
