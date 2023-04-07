import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.fontSize = 48;
    this.lineHeight = 60;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#cd00ff" };
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);

    if(this.config.canGoBack){
        const backButton = this.add.image(this.config.width - 10, this.config.height-10,'back')
            .setOrigin(1)
            .setScale(2)
            .setInteractive();

        backButton.on('pointerup', () => {
            this.scene.start('MenuScene');
        })
    }
  }

  createMenu(menu, setupMenuEvents) {
    let lastMenuPositionY = 0;
    menu.forEach((menuItem) => {
      const menuPosition = [this.config.width / 2, this.config.height / 2 + lastMenuPositionY];
      menuItem.textGO = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5);
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);
    });    
  }
}

export default BaseScene;