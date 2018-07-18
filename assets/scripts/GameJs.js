var fightData = require('fightData');
var AllUnitData = require('AllUnitData');
cc.Class({
    extends: cc.Component,

    properties: {
        Ui: {
            default: null,
            type: cc.Node
        },

        summonStation: {
            default: null,
            type: cc.Prefab
        },

        map: {
            default: null,
            type: cc.Node
        },

        unit: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        //对怪物数组进行初始化
        for(var i = 0; i < ms.maxGroupNum; i++){
            fightData.selfGroup.push([]);
        }

        //开启碰撞
        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        //this.collisionManager.enabledDebugDraw = true;

        //UI界面初始化
        this.UiJs = this.Ui.getComponent('UiJs');
        this.UiJs.init(this);

        //初始化己方召唤台
        this.generateSummonStation(ms.Team.Team0, this.map, cc.p(-900, 0), this.UiJs);
        //初始化敌方方召唤台
        this.generateSummonStation(ms.Team.Team1, this.map, cc.p(900, 0), this.UiJs);

        //召唤台是否开始召唤的标志
        this.startSummon = false;
        //召唤的进度
        this.summonProgress = 0;

    },

    /**
     * 在战场map生成召唤台
     * @param {ms.Team} team 召唤台所属的队伍
     * @param {cc.Node} parentNode 召唤台节点所属的父节点，一般为this.map
     * @param {cc.Vec2} position 召唤台的位置，实际位置会在position附近随机
     * @param UiJs 传递ui界面管理的总脚本, this.UiJs
     */
    generateSummonStation (team, parentNode, position, UiJs) {
        var summonStation = cc.instantiate(this.summonStation);
        summonStation.parent = parentNode;
        summonStation.setPosition(position.x * ms.randomNormal(), position.y * ms.randomNormal());
        summonStation.getComponent('summonStationDataControl').init(team, UiJs);
    },

    /**
     * 确定召唤后在召唤台附近生成怪物(也可以用来生成召唤士，初始每方一个召唤士，召唤士死亡或者召唤台被打爆就输了)
     * @param {Int} num 怪物编号 (目前1-9)
     * @param {ms.UnitType} unitType 怪物的类型: Master(怪物), Summoner(召唤士)
     * @param {Int} group 怪物所属的分组 (目前1-8)
     * @param {Int} summonNum 召唤相同怪物的数量,没限制
     * @param {ms.Team} team 怪物所属的队伍
     * @param {cc.Vec2} position 召唤怪物的召唤台的位置，怪物实际位置会在position附近随机
     */
    generateMonster (num, unitType, group, summonNum, team, position) {
        //本地化参数
        this.num = num;
        this.unitType = unitType;
        this.group = group;
        this.summonNum = summonNum;
        this.team = team;
        this.position = position;

        this.summonTimer = 0;
        this.startSummon = true;
        this.summon = AllUnitData[num].summon;   
    },

    summon1Monster (num, unitType, group, team, map, position, UiJs) {
        var unit = cc.instantiate(this.unit);
        unit.parent = this.map;
        unit.setPosition(position.x + ms.summonedX * cc.randomMinus1To1(), position.y + ms.summonedY * cc.randomMinus1To1());
        unit.getComponent('unitDataControl').init(num, unitType, group, team, map, UiJs); 
    },

    update (dt) {
        //如果开始召唤
        if(this.startSummon){
            this.summonTimer += dt;
            this.summonProgress = this.summonTimer / this.summon;
            //召唤进度实时更新
            this.UiJs.stationInfoJs.summoningProgress.progress = this.summonProgress;
            if(this.summonTimer >= this.summon){
                this.summon1Monster(this.num, this.unitType, this.group, this.team, this.map, this.position, this.UiJs);
                this.summonTimer = 0;
                this.summonNum--;
                if(this.summonNum <= 0){
                    //召唤结束
                    this.startSummon = false;
                    this.UiJs.summonStationDataControl.summonStationState = ms.SummonStationState.Idle;
                    this.UiJs.summonFinish();
                }
            }
        }

    },

    

    
});
