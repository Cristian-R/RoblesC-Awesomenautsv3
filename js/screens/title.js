game.TitleScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     **/
    onResetEvent: function() {
        me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("title-screen")), -10); // TODO
       //Above:sets the image of the title

        me.game.world.addChild(new (me.Renderable.extend({
            
            init: function() {
                this._super(me.Renderable, "init", [270, 240, 300, 50]);
                //sets colour size and location of start a new game
                this.font = new me.Font("Arial", 46, "white");
                me.input.registerPointerEvent("pointerdown", this, this.newGame.bind(this), true);
            },//larrimore: i listen to the videos so i know what evrything
            // does im might not hve time to show it on all files but ill demonstrate it here
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), 'Start a new game', this.pos.x, this.pos.y);
                //above shows the coordinates(i guess i can say) of where to place the image
            },
            update: function(dt) {
                return true;
                //updates the whoel thing so itll be able to restart 
            },
            newGame: function() {
                me.input.releasePointerEvent("pointerdown", this);
                me.state.change(me.state.NEW);
                //this line just checks if the ttext is being clicked on


            }
        })));

        me.game.world.addChild(new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, "init", [380, 340, 250, 50]);
                this.font = new me.Font("Arial", 46, "white");
                //same as above
                me.input.registerPointerEvent("pointerdown", this, this.newGame.bind(this), true);
            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), 'Continue', this.pos.x, this.pos.y);
            },
            update: function(dt) {
                return true;
            },
            newGame: function() {
                me.input.releasePointerEvent("pointerdown", this);
                //same as above 
                me.state.change(me.state.LOAD);


            }
        })));

    },
    /**	
     *  action to perform when leaving this screen (state change)
     **/
    onDestroyEvent: function() {
// nothig to destroy here : ) #peace
    }
});