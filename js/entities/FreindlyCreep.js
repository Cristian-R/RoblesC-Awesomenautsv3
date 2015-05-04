game.FreindlyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "creep2",
                width: 128,
                height: 128,
                spritewidth: "128",
                spriteheight: "128",
                getShape: function() {
                    return (new me.Rect(0, 0, 128, 128)).toPolygon();
                }

            }]);

        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        //this.attacking lets us know if the enemy is attacking
        this.attacking = false;
        this.lastAttacking = new Date().getTime();
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);

        this.type = "FreindlyCreep";

        this.renderable.addAnimation("idle", [3]);
        this.renderable.addAnimation("walk", [38, 39, 40, 41, 42, 43], 80);
        
        this.renderable.setCurrentAnimation("idle");
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;

    },
    update: function(delta) {
        if (this.health <= 0) {


            me.game.world.removeChild(this);
        }

        this.now = new Date().getTime();

        this.body.vel.x += this.body.accel.x * me.timer.tick;
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);


        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === "EnemyBase") {
            this.attacking = true;
            this.body.vel.x = 0;
            this.pos.x = this.pos.x + 1;
            if ((this.now - this.lastHit >= game.data.enemyCreepAttackTimer)) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.enemyCreepAttack);

            }
        } else if (response.b.type === "EnemyCreep") {
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;

            this.attacking = true;

            if (xdif > 0) {

                this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;
            }
            if ((this.now - this.lastHit >= game.data.enemyCreepAttackTimer) && xdif > 0) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.enemyCreepAttack);

            }
        }
    }
});