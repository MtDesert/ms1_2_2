//怪物主要数据和控制的脚本
var AllUnitData = require('AllUnitData');
var fightData = require('fightData');
cc.Class({
    extends: cc.Component,

    properties: {
        //怪物召唤完成的登场动画
        debutAnim: {
            default: null,
            type: cc.Prefab
        },
        //怪物攻击弹道的预制体
        bullet: {
            default: null,
            type: cc.Prefab
        },
        //被暴击和回血的label显示
        critRecvory: {
            default: null,
            type: cc.Prefab
        },
        //怪物动画组件取得
        anim: {
            default: null,
            type: cc.Animation
        },

        //怪物是否被选中，选中的会显示血条
        _selected: false,
        selected: {
            get () {
                return this._selected;
            },
            set (value) {
                if (value !== this._selected) {
                    this._selected = value;
                    switch (this._selected){
                        case true:
                            this.node.getChildByName('maxHp').opacity = 255;
                            break;
                        case false:
                            this.node.getChildByName('maxHp').opacity = 0;
                            break;
                    } 
                }
            },
            visible: false,
        },
    },

    //怪物编号(1-9)，类型(Master,Summoner)，分组(1-8),所属队伍(Team0为玩家，其他为敌人)，map战场节点，UiJs画面控制总脚本
    init (num, unitType, group, team, map, UiJs) {

        this.group = group;
        this.team = team;
        this.map = map;
        this.unitType = unitType;
        //脚本本地化
        this.UiJs = UiJs;


        
        //定义并初始化怪物的各种基本属性(从怪物数据配置表取得的数据，18个数据)，并对某些数据进行随机扰动
        this.num = AllUnitData[num].num;
        this.mp = AllUnitData[num].mp;
        this.summon = AllUnitData[num].summon;
        this.name = AllUnitData[num].name;
        this.lv = AllUnitData[num].lv;
        this.race = AllUnitData[num].race;
        this.moveType = AllUnitData[num].moveType;
        this.attackType = AllUnitData[num].attackType;
        this.attackProperty = AllUnitData[num].attackProperty;
        this.magicPhysic = AllUnitData[num].magicPhysic;
        //随机波动数据
        this.physicDamage = AllUnitData[num].physicDamage * ms.randomNormal();
        this.magicDamage = AllUnitData[num].magicDamage * ms.randomNormal();
        this.hp = AllUnitData[num].hp * ms.randomNormal();
        this.skill = AllUnitData[num].skill * ms.randomNormal();
        this.attack = AllUnitData[num].attack * ms.randomNormal();
        this.speed = AllUnitData[num].speed * ms.randomNormal();
        this.range = AllUnitData[num].range * ms.randomNormal();
        this.move = AllUnitData[num].move * ms.randomNormal();

        //技能冷却计时
        this.skillTime = 0;

        //将怪物信息传入对应的分组
        fightData.selfGroup[group - 1].push(this);
        //被攻击的碰撞节点分组
        this.node.group = ms.Team[team];
        //根据射程调整碰撞组件半径
        this.getComponent(cc.CircleCollider).radius = ms.rangeBase + ms.rangeRate * this.range;
        //根据move值得到移动速度
        this.moveSpeed = ms.moveBase + ms.moveRate * this.move;

        //根据unitType和team决定光环的显隐和颜色
        this.halo = this.node.getChildByName('halo');
        if(this.unitType === ms.UnitType.Summoner){
            this.halo.active = true;
            //召唤士单位，很肉，输出很低
            this.hp += ms.summonerExtraHp;
            this.attack *= ms.summonerSubtractionAttack;
            if(this.team === ms.Team.Team0){
                this.halo.color = cc.Color.WHITE;
            } else {
                this.halo.color = cc.Color.RED;
            }
        } else {
            this.halo.active = false;
        }
        
        //初始化单位的hp
        this.maxHp = this.hp;
        this.currentHp = this.hp;
        



        //播放怪物的出场动画
        var debutAnim = cc.instantiate(this.debutAnim);
        debutAnim.parent = this.map;
        debutAnim.setPosition(this.node.position);
        debutAnim.getComponent('debutAnimJs').init(this.node);
        //为怪物加上24个动画
        ms.makeClipsToAnimation(this.num, this.anim);
        //关闭怪物节点，动画完成后再激活
        this.node.active = false;
    },

    //显示怪物信息
    thisMonsterSelected () {
        //选中状态变为true
        this.selected = true;
        //显示对应的面板
        this.UiJs.monsterSelected(this.team);

        //显示当前选中怪物的所有属性信息，己方还可以控制
        var self = this;
        this.monsterData = {
            race: self.race,
            lv: self.lv,
            monsterName: self.name,
            moveType: self.moveType,
            attackType: self.attackType,
            attackProperty: self.attackProperty,
            magicPhysic: self.magicPhysic,
            physicLevelNum: self.physicDamage,
            magicLevelNum: self.magicDamage,
            attack: self.attack,
            speed: self.speed,
            range: self.range,
            move: self.move,
            currentHp: self.currentHp,
            maxHp: self.maxHp,
            num: self.num,
            skill: self.skill,
            skillTime: self.skillTime,  
        };
        //显示信息
        this.UiJs.showMonsterInfo(this.monsterData);
    },

    
    update: function (dt) {
        //技能进度条的更新
        this.skillTime += dt;
        this.skillTime = cc.clampf(this.skillTime, 0, this.skill);
    },
});
