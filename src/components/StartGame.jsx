import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { bugs } from '../data/bugs';

function StartGame({ onFoodCollected, onBonusCollected, quitButton, bug}) {
  const phaserRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);
  const worldWidth = 2600;
  const worldHeight = 2000;
  // Bug map to connect JSON
  const bugMap = new Map([
    ["waste", 0],
    ["worm", 1]
  ]);

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
  gameRef.current = game;

  let player;
  let camera;
  let background;
  let grassLayer;
  let skyLayer;
  let foodGroup;
  let bonuses = ["bonus-speed", "bonus-food"];
  let bonusGroup;
  let bugFood = []; 
  let bugFoodDirection = [];
  let bonusSpawnTimer;
  let streak =0; 
  let speedBonus = false;

  function preload() {
    this.load.image('canvas', '/assets/dirt-plot.png');
    this.load.spritesheet('worm', '/assets/worm-sprite.png', { frameWidth: 40, frameHeight: 35, });
    this.load.image('grass', '/assets/grasflakes.png')
    this.load.image('sky', '/assets/sky.png')
    this.load.image('waste', '/assets/waste-diet.png');
    this.load.image('bonus-food', '/assets/waste-diet.png');
    this.load.image('plus-one', '/assets/plus-one.png');
    this.load.image('plus-five', '/assets/plus-five.png');
    this.load.image('plus-ten', '/assets/plus-ten.png');
    this.load.image('bonus-speed', '/assets/speed-boost.png');
  }

  function create() {
    sceneRef.current = this;
    const { width, height } = this.scale;

    this.input.setDefaultCursor('url(/assets/pointer.png), pointer');

    this.physics.world.setBounds(0, 350, worldWidth, worldHeight);

    // Background
    background = this.add.tileSprite(0, 0, worldWidth, worldHeight, 'canvas').setOrigin(0).setDepth(-1);
    grassLayer = this.add.tileSprite(0, 300, worldWidth, 200, 'grass').setOrigin(0).setDepth(-1);
    skyLayer = this.add.tileSprite(0, 0, worldWidth, 300, 'sky').setOrigin(0).setDepth(-1);

    // Player 
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

    // BONUSES
    bonusGroup = this.physics.add.group();
    
    this.physics.add.overlap(player, bonusGroup, collectBonus, null, this);

    bonusSpawnTimer = this.time.addEvent({
      delay: Phaser.Math.Between(15000, 25000),
      callback: () => {
        const bonusSelection = Math.floor(Math.random() * bonuses.length);
        spawnBonus.call(this, bonusSelection);
      
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

    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const maxSpeed = speedBonus ? 600:300;       
    const followStrength = 1.88; 
    const stopRadius = 35;      
    const slowRadius = 170;    
    const dx = worldPoint.x - player.x;
    const dy = worldPoint.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);


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
        bugFood[i].x += (bugFoodDirection[i] * speed * this.game.loop.delta / 1000); 

        if (bugFood[i].x <= -40) {
          bugFood[i].x = worldWidth;
        } else if (bugFood[i].x >= worldWidth +40) {
          bugFood[i].x %= worldWidth;
        }

        //bug (food) direction will change if too close to player
        let dangerProximty = 100;
        //distance formula
        let proximity = Math.sqrt(Math.pow((player.x - bugFood[i].x), 2) + Math.pow((player.y - bugFood[i].y), 2))
        if (proximity <= dangerProximty) {
          if (player.x > bugFood[i].x && bugFoodDirection[i] > 0 || player.x < bugFood[i].x && bugFoodDirection[i] < 0) {
            bugFoodDirection[i] *= -1; 
          } 
        }
        if(bugFoodDirection[i] >=1) {
          bugFood[i].anims.play('right', true);
        } else {
          bugFood[i].anims.play('left', true);
        }
      }

      if (streak >= 50) {
        this.tweens.add({
          targets: player,
          scaleX: 2, 
          scaleY: 2,
          duration: 300, 
          yoyo: false, 
          repeat: 0, 
          onComplete: () => {
          }
        });
      }
    
  }

  function spawnFood() {
    if (!foodGroup) return;
    const x = Phaser.Math.Between(40, worldWidth);
    const y = Phaser.Math.Between(390, worldHeight);

    const dietSize = 2;
    const randomIndex = Math.floor(Math.random() * dietSize);

    const food = bugs[bug].diet[randomIndex];
    const foodItem = foodGroup.create(x, y, food);
    foodItem.setBounce(0.2);

    if (food !== "waste") {
      let direction = Math.random() > 0.5 ? 1:-1;
      bugFood.push(foodItem);
      bugFoodDirection.push(direction);
    }
    
    return foodItem;
  }

  function collectFood(player, food) {
    if (!food || !foodGroup) return;
    // Reuse the same food object to avoid growth/leaks
    const bounds = foodGroup.scene.physics.world.bounds;
    
    //FIX-ME
    let leftX = Phaser.Math.Between(40, camera.worldView.x);
    let rightX = Phaser.Math.Between(camera.worldView.x + camera.width, worldWidth - 140);
    
    let newX = 0;

    let leftMapSide = 40;
    let rightMapSide = 567;
    if (camera.worldView.x <= leftMapSide) {
      newX = rightX;
    } else if (camera.worldView.x >= rightMapSide) {
      newX = leftX
    } else {
      newX = Math.random() > 0.5 ? leftX:rightX;
    }

    const newY = Phaser.Math.Between(390, worldHeight);
    console.log("spawned at" + newX + " " + newY);

    food.enableBody(true, newX, newY, true, true);
    food.setBounce(0.2);

    if (this.onFoodCollected) {                
      const pointsEarned = bugs[bugMap.get(food.texture.key)].points;
      
      if (pointsEarned === 1) {
        streak += 1;
        this.onFoodCollected(1);
        const plusOne = this.add.sprite(player.x,player.y, "plus-one");
        plusOne.setScale(.67);
        this.tweens.add({
          targets: plusOne,
          alpha: 0,
          duration: 1300,
          y: '-=300',
          onComplete: () => plusOne.destroy()
        });
      } else if (pointsEarned === 5) {
          streak += 5;
          this.onFoodCollected(5);
          const plusFive = this.add.sprite(player.x,player.y, "plus-five");
          plusFive.setScale(.67);
          this.tweens.add({
            targets: plusFive,
            alpha: 0,
            duration: 1300,
            y: '-=300',
            onComplete: () => plusFive.destroy()
          });
        }
    }
  }

  return () => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
    sceneRef.current = null;
  };

  function spawnBonus(bonus) {
    if (!bonusGroup || !this.physics) return;
    
    const bounds = this.physics.world.bounds;
    const margin = 100;
    const x = Phaser.Math.Between(bounds.x + margin, bounds.right - margin);
    const y = Phaser.Math.Between(bounds.y + margin, bounds.bottom - margin);

    const bonusSelected = bonusGroup.create(x, y, bonuses[bonus]);
    bonusSelected.setBounce(0.2);
    bonusSelected.setScale(1.5);
    bonusSelected.bonusValue = 10;

    this.tweens.add({
      targets: bonusSelected,
      alpha: 0.2,
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: bonusSelected,
      scaleX: 1.7,
      scaleY: 1.7,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: bonusSelected,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    });

    this.time.delayedCall(8000, () => {
      if (bonusSelected && bonusSelected.active) {
        this.tweens.killTweensOf(bonusSelected);
        bonusSelected.destroy();
      }
    });

    return bonusSelected;
  }

  function collectBonus(player, bonusFood) {
    if (!bonusFood || !bonusGroup) return;
    
    bonusGroup.scene.tweens.killTweensOf(bonusFood);
    bonusFood.destroy();
    let bonusCollected = bonusFood.texture.key;

    if (this.onBonusCollected) {
      this.onBonusCollected(bonusCollected);
    }

    if (bonusCollected === "bonus-food") {
      this.onFoodCollected(10);
      const plusTen = this.add.sprite(player.x,player.y, "plus-ten");
      plusTen.setScale(.67);

      this.tweens.add({
        targets: plusTen,
        alpha: 0,
        duration: 1300,
        y: '-=300',
        onComplete: () => plusTen.destroy()
      });
    }
    if (bonusCollected === "bonus-speed") {
      speedBonus = true;

      this.time.delayedCall(12000, () => {
        speedBonus = false;
        this.onBonusCollected("");
      })
    }
  }

  }, []);

  // Pause/resume the scene when quitButton changes without tearing down the whole Phaser game
  useEffect(() => {
    
    const scene = sceneRef.current;
    if (!scene) return; 
    if (quitButton) {
      scene.scene.pause();
    } else {
      scene.scene.resume();
    }
  }, [quitButton]);

  return <div ref={phaserRef} style={{ width: '100%', height: '101vh' }} />;
}

export default StartGame;
