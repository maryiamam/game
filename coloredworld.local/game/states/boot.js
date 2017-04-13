var boot = function(game) {};

boot.prototype = {
  preload: function() {
     this.game.load.image('loading', 'game/objects/loader.png');
  },

  create: function() {
    console.log('%cSTATE::BOOT', 'color: #fff; background: #f00;');
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true; 
    this.game.state.start('Preload');
  }
};