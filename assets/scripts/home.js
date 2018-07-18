cc.Class({
    extends: cc.Component,

    properties: {

        bgmusic: {
            default: null,
            url: cc.AudioClip
        },
       
    },

    
    onLoad: function () {

        cc.audioEngine.playMusic(this.bgmusic, true);

    },

    newBegin: function(){
        cc.director.loadScene('fighting');
        cc.audioEngine.end();
    },

   
    // update: function (dt) {

    // },
});
