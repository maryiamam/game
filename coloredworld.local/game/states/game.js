var gameState = function(game) {};
var player, weapon, cloud, water, ground, layer, layer1, cursors, fireButton, bullets, bullet, bulletTime = 0,
    bulletSpeed = 600,
    explosion, text, balls;

gameState.prototype = {
    preload: function() {
        this.game.stage.backgroundColor = '#d0def0';
        this.game.load.image('cloud1', 'game/objects/cloud1.png');
        this.game.load.image('cloud2', 'game/objects/cloud2.png');
        this.game.load.image('cloud3', 'game/objects/cloud3.png');
        this.game.load.image('redball', 'game/objects/redballmin.png');
        this.game.load.tilemap('ground', 'game/levels/level1/testlevel1_1.csv', null, Phaser.Tilemap.CSV);
        this.game.load.tilemap('water', 'game/levels/level1/testlevel1_2.csv', null, Phaser.Tilemap.CSV);
    },

    create: function(game) {
        console.log('%cSTATE::GAME', 'color: #fff; background: #f0f;');

        for (var i = 0; i < 15; i++) {
            cloud = this.game.add.sprite(this.game.world.randomX, this.game.rnd.between(0, 300), 'cloud' + this.game.rnd.between(1, 3));
            this.game.physics.arcade.enable(cloud);
            cloud.body.velocity.x = this.game.rnd.between(-20, -30);
            cloud.autoCull = true;
            cloud.checkWorldBounds = true;
            cloud.events.onOutOfBounds.add(this.resetSprite, this);
        }

        ground = this.game.add.tilemap('ground', 40, 40);
        ground.addTilesetImage('tiles');
        layer = ground.createLayer(0);
        layer.resizeWorld();

        ground.setTileIndexCallback(5, this.collectBall, this);

        ground.setCollisionBetween(0, 3);

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        var b = bullets.create(0, 0, 'redball');
        b.body.gravity.y = 500;
        b.anchor.set(0.5, 0.5);
        b.exists = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(this.resetBullet, this);

        explosions = game.add.group();
        explosions.createMultiple(30, 'explosion');
        explosions.forEach(function(explosion) {
            explosion.animations.add('explosion');
        });

        player = this.game.add.sprite(40, game.world.height - 240, 'hero');
        player.anchor.set(0.5);
        this.game.physics.arcade.enable(player);
        this.game.camera.follow(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 700;
        player.body.collideWorldBounds = true;
        player.animations.add('stand', [7], 1, true);
        player.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7], 15, true);

        water = this.game.add.tilemap('water', 40, 40);
        water.addTilesetImage('tiles');
        layer1 = water.createLayer(0);

        balls = 20;
        text = game.add.text(20, 20, 'Balls: ' + balls, { font: '20px Arial', fill: 'red' });
        text.fixedToCamera = true;

        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        cursors = this.game.input.keyboard.createCursorKeys();


    },

    update: function() {
        //game.physics.arcade.overlap(player, greenEnemies, collisionHandler, null, this);
        this.game.physics.arcade.collide(bullets, layer, this.collisionHandler, null);

        this.game.physics.arcade.collide(player, layer);

        player.body.velocity.x = 0;

        this.controls();
    },

    controls: function() {
        if (cursors.left.isDown) {
            player.body.velocity.x = -150;
            player.animations.play('run');
            player.scale.setTo(-1, 1);
            this.game.camera.x -= 4;
            bulletSpeed = -600;
            explosions.setAll('anchor.x', 0.2);
            explosions.setAll('anchor.y', 0.2);
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 150;
            player.animations.play('run');
            player.scale.setTo(1, 1);
            this.game.camera.x += 4;
            bulletSpeed = 600;
            explosions.setAll('anchor.x', 0);
            explosions.setAll('anchor.y', 0);
        } else {
            player.animations.play('stand');
        }

        if (cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
            player.body.velocity.y = -400;
        }

        if (fireButton.isDown) {
            this.fire();
        }
    },

    fire: function() {

        if (this.game.time.now > bulletTime) {
            bullet = bullets.getFirstExists(false);

            if (bullet && balls !== 0) {
                bullet.reset(player.x, player.y);
                bullet.body.velocity.x = bulletSpeed;
                text.text = 'Balls: ' + --balls;
            }
        }

    },

    resetBullet: function(bullet) {
        bullet.kill();
    },

    collisionHandler: function(bullet) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.body.x, bullet.body.y);
        explosion.play('explosion', 30, false, true);
        bullet.kill();
    },

    collectBall: function() {
        var x = layer.getTileX(player.x),
            y = layer.getTileY(player.y);
        
        if (ground.hasTile(x, y)) {
            text.text = 'Balls: ' + ++balls;
        }
        ground.putTile(-1, layer.getTileX(player.x), layer.getTileY(player.y));
    },

    // render: function() {
    //     this.game.debug.cameraInfo(this.game.camera, 500, 32);
    //     this.game.debug.spriteCoords(player, 32, 32);
    // },

    resetSprite: function(player) {
        player.x = this.game.world.bounds.right;
    }
};
