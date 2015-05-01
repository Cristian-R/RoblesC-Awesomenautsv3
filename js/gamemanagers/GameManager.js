game.ExperienceManager = Object.extend({
  init: function(x, y, settings){
      this.alwaysUpdate = true;
      this.gameover = false;
  },
  
  update: function(){
      if(game.data.win === true && !this.gameover){
          this.gameOver(true);
          //checks when game is over
      }else if(game.data.win === false && !this.gameover){
         this.gameOver(false);
         //
         session_destroy();
         
      }
      
      return true;
  },
  
  gameOver: function(win){
      if(win, true){
          
         game.data.exp += 10; 
      }else{
          game.data.exp += 1;
      }//adds exp 
      //if (you win the game){
     //      you will get 10 exp 
    //      }else if{
   //           you will only get one if you lose
  //        };//larrimore this is the language you know best :)
          console.log(game.data.exp);
          
          this.gameover = true;
          
          me.save.exp = game.data.exp;
          
  
          
            $.ajax({
                type: "POST",
                url: "php/controller/save-user.php",
                data:{
                    exp: game.data.exp,
                    exp1: game.data.exp1,
                    exp2: game.data.exp2,
                    exp3: game.data.exp3,
                    exp4: game.data.exp4
                },
                dataType: "text"
            })//saves exp
               .success(function(response){
                   if(response === "true"){
                       me.state.change(me.state.MENU);
                   }else{
                       alert(response);
                   }
            })
               .fail(function(response){
                    alert("Fail");  
            });
    
       
    }
});

