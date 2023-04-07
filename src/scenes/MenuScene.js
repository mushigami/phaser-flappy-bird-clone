import BaseScene from "./BaseScene";


class MenuScene extends BaseScene{
    constructor(config){
        super('MenuScene', config);

        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'ScoreScene', text: 'Score'},
            {scene: null, text: 'Exit'}
        ]
    }
    preload(){
        this.load.image('sky', 'assets/sky.png');
    }

    create(){
        super.create();
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));

    }

    setupMenuEvents(menuItem){
        const textGO = menuItem.textGO;
        textGO.setInteractive();

        textGO.on('pointerover', () => {
            textGO.setStyle({fill: '#ff0'});
        });

        textGO.on('pointerout', () => {
            textGO.setStyle({fill: '#cd00ff'});
        });

        textGO.on('pointerup', () => {
            if(menuItem.scene){
                this.scene.start(menuItem.scene);
            }else{
                this.game.destroy(true);
            }
        });
    }

}

export default MenuScene;