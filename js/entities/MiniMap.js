game.MiniMap = me.Entity.extend({
    init: function (x, y, settings){
     this._super(me.Entity, "init", [x, y, {
        image: "minimap",
        width: 699,
        height: 141,
        spritewidth: "699",
        spriteheight: "141",
        getShape: function(){
            return (new me.Rect(0, 0, 800, 162)).toPolygon();
        }
        
     }]);
 this.floating = true;
    }
});