

import Phaser from 'phaser';
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';


const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH/10, y: HEIGHT/2};

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition:BIRD_POSITION,
}

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene]

const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG))

const config = {
  // WebGL (Web graphics library) JS Api for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    // Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: initScenes()}
new Phaser.Game(config);