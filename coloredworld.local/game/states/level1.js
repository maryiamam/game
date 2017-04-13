var setTileMap = {
    layer1: null,
    layer2: null
};
var setWorld = {
    background: null,
    cloud: null,
    groundBG: null,
    ground: null,
    player: null,
    blueEnemy: null,
    blueEnemyBurst: null
};
var setBall = {
    ballsGroup: null,
    ball: null,
    ballSpeed: 600,
    ballTime: 0,
    ballBurst: null,
};

var playerVelocityX = 175;
var playerVelocityY = -400;
var stateText;


WebFontConfig = {
    active: function() {
        this.game.time.events.add(Phaser.Timer.SECOND, createText, this);
        this.game.time.events.add(Phaser.Timer.SECOND, createButton, this);
    },
    google: {
        families: ['Nothing You Could Do']
    }

};

var createText = function(game) {
        stateText = game.add.text(500, 300, ' ');
        stateText.font = 'Nothing You Could Do';
        stateText.fill = '#fff';
        stateText.fontSize = 24;
        stateText.align = 'center';
        stateText.anchor.setTo(0.5, 0.5);
        stateText.fixedToCamera = true;
        stateText.visible = false;
    },

    createLives = function(game) {
        lives = game.add.group();
        lives.fixedToCamera = true;
        for (var i = 1; i < 6; i++) {
            var hero = lives.create(820 + 30 * i, 40, 'health');
            hero.anchor.setTo(0.5, 0.5);
        }
    },

    getDamage = function() {
        --health;
        if (health % 20 == 0) {
            this.killLive(1);
        }
    },

    killLive = function(count) {
        for (i = 0; i < count; i++) {
            live = lives.getFirstAlive();
            if (live) {
                live.kill();
            }
            if (lives.countLiving() === 0) {
                setWorld.player.kill();

                stateText.text = " GAME OVER \n Click to restart";
                stateText.visible = true;

                this.game.input.onTap.addOnce(this.restart, this);
            }
        }
    },

    createBlueEnemy = function(game, x, y, time) {
        this.bEnemy = setWorld.blueEnemy.create(x, y, 'blueEnemy');
        this.bEnemy.anchor.setTo(0.5, 0.5);
        this.bEnemy.body.immovable = true;

        this.bEnemyTween = game.add.tween(this.bEnemy).to({
            y: this.bEnemy.y + 50
        }, time, 'Linear', true, 0, 100, true);

        setWorld.blueEnemyBurst = game.add.group();
        setWorld.blueEnemyBurst.createMultiple(30, 'blueEnemyBurst');
        setWorld.blueEnemyBurst.forEach(function(blueEnemyBurst) {
            blueEnemyBurst.animations.add('blueEnemyBurst');
        });
    },

    collisionBlueEnemy = function(player, enemy) {
        this.killLive(2);
        this.killEnemy(enemy);
    },
    ballKillEnemy = function(ball, enemy) {
        this.collisionBall(ball);
        this.killEnemy(enemy);
    },

    killEnemy = function(enemy) {
        var blueEnemyBurst = setWorld.blueEnemyBurst.getFirstExists(false);
        blueEnemyBurst.reset(enemy.body.x, enemy.body.y);
        blueEnemyBurst.play('blueEnemyBurst', 30, false, true);
        enemy.kill();
    },

    collisionBall = function(ball) {
        var ballBurst = setBall.ballBurst.getFirstExists(false);
        ballBurst.reset(ball.body.x, ball.body.y);
        ballBurst.play('ballBurst', 30, false, true);
        ball.kill();
    },

    collectBall = function() {
        var x = setWorld.ground.getTileX(setWorld.player.x),
            y = setWorld.ground.getTileY(setWorld.player.y);
        if (setTileMap.layer2.hasTile(x, y)) {
            this.addBall();
        }
        setTileMap.layer2.putTile(-1, x, y);
    },

    resetBall = function(ball) {
        ball.kill();
    },

    createBall = function(game) {
        setBall.ballsGroup = game.add.group();
        setBall.ballsGroup.enableBody = true;
        setBall.ballsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        setBall.ball = setBall.ballsGroup.create(0, 0, 'redball');
        setBall.ball.body.gravity.y = 500;
        setBall.ball.anchor.set(0.5, 0.5);
        setBall.ball.exists = false;
        setBall.ball.checkWorldBounds = true;
        setBall.ball.events.onOutOfBounds.add(this.resetBall, this);

        setBall.ballBurst = game.add.group();
        setBall.ballBurst.createMultiple(30, 'ballBurst');
        setBall.ballBurst.forEach(function(ballBurst) {
            ballBurst.animations.add('ballBurst');
        });

        setBall.amountBalls = 20;
    },

    createAmountBalls = function(game, amount) {
        setBall.balls = game.add.group();

        setBall.balls.fixedToCamera = true;
        for (var i = 1; i < amount + 1; i++) {
            var ball = setBall.balls.create(30 * i, 35, 'redball');
            ball.anchor.setTo(0.5, 0.5);
        }
        setBall.balls.reverse();
    },

    addBall = function() {
        setBall.balls.forEach(function(item) {
            item.x = item.x + 30;
        })
        ball = setBall.balls.create(30, 35, 'redball');
        ball.anchor.setTo(0.5, 0.5);
    },

    killBall = function() {
        ball = setBall.balls.getFirstAlive();
        if (ball) {
            ball.kill();
        }
    },

    createCloud = function(game) {
        for (var i = 0; i < 10; i++) {
            setWorld.cloud = game.add.sprite(game.world.randomX, game.rnd.between(0, 200), 'cloud' + game.rnd.between(1, 3));
            game.physics.arcade.enable(setWorld.cloud);
            setWorld.cloud.body.velocity.x = game.rnd.between(-20, -30);
            setWorld.cloud.autoCull = true;
            setWorld.cloud.checkWorldBounds = true;
            setWorld.cloud.events.onOutOfBounds.add(this.resetSprite, this);
        }
    },

    resetSprite = function(sprite) {
        sprite.x = this.game.world.bounds.right;
    },

    createPlayer = function(game, x, y) {
        setWorld.player = game.add.sprite(x, y, 'hero');
        setWorld.player.anchor.set(0.5);
        game.physics.arcade.enable(setWorld.player);
        game.camera.follow(setWorld.player);
        setWorld.player.body.bounce.y = 0.2;
        setWorld.player.body.gravity.y = 700;
        setWorld.player.body.collideWorldBounds = true;
        setWorld.player.animations.add('stand', [7], 1, true);
        setWorld.player.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
    },

    createGroundBG = function(game) {
        setTileMap.layer1 = game.add.tilemap('level1_1', 40, 40);
        setTileMap.layer1.addTilesetImage('tiles');
        setWorld.groundBG = setTileMap.layer1.createLayer(0);
        setTileMap.layer1.setCollisionBetween(0, 0);
    },

    createGround = function(game) {
        setTileMap.layer2 = game.add.tilemap('level1_2', 40, 40);
        setTileMap.layer2.addTilesetImage('tiles');
        setWorld.ground = setTileMap.layer2.createLayer(0);
        setWorld.ground.resizeWorld();

        setTileMap.layer2.setCollisionBetween(0, 1);
        setTileMap.layer1.setTileIndexCallback(6, this.nextLevel, this);
        setTileMap.layer2.setTileIndexCallback([7, 8], this.swimming, this);
        setTileMap.layer1.setTileIndexCallback(2, this.getDamage, this);
        setTileMap.layer2.setTileIndexCallback(9, this.collectBall, this);
        setTileMap.layer2.setTileIndexCallback(-1, this.default, this);

    },

    createButton = function(game, string, fontSize, x, y, w, h, bg, callback) {
        var Button = game.add.button(x, y, bg, callback, this, 2, 1, 0);

        Button.anchor.setTo(0.5, 0.5);
        Button.width = w;
        Button.heigth = h;
        Button.fixedToCamera = true;

        var text = game.add.text(Button.x - 8, Button.y - 12, string);
        text.font = 'Nothing You Could Do';
        text.fill = '#fff';
        text.fontSize = fontSize;
        text.anchor.setTo(0.5, 0.5);
        text.fixedToCamera = true;
    },

    swimming = function() {
        setWorld.player.body.gravity.y = 50;
        playerVelocityX = 75;
        playerVelocityY = -100;
    },

    defaultProperty = function() {
        setWorld.player.body.gravity.y = 700;
        playerVelocityX = 175;
        playerVelocityY = -400;
    },

    fire = function() {

        if (this.game.time.now > setBall.ballTime) {
            setBall.ball = setBall.ballsGroup.getFirstExists(false);

            if (setBall.ball && setBall.balls.countLiving() !== 0) {
                setBall.ball.reset(setWorld.player.x, setWorld.player.y);
                setBall.ball.body.velocity.x = setBall.ballSpeed;
                this.killBall();
            }
        }

    },

    controls = function() {
        if (setWorld.player.alive) {
            if (cursors.left.isDown) {
                setWorld.player.body.velocity.x = -playerVelocityX;
                setWorld.player.animations.play('run');
                setWorld.player.scale.setTo(-1, 1);
                this.game.camera.x -= 4;

                setBall.ballSpeed = -600;
                setBall.ballBurst.setAll('anchor.x', 0.2);
                setBall.ballBurst.setAll('anchor.y', 0.2);
            } else if (cursors.right.isDown) {
                setWorld.player.body.velocity.x = playerVelocityX;
                setWorld.player.animations.play('run');
                setWorld.player.scale.setTo(1, 1);
                this.game.camera.x += 4;

                setBall.ballSpeed = 600;
                setBall.ballBurst.setAll('anchor.x', 0);
                setBall.ballBurst.setAll('anchor.y', 0);
            } else {
                setWorld.player.animations.play('stand');
            }

            if (cursors.up.isDown && (setWorld.player.body.touching.down || setWorld.player.body.onFloor())) {
                setWorld.player.body.velocity.y = playerVelocityY;
            }

            if (fireButton.isDown) {
                this.fire();
            }
        }

        if (toMenu.isDown) {
            this.game.state.start('Levels');
        }
    };

var level1 = function(game) {};

level1.prototype = {
    preload: function() {
        this.game.stage.backgroundColor = '#d0def0';

        this.game.load.tilemap('level1_1', 'game/levels/level1/level_1.csv', null, Phaser.Tilemap.CSV);
        this.game.load.tilemap('level1_2', 'game/levels/level1/level_2.csv', null, Phaser.Tilemap.CSV);
    },

    create: function(game) {
        console.log('%cSTATE::LEVEL 1', 'color: #fff; background: #f0f;');
        health = 100;
        balls = null;
        playerX = 50;
        playerY = 400;

        setWorld.background = this.game.add.sprite(0, 0, 'bg');
        setWorld.background.fixedToCamera = true;

        this.createCloud(this.game);
        this.createGroundBG(this.game);
        this.createBall(this.game);
        this.createPlayer(this.game, playerX, playerY);
        this.createGround(this.game);

        setWorld.blueEnemy = game.add.group();
        setWorld.blueEnemy.enableBody = true;
        setWorld.blueEnemy.physicsBodyType = Phaser.Physics.ARCADE;
        this.createBlueEnemy(this.game, 300, 400, 2000);
        this.createBlueEnemy(this.game, 600, 400, 1000);

        this.createLives(this.game);
        this.createAmountBalls(this.game, 10);

        this.createText(this.game);

        this.createButton(this.game, 'Map', 24, 950, 580, 200, 80, '',
            function() {
                this.game.state.start('Levels');
            });

        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        toMenu = this.input.keyboard.addKey(Phaser.KeyCode.ESC);
        cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        this.game.physics.arcade.collide(setBall.ballsGroup, setWorld.ground, this.collisionBall, null);
        this.game.physics.arcade.collide(setBall.ballsGroup, setWorld.blueEnemy, this.ballKillEnemy, null, this);

        this.game.physics.arcade.collide(setWorld.player, setWorld.ground);
        this.game.physics.arcade.collide(setWorld.player, setWorld.groundBG);
        this.game.physics.arcade.collide(setWorld.player, setWorld.blueEnemy, this.collisionBlueEnemy, null, this);

        setWorld.player.body.velocity.x = 0;

        this.controls();
    },

    resetBall: resetBall,
    collisionBall: collisionBall,
    collectBall: collectBall,
    createBall: createBall,
    createAmountBalls: createAmountBalls,
    killBall: killBall,
    addBall: addBall,
    createText: createText,
    createCloud: createCloud,
    resetSprite: resetSprite,
    createPlayer: createPlayer,
    createLives: createLives,
    killLive: killLive,
    createBlueEnemy: createBlueEnemy,
    collisionBlueEnemy: collisionBlueEnemy,
    ballKillEnemy: ballKillEnemy,
    killEnemy: killEnemy,
    createGroundBG: createGroundBG,
    createGround: createGround,
    createButton: createButton,
    swimming: swimming,
    default: defaultProperty,
    fire: fire,
    getDamage: getDamage,
    controls: controls,
    nextLevel: function() {
        this.game.state.start('Level2');
    },
    restart: function() {
        this.game.state.start('Level1');
    },
};
