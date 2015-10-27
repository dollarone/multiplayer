var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {
    this.player;
    this.platforms;
    this.cursors;

    this.stars;
    this.score = 0;
    this.scoreText;


    this.map = this.game.add.tilemap('level1');

    this.map.addTilesetImage('gameTiles', 'gameTiles');

    //this.blockedLayer = this.map.createLayer('objectLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    //this.foregroundLayer = this.map.createLayer('foregroundLayer');

    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

    //this.blockedLayer.body.immovable = true;
    this.blockedLayer.resizeWorld();
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // The player and its settings
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    //this.player.scale.setTo(0.5, 0.5);

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    this.stars = this.game.add.group();

    //  We will enable physics for any star that is created in this group
    this.stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 0; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = this.stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    this.scoreText = this.game.add.text(16, 16, this.name, { fontSize: '32px', fill: '#000' });

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
     
  },

  update: function() {

// send the data; dont collide here

    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.collide(this.stars, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown)
    {
        //  Move to the left
        this.player.body.velocity.x = -150;

        this.player.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.player.body.velocity.x = 150;

        this.player.animations.play('right');
    }
    else
    {
        //  Stand still
        this.player.animations.stop();

        this.player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player.body.blocked.down)
    {
        this.player.body.velocity.y = -350;
    }

  },

  collectStar : function(player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;

  },
};
