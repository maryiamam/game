var levels = function(game) {};

WebFontConfig = {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createButton, this); },
    google: {
      families: ['Nothing You Could Do']
    }

};

levels.prototype = {

    preload: function() {
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    },

    create: function() {

        this.game.add.sprite(0, 0, 'map');

        console.log('%cSTATE::LEVELS', 'color: #fff; background: #0f0;');
        this.createButton(this.game, '1', 16, 650, this.game.world.centerY - 180, 60, 60, 'buttonFlag',
            function() {
                this.game.state.start('Level1');
            });

        this.createButton(this.game, '2', 16, 510, this.game.world.centerY - 210, 60, 60, 'buttonFlag',
            function() {
                this.game.state.start('Level2');
            });

        this.createButton(this.game, '3', 16, 400, this.game.world.centerY - 120, 60, 60, 'buttonFlag',
            function() {
                this.game.state.start('Level3');
            });

        this.createButton(this.game, '4', 16, 250, this.game.world.centerY - 110, 60, 60, 'buttonFlag',
            function() {
                this.game.state.start('Level4');
            });

        this.createButton(this.game, '5', 16, 370, this.game.world.centerY + 50, 60, 60, 'buttonFlag',
            function() {
                this.game.state.start('Level5');
            });

        this.createButton(this.game, '6', 16, 560, this.game.world.centerY + 90, 60, 60, 'buttonFlag',
            function() {
                this.game.state.start('Level6');
            });

        this.createButton(this.game, '7', 16, 760, this.game.world.centerY + 20, 60, 60, 'buttonFlag',
            function() {
                this.game.state.start('Level7');
            });

        this.createButton(this.game, '8', 16, 660, this.game.world.centerY + 110, 60, 60, 'buttonFlag',
            function() {
                this.game.state.start('Level8');
            });

        this.createButton(this.game, 'Menu', 24,  950, 50, 200, 100, '',
            function() {
                this.game.state.start('Menu');
            });
        
        this.createCloud(this.game);
    },

    createButton: function(game, string, fontSize, x, y, w, h, bg, callback) {
        var menuButton = game.add.button(x, y, bg, callback, this, 2, 1, 0);

        menuButton.anchor.setTo(0.5, 0.5);
        menuButton.width = w;
        menuButton.heigth = h;

        var text = game.add.text(menuButton.x - 8, menuButton.y - 12, string);
        text.font = 'Nothing You Could Do';
        text.fill = '#fff';
        text.fontSize = fontSize;
        text.anchor.setTo(0.5, 0.5);
    }, 

    createCloud: function(game) {
        for (var i = 0; i < 20; i++) {
            var cloud = game.add.sprite(game.world.randomX, game.world.randomY, 'levelsCloud' + game.rnd.between(1, 3));
            game.physics.arcade.enable(cloud);
            cloud.body.velocity.x = game.rnd.between(-20, -30);
            cloud.autoCull = true;
            cloud.checkWorldBounds = true;
            cloud.events.onOutOfBounds.add(this.resetSprite, this);
        }
    },

    resetSprite: function(sprite) {
        sprite.x = this.game.world.bounds.right;
    }

};