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

   

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
