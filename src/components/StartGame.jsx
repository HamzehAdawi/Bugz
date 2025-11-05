import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { bugs } from '../data/bugs';

function StartGame({ onFoodCollected, onBonusCollected, quitButton, bug}) {
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
      time: {

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
    let foodGroup;
    let bonusFoodGroup;
    let bugFood = []; 
    let bugFoodDirection = [];
    let bonusSpawnTimer;

    function preload() {
      this.load.image('canvas', '/assets/dirt-plot.png');
      this.load.spritesheet('worm', '/assets/worm-sprite.png', { frameWidth: 40, frameHeight: 35, });
      this.load.image('grass', '/assets/grasflakes.png')
      this.load.image('sky', '/assets/sky.png')
      this.load.image('waste', '/assets/waste-diet.png');
      this.load.image('bonus-food', '/assets/waste-diet.png');
    }

    function create() {
      const { width, height } = this.scale;

      this.input.setDefaultCursor('url(/assets/pointer.png), pointer');

      this.physics.world.setBounds(0, 350, worldWidth, worldHeight);

      // Background
      background = this.add.tileSprite(0, 0, worldWidth, worldHeight, 'canvas').setOrigin(0).setDepth(-1);
      grassLayer = this.add.tileSprite(0, 300, worldWidth, 200, 'grass').setOrigin(0).setDepth(-1);
      skyLayer = this.add.tileSprite(0, 0, worldWidth, 300, 'sky').setOrigin(0).setDepth(-1);

      // Player (ensure spawn within physics bounds)
      const topBound = this.physics.world.bounds.y;
      const safeY = Math.max(height / 2, topBound + 50);
      player = this.physics.add.sprite(width / 2, safeY, 'worm');
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      // Camera setup
      camera = this.cameras.main;
      camera.setBounds(0, 0, worldWidth, worldHeight);
      camera.startFollow(player, true, 1, 1, null, -110);

      //FOOD
      this.onFoodCollected = onFoodCollected;
      this.onBonusCollected = onBonusCollected;
      foodGroup = this.physics.add.group();
      this.physics.add.overlap(player, foodGroup, collectFood, null, this);

      // BONUS FOOD
      bonusFoodGroup = this.physics.add.group();
      this.physics.add.overlap(player, bonusFoodGroup, collectBonusFood, null, this);

      bonusSpawnTimer = this.time.addEvent({
        delay: Phaser.Math.Between(15000, 25000),
        callback: () => {
          spawnBonusFood.call(this);
          // Reset timer with new random delay
          bonusSpawnTimer.delay = Phaser.Math.Between(15000, 25000);
        },
        loop: true
      });

      //ENEMIES (TO-DO)

      for (let i = 0; i < 15; i++) {
        spawnFood();
      }

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

    //Bug movement 
    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const maxSpeed = 300;       
    const followStrength = 1.88; 
    const stopRadius = 35;      
    const slowRadius = 170;    
    const dx = worldPoint.x - player.x;
    const dy = worldPoint.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let foodDireciton = Math.random(1 ,0) == 1 ? -1:1; 


    if (distance > stopRadius) {
      const angle = Math.atan2(dy, dx);

      const t = Phaser.Math.Clamp(distance / slowRadius, 0, 1);
      const desiredSpeed = maxSpeed * t;

      const targetVX = Math.cos(angle) * desiredSpeed;
      const targetVY = Math.sin(angle) * desiredSpeed;

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

      if (player.body.velocity.x < 0) {
        player.anims.play('left', true)

      } else {
        player.anims.play('right', true);
      }
    } else {
        player.body.velocity.x *= 0.8;
        player.body.velocity.y *= 0.8;

        if (Math.abs(player.body.velocity.x) < 10 && Math.abs(player.body.velocity.y) < 10) {
          player.setVelocity(0);
          player.anims.play('turn', true);
        }
      }

      for (let i = 0; i < bugFood.length; i++) {
        const speed = bugs[bug].speed;
        bugFood[i].x += (foodDireciton * speed * this.game.loop.delta / 1000); 

        if (bugFood[i].x >= worldWidth +10 || bugFood[i].x <= -10) {
          foodDireciton *= -1;
        }
        if(bugFoodDirection >=1) {
          bugFood[i].anims.play('right', true);
        } else {
          bugFood[i].anims.play('left', true);
        }
      }
      
    }

    function spawnFood() {
      if (!foodGroup) return;
      const bounds = foodGroup.scene.physics.world.bounds;
      const margin = 100;
      const x = Phaser.Math.Between(bounds.x + margin, bounds.right - margin);
      const y = Phaser.Math.Between(bounds.y + margin, bounds.bottom - margin);

      const dietSize = 2;
      const randomIndex = Math.floor(Math.random() * dietSize);

      const food = bugs[bug].diet[randomIndex];
      const foodItem = foodGroup.create(x, y, food);
      foodItem.setBounce(0.2);

      
      if (food != "waste") {
        bugFood.push(foodItem);
        bugFoodDirection.push(Math.random(1 ,0) == 1 ? -1:1);
      }
      
      return foodItem;
    }

    function collectFood(player, food) {
      if (!food || !foodGroup) return;
      // Reuse the same food object to avoid growth/leaks
      const bounds = foodGroup.scene.physics.world.bounds;
      const margin = 40;
      const newX = Phaser.Math.Between(bounds.x + margin, bounds.right - margin);
      const newY = Phaser.Math.Between(bounds.y + margin, bounds.bottom - margin);
      food.enableBody(true, newX, newY, true, true);
      food.setBounce(0.2);

      if (this.onFoodCollected) {
        this.onFoodCollected();
      }
    }

    function spawnBonusFood() {
      if (!bonusFoodGroup || !this.physics) return;
      
      const bounds = this.physics.world.bounds;
      const margin = 100;
      const x = Phaser.Math.Between(bounds.x + margin, bounds.right - margin);
      const y = Phaser.Math.Between(bounds.y + margin, bounds.bottom - margin);

      const bonusFood = bonusFoodGroup.create(x, y, 'bonus-food');
      bonusFood.setBounce(0.2);
      bonusFood.setScale(1.5);
      bonusFood.bonusValue = 10;

      this.tweens.add({
        targets: bonusFood,
        alpha: 0.2,
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.tweens.add({
        targets: bonusFood,
        scaleX: 1.7,
        scaleY: 1.7,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.tweens.add({
        targets: bonusFood,
        angle: 360,
        duration: 2000,
        repeat: -1,
        ease: 'Linear'
      });

      this.time.delayedCall(8000, () => {
        if (bonusFood && bonusFood.active) {
          this.tweens.killTweensOf(bonusFood);
          bonusFood.destroy();
        }
      });

      return bonusFood;
    }

    function collectBonusFood(player, bonusFood) {
      if (!bonusFood || !bonusFoodGroup) return;
      
      const bonusValue = bonusFood.bonusValue || 10;
      bonusFoodGroup.scene.tweens.killTweensOf(bonusFood);
      bonusFood.destroy();

      if (this.onBonusCollected) {
        this.onBonusCollected(bonusValue);
      }
    }

    return () => game.destroy(true);
  }, []);

  return <div ref={phaserRef} style={{ width: '100%', height: '101vh' }} />;
}

export default StartGame;
