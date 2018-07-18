cc.Class({
    extends: cc.Component,

    properties: {
       
    },


    onLoad: function(){
        this.anim = this.getComponent(cc.Animation);
        ms.makeClipsToAnimation(5, this.anim);

        this.num = 0;



       
    },

    move: function(){
        //console.log(this.anim._clips);
        this.anim.play('move' + this.num % 8);
        
        this.num++;
    },

    attack: function(){
        this.anim.play('attack' + this.num % 8);
        
        this.num++;
    },

    die: function(){
        this.anim.play('die' + this.num % 8);
        //console.log(this.anim._clips);
        this.num++;
    },

    switch: function(){
        this.anim._clips = [];
        ms.makeClipsToAnimation(ms.randomInt(1, 9), this.anim);
        //console.log(this.anim._clips);
    },

   
    /* start: function () {
       this.anim._clips[0] = this.clip;
       this.anim.play('attack0');

    }, */

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
