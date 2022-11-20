function updateGameStatus(status) {
    // "1" -> Passed, "0" -> In Progress
    localStorage.setItem("Game Status", status);
}
function isGameFinished() {
    return localStorage.getItem("Game Status") * 1 === 1;
}
setTimeout(function () {
    // canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    // Classes are hoisted but uninitialized until runtime
    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                if ((e.key === "ArrowUp" || e.key === "ArrowDown")
                    && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                }
                // } else if (e.key === 'd') {
                //     this.game.debug = !this.game.debug;
                // }
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });
        }
    }
    class Particle {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('candy');
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * -15;
            this.gravity = 0.5;
            this.markedForDeletion = false;
            this.angle = 0;
            this.va = Math.random() * 0.2 - 0.1;    // rotation angle velocity
            this.bounced = 0;
            this.bottomBounceBoundary = Math.random() * 80 + 60;
        }
        update() {
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;
            if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markedForDeletion = true;
            if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 2) {
                this.bounced++;
                this.speedY *= -0.5;
            }
        }
        draw(context) {
            context.save();
            context.translate(this.x, this.y);  // move rotation center point to the center of the particle
            context.rotate(this.angle);
            context.drawImage(this.image, 0, 0, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size);
            context.restore();
        }
    }
    class Player {
        constructor(game) {
            this.game = game;
            this.width = 150.25;
            this.height = 100;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 4;
            this.speedY = 0;
            this.maxSpeed = 3;
            this.health = 5;
            this.image = document.getElementById('player');
            this.fps = 30;
            this.interval = 1500 / this.fps;
            this.timer = 0;
        }
        update(deltaTime) {
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;
            // vertical boundaries
            if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
            else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
            // sprite animation
            if (this.timer > this.interval) {
                this.frameX++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
            if (this.frameX >= this.maxFrame) {
                this.frameX = 0;
            }
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            // drawImage() parameters:  
            // sx, sy, sw, sh -> cropped out image source dimensions (area to crop out from source image)
            // dx, dy, dw, dh -> specify where to draw the cropped out image on the canvas
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }
    class MovingEnemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            // this.speedX = Math.random() * -3.5 - 0.5;
            this.speedX = -7;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 5;
            this.fps = 30;
            this.interval = 1500 / this.fps;
            this.timer = 0;
        }
        update(deltaTime) {
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) this.markedForDeletion = true;
            // sprite animation
            if (this.timer > this.interval) {
                this.frameX++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
            if (this.frameX >= this.maxFrame) {
                this.frameX = 0;
            }
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            if (this.game.debug) {
                context.font = '20px Helvetica';
            }
        }
    }
    class StillEnemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -0.3 - 0.5;
            this.markedForDeletion = false;
        }
        update() {
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) this.markedForDeletion = true;
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            if (this.game.debug) {
                context.font = '20px Helvetica';
            }
        }
    }
    class Cloud1 extends StillEnemy {
        constructor(game) {
            super(game);
            this.width = 150;
            this.height = 89;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('cloud1');
        }
    }
    class Cloud2 extends StillEnemy {
        constructor(game) {
            super(game);
            this.width = 150;
            this.height = 67;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('cloud2');
        }
    }
    class Cloud3 extends StillEnemy {
        constructor(game) {
            super(game);
            this.width = 150;
            this.height = 79;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('cloud3');
        }
    }
    class Bird1 extends MovingEnemy {
        constructor(game) {
            super(game);
            this.width = 45.6;
            this.height = 45;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('bird1');
        }
    }
    class Bird2 extends MovingEnemy {
        constructor(game) {
            super(game);
            this.width = 45.6;
            this.height = 45;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('bird2');
        }
    }
    class House extends StillEnemy {
        constructor(game) {
            super(game);
            this.width = 150;
            this.height = 150;
            this.y = this.game.height - this.height;
            this.image = document.getElementById('house');
            this.score = 10;
            this.type = "House";
        }
    }
    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 888;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if (this.x <= -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModifier;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }
    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1.5);
            this.layers = [this.layer1, this.layer2];
        }
        update() {
            this.layers.forEach(layer => layer.update());
        }
        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }
    class Explosion {
        constructor(game, x, y) {
            this.game = game;
            this.frameX = 0;
            this.spriteWidth = 200;
            this.spriteHeight = 200;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width * 0.5;
            this.y = y - this.height * 0.5;
            this.fps = 30;
            this.timer = 0;
            this.interval = 1000 / this.fps;
            this.markedForDeletion = false;
            this.maxFrame = 8;
        }
        update(deltaTime) {
            this.x -= this.game.speed;
            if (this.timer > this.interval) {
                this.frameX++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
            if (this.frameX > this.maxFrame) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }
    class SmokeExplosion extends Explosion {
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById('smokeExplosion');
        }
    }
    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = "Bangers";
            this.color = "white";
        }
        draw(context) {
            context.save(); // saves the entire state of canvas at the point of time
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            // score
            context.fillText('Score: ' + this.game.score, 20, 40);
            // health
            context.fillText('Health: ' + this.game.player.health, 20, 80);
            // game over messages
            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score >= this.game.winningScore && this.game.player.health > 0) {
                    message1 = 'Well Done!';
                    message2 = 'You have delivered all presents!';
                    setTimeout(() => updateGameStatus("1"), 2000);
                } else {
                    message1 = 'Too Bad!';
                    message2 = 'Good attempt, Please Try Again!';
                    setTimeout(() => this.game.reset(), 2000);
                }
                context.font = '70px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
            context.restore();  // restore the most recently saved canvas state (if no saved, does nothing)
        }
    }
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.particles = [];
            this.explosions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1500;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 6;
            this.speed = 1;
            this.debug = false;
        }
        update(deltaTime) {
            if (this.score >= this.winningScore || this.player.health <= 0) this.gameOver = true;
            this.background.update();
            this.background.layer3.update();
            this.player.update(deltaTime);
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.explosions.forEach(explosion => explosion.update(deltaTime));
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (this.checkCollision(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                    this.addExplosion(enemy);
                    if (enemy.type === "House") {
                        for (let i = 0; i < enemy.score; i++) {
                            this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                        }
                        this.score++;
                        this.speed += .5;
                    }
                    else {
                        if (!this.gameOver) this.player.health--;
                    }
                }
            })
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context) {
            this.background.draw(context);
            this.background.layer3.draw(context);
            this.ui.draw(context);
            this.player.draw(context);
            this.particles.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
            this.explosions.forEach(explosion => {
                explosion.draw(context);
            })
        }
        reset() {
            this.background = new Background(this);
            this.player = new Player(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.particles = [];
            this.explosions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 6;
            this.speed = 1;
            this.debug = false;
        }
        addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.2) this.enemies.push(new Cloud1(this));
            else if (randomize < 0.4) this.enemies.push(new Cloud2(this));
            else if (randomize < 0.5) this.enemies.push(new House(this));
            else if (randomize < 0.6) this.enemies.push(new Bird2(this));
            else if (randomize < 0.8) this.enemies.push(new Bird1(this));
            else this.enemies.push(new Cloud3(this));
            // this.enemies.push(new House(this));
        }
        addExplosion(enemy) {
            this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
        }
        checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y
            )
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    // animation loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;   // timeStamp auto-generated by requestAnimationFrame()
        ctx.clearRect(0, 0, canvas.width, canvas.height);   // clear screen
        game.draw(ctx);
        game.update(deltaTime);
        !isGameFinished() ? requestAnimationFrame(animate) : "";
    }
    animate(0);
}, 0)