game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        //these are mostly all functions
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.setFlags();
        this.type = "PlayerEntity";
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.addAnimation();
        this.renderable.setCurrentAnimation("idle");
    },
    
    setSuper: function(x, y) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
    },
      
    setPlayerTimers: function() {
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastSpear = this.now;
        this.lastAttack = new Date().getTime();//havent used attack variable
    },
    
    setAttributes: function() {
        this.health = game.data.orcHealth;
        //these are basically now broken down into smaller functions
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    
    setFlags: function() {
        //these are basically now broken down into smaller functions
        this.facing = "right";
        this.dead = false;
        this.attacking = false;
    },
    
    addAnimation: function() {
        //sets animations
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },
          
    update: function(delta) {
        //this used to be bigger now its smaller :(
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();
        this.checkAbilityKeys();
        this.setAnimation();
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    checkIfDead: function() {
        if (this.health <= 0) {
            //checks when player is dead
            return true;
        }
        return false;
    },
    
    checkKeyPressesAndMove: function() {
        //checks key presses to move left right and other directions
        if (me.input.isKeyPressed("right")) {
            this.moveRight();
        }else if (me.input.isKeyPressed("left")) {
            this.moveLeft();
        }else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
            this.jump();
        }
        this.attacking = me.input.isKeyPressed("attack");
    },
    
    moveRight: function() {
        // Adds to the position of my x by the velocity
        // defined above in setVelocity() and multiplying
        // it by timer.tick.
        // me.timer.tick makes player movement look smooth.
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.facing = "right";
        this.flipX(true);
    },
    
    moveLeft: function() {
       // move left
        this.facing = "left";
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        this.flipX(false);
    },
    
    jump: function() {
        // jump!!!
        this.body.jumping = true;
        this.body.vel.y -= this.body.accel.y * me.timer.tick;
    },
    
    checkAbilityKeys: function (){
        if(me.input.isKeyPressed("skill1")){
            this.speedBurst();
        }else if(me.input.isKeyPressed("skill2")){
            //this.eatCreep();
        }else if(me.input.isKeyPressed("skill3")){
            this.throwSpear();
        }
    },
    
    speedBurst: function(){
         if (game.data.speedbursttimer*1000){
            ((game.data.playerMoveSpeed)*4);
    }
        
    },
           
    
    throwSpear: function(){
        if((this.now-this.lastSpear) >= game.data.spearTimer*1000 && game.data.ability3 > 0){
            
        this.lastspear = this.now;
        var spear = me.pool.pull("spear", this.pos.x,this.pos.y, {}, this.facing);
        me.game.world.addChild(spear, 20);
    }
    },
    
    setAnimation: function() {
        //sets animation for idle and attack
        if (this.attacking) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                // Sets the current animation to attack, once movement
                // for attack has concluded the animation returns to idle.
                this.renderable.setCurrentAnimation("attack", "idle");
                // Makes it so that the next time we start this sequence
                // we begin from the first animation, not from wherever
                // we left off when we switched to another animation.
                this.renderable.setAnimationFrame();
            }
        } else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }

        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;

    },
    
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
 
        this.collideWithEnemyBase(response);

        } else if (response.b.type === "EnemyCreep") {
        this.collideWithEnemyCreep(response);
        }
    },
    
    collideWithEnemyBase: function(response){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
                if (ydif < -40 && xdif < 70 && xdif > -35) {
                    this.body.falling = false;
                    this.body.vel.y = -1;
            }else if (xdif < -35 && this.facing === 'right' && (xdif < 0)) {
                    this.body.vel.x = 0;
            }else if (xdif < 70 && this.facing === 'left' && xdif > 0) {
                    this.body.vel.x = 0;
            }
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                    this.lastHit = this.now;
                    response.b.loseHealth(game.data.playerAttack);
                }
        },
        
    collideWithEnemyCreep: function(response){
        
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;

            this.stopMovement (xdif);
            
            if(this.checkAttack (xdif, ydif, response)){
                this.hitCreep(response);
            };
       
    },
    
    stopMovement: function (xdif){
           if (xdif > 0) {
                if (this.facing === "left") {
                    this.body.vel.x = 0;
                }
            } else {
                if (this.facing === "right") {
                    this.body.vel.x = 0;
                }
            }
    },
    
    checkAttack: function (xdif, ydif, response){
        
             if (this.renderable.isCurrentAnimation("attack") && (this.now - this.lastHit) >= game.data.playerAttackTimer
             //this is so that ...
                    && (Math.abs(ydif) <= 40) &&
                    
                    (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                    ) {
                
                this.lastHit = this.now;
                return true;
        }
            return false;
    },
    
    hitCreep: function (response){
    if (response.b.health <= game.data.playerAttack) {
                   game.data.gold += 1;
                }
                response.b.loseHealth(game.data.playerAttack);
    },

});