import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function StartGame({ onFoodCollected }) {
  const phaserRef = useRef(null);
  let player;
  let cursors;
  let foodGroup;

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
      this.load.spritesheet('worm', '/assets/worm-sprite.png', {
        frameWidth: 40,
        frameHeight: 35,
      });
      this.load.image('waste', '/assets/waste-diet.png');
    }

    function create() {
      this.onFoodCollected = onFoodCollected;
      this.physics.world.setBounds(0, 0, 1600, 1000);

      this.add.image(200.5, 293, 'canvas');
      this.add.image(800, 293, 'canvas');
      this.add.image(200.5, 893, 'canvas');
      this.add.image(800, 893, 'canvas');

      player = this.physics.add.sprite(400, 450, 'worm');
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.cameras.main.startFollow(player, true, 0.08, 0.08);
      this.cameras.main.setBounds(0, 0, 1600, 1000);

      foodGroup = this.physics.add.group();
      this.physics.add.overlap(player, foodGroup, collectFood, null, this);

      for (let i = 0; i < 15; i++) {
        spawnFood();
      }

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('worm', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: 'turn',
        frames: [{ key: 'worm', frame: 4 }],
        frameRate: 20,
      });
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('worm', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });
      cursors = this.input.keyboard.createCursorKeys();
    }

    function spawnFood() {
      if (!foodGroup) return;
      const x = Phaser.Math.Between(50, 1550);
      const y = Phaser.Math.Between(100, 900);
      const foodItem = foodGroup.create(x, y, 'waste');
      foodItem.setBounce(0.2);
    }

    function collectFood(player, food) {
      food.disableBody(true, true);
      if (this.onFoodCollected) {
        this.onFoodCollected();
      }
      spawnFood();
    }

    function update() {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
      } else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('turn', true);
      } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('turn', true);
      } else {
        player.setVelocityX(0);
        player.setVelocityY(0);
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