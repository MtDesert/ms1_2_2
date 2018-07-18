var fightData = require('fightData');
cc.Class({
    extends: cc.Component,

    properties: {
        //召唤士头像
        summonerFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        //下光环取得
        underHalo: {
            default: null,
            type: cc.Node
        },
        //上光环取得
        upHalo: {
            default: null,
            type: cc.Node
        },

    },

    //召唤台的分组，召唤台信息脚本,召唤台血量脚本取得
    init (team, UiJs) {

        //取得召唤台的分组
        this.team = team;
        //被攻击的碰撞节点分组
        this.node.group = ms.Team[team];
        //召唤台状态标志
        this.summonStationState = ms.SummonStationState.Idle;
        
        //召唤台所有数据初始化,13个数据
        this.stationName = fightData.stationData.stationName;
        this.attackLevel = fightData.stationData.attackLevel;
        this.attackLevelNum = fightData.stationData.attackLevelNum;
        this.physicLevel = fightData.stationData.physicLevel;
        this.physicLevelNum = fightData.stationData.physicLevelNum;
        this.magicLevel = fightData.stationData.magicLevel;
        this.magicLevelNum = fightData.stationData.magicLevelNum;
        this.attack = fightData.stationData.attack;
        this.speed = fightData.stationData.speed;
        this.range = fightData.stationData.range;
        this.move = fightData.stationData.move;
        //敌方召唤台可以随机更多的hp
        if(this.team === ms.Team.Team0){
            this.maxHp = fightData.stationData.maxHp * ms.randomNormal();
            this.currentHp = this.maxHp;
        } else {
            this.maxHp = fightData.stationData.maxHp * ms.randomStrengthen();
            this.currentHp = this.maxHp;
            //敌方召唤台光环颜色随机
            this.underHalo.color = new cc.Color(255 * Math.random(), 255 * Math.random(), 255 * Math.random());
            this.upHalo.color = new cc.Color(255 * Math.random(), 255 * Math.random(), 255 * Math.random());
        }
      
        //脚本本地化
        this.UiJs = UiJs;

            

        
    },

    //显示召唤台信息
    thisStationPress () {
        //显示对应的面板,传递当前信息
        this.UiJs.summonStationPress(this);

        //根据召唤台当前的属性信息更新对应的属性面板值
        var self = this;
        this.summonStationData = {
            //属性信息
            stationName: self.stationName,
            attackLevel: self.attackLevel,
            attackLevelNum: self.attackLevelNum,
            physicLevel: self.physicLevel,
            physicLevelNum: self.physicLevelNum,
            magicLevel: self.magicLevel,
            magicLevelNum: self.magicLevelNum,
            attack: self.attack,
            speed: self.speed,
            range: self.range,
            move: self.move,
            //血量信息
            currentHp: self.currentHp,
            maxHp: self.maxHp,
            //召唤士头像
            summonerFrame: self.summonerFrame,
            //所属队伍
            team: self.team,
        };
        //显示信息
        this.UiJs.showStationInfo(this.summonStationData);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
