import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene', {...config, canGoBack: true});
    }

    create() {
        super.create();

        const highestScoreText = localStorage.getItem('highestScore');
        this.add.text(this.config.width / 2, this.config.height / 2 - 50, `Highest Score: ${highestScoreText || 0}`, this.fontOptions).setOrigin(0.5);
    }
}

export default ScoreScene;