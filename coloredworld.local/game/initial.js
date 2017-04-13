(function() {
    var game = new Phaser.Game(1000, 600, Phaser.AUTO);

    

    game.state.add('Boot', boot);
    game.state.add('Preload', preload);
    game.state.add('Menu', menu);
    game.state.add('Levels', levels);
    game.state.add('Level1', level1);
    game.state.add('Level2', level2);
    game.state.add('Level3', level3);
    game.state.add('Level4', level4);
    game.state.add('Level5', level5);
    game.state.add('Level6', level6);
    game.state.add('Level7', level7);
    game.state.add('Level8', level8);

    /*Start boot state*/
    game.state.start('Boot');
})()
