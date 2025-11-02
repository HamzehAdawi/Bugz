import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function StartGame() {
  const phaserRef = useRef(null);
  const worldWidth = 2600;
  const worldHeight = 2000;

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: phaserRef.current,
      physics: { 
        default: 'arcade' 
      },
      scale: { 
        mode: Phaser.Scale.RESIZE 
      },
      scene: { 
        preload, 
        create, 
        update 
      },
    };

    const game = new Phaser.Game(config);

    let player;
    let camera;
    let background;
    let grassLayer;
    let skyLayer;

    function preload() {
      this.load.image('canvas', '/assets/dirt-plot.png');
      this.load.spritesheet('worm', '/assets/worm-sprite.png', { frameWidth: 40, frameHeight: 35, });
      this.load.image('grass', '/assets/grasflakes.png')
      this.load.image('sky', '/assets/sky.png')
    }

    function create() {
      const { width, height } = this.scale;

      this.input.setDefaultCursor('url(/assets/pointer.png), pointer');
      this.physics.world.setBounds(0, 350, worldWidth, worldHeight);

      // Background
      background = this.add.tileSprite(0, 0, worldWidth, worldHeight, 'canvas').setOrigin(0).setDepth(-1);
      grassLayer = this.add.tileSprite(0, 300, worldWidth, 200, 'grass').setOrigin(0).setDepth(-1);
      skyLayer = this.add.tileSprite(0, 0, worldWidth, 300, 'sky').setOrigin(0).setDepth(-1);

      // Player
      player = this.physics.add.sprite(width / 2, height / 2, 'worm');
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      // Camera setup
      camera = this.cameras.main;
      camera.setBounds(0, 0, worldWidth, worldHeight);
      camera.startFollow(player, true, 1, 1, null, -110);

      // Animations
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
    }

   function update() {
    if (!player) return;

    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main);

    // --- Tunable Parameters ---
    const maxSpeed = 300;       // top movement speed
    const followStrength = 1.88; // how quickly the worm reacts (higher = snappier)
    const stopRadius = 35;      // how close before it stops following
    const slowRadius = 170;     // start slowing down before reaching cursor
    // ---------------------------

    const dx = worldPoint.x - player.x;
    const dy = worldPoint.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > stopRadius) {
      // Move toward pointer
      const angle = Math.atan2(dy, dx);

      // Speed factor — slow down as we approach
      const t = Phaser.Math.Clamp(distance / slowRadius, 0, 1);
      const desiredSpeed = maxSpeed * t;

      const targetVX = Math.cos(angle) * desiredSpeed;
      const targetVY = Math.sin(angle) * desiredSpeed;

      // Interpolate velocity (smooth acceleration)
      player.body.velocity.x = Phaser.Math.Linear(
        player.body.velocity.x,
        targetVX,
        followStrength
      );
      player.body.velocity.y = Phaser.Math.Linear(
        player.body.velocity.y,
        targetVY,
        followStrength
      );

      // Animation
      if (player.body.velocity.x < 0) player.anims.play('left', true);
      else player.anims.play('right', true);
    } else {
      // Smooth stop
      player.body.velocity.x *= 0.8;
      player.body.velocity.y *= 0.8;

      if (Math.abs(player.body.velocity.x) < 10 && Math.abs(player.body.velocity.y) < 10) {
        player.setVelocity(0);
        player.anims.play('turn', true);
      }
    }
    }


    return () => game.destroy(true);
  }, []);

  return <div ref={phaserRef} style={{ width: '100%', height: '101vh' }} />;
}

export default StartGame;
