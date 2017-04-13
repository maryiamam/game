var preload = function(game) {};

preload.prototype = {
    preload: function() {
        var loadingBar = this.game.add.sprite(400, 500, 'loading');
        this.game.load.setPreloadSprite(loadingBar);

        this.game.load.image('menuBG', 'game/objects/MenuBG.png');

        this.game.load.image('island1', 'game/objects/island1.png');
        this.game.load.image('island2', 'game/objects/island2.png');

        this.game.load.image('map', 'game/objects/map.png');

        this.game.load.image('buttonExit', 'game/objects/exit.png');
        this.game.load.image('buttonFlag', 'game/objects/button-flag.png');
        this.game.load.image('levelsCloud1', 'game/objects/levelsCloud1.png');
        this.game.load.image('levelsCloud2', 'game/objects/levelsCloud2.png');
        this.game.load.image('levelsCloud3', 'game/objects/levelsCloud3.png');

        this.game.load.image('bg', 'game/objects/background.png');
        this.game.load.image('cloud1', 'game/objects/cloud1.png');
        this.game.load.image('cloud2', 'game/objects/cloud2.png');
        this.game.load.image('cloud3', 'game/objects/cloud3.png');

        this.game.load.image('tiles', 'game/levels/tiles.png');

        this.game.load.image('redball', 'game/objects/redballmin.png');
        this.game.load.spritesheet('ballBurst', 'game/objects/ballBurst.png', 40, 40);

        this.game.load.image('fireball', 'game/objects/fireball.png');


        this.game.load.spritesheet('health', 'game/objects/healthHero.png');
        this.game.load.spritesheet('hero', 'game/objects/hero2.png', 40, 80);

        this.game.load.image('blueEnemy', 'game/objects/blueEnemy.png');
        this.game.load.spritesheet('blueEnemyBurst', 'game/objects/blueEnemyBurst.png', 40, 40);
    },

    create: function() {
        this.game.stage.backgroundColor = '#d0def0';
        console.log('%cSTATE::PRELOAD', 'color: #fff; background: #0f0;');
        this.game.state.start('Menu');
    }
};
