import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function StartGame() {
  const phaserRef = useRef(null);
  let player;
  let cursors;
  
  useEffect(() => {

    const config = {
        type: Phaser.AUTO,
        width: '100%',
        height: '100%',
        parent: phaserRef.current, 
        scene: {
          preload,
          create,
          update,
        },
        physics: {
          default: 'arcade',
        },
    };

    const game = new Phaser.Game(config);

    function preload() {
        this.load.image('canvas', '/assets/dirt-plot.png');
        this.load.spritesheet('worm', '/assets/worm-sprite.png', 
          { frameWidth: 40, frameHeight: 35 });

    }

    function create() {
        this.add.image(200.5, 293, 'canvas');
        this.add.image(800, 293, 'canvas');
        this.add.image(200.5, 893, 'canvas');
        this.add.image(800, 893, 'canvas');
      

        player = this.physics.add.sprite(400, 450, 'worm');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('worm', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'worm', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('worm', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();
        
    }

    function update() {
    
         if (cursors.left.isDown)
        {
          player.setVelocityX(-160);

          player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
          player.setVelocityX(160);

          player.anims.play('right', true);
        }

        else
        {
          player.setVelocityX(0);

          player.anims.play('turn');
        }


        

    }

    


    return () => {
        game.destroy(true);
    };
  }, []);

  
  return <div ref={phaserRef} />;
}

export default StartGame;
