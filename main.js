var roleHarvester = require('role.farmer');
var roleUpgrader = require('role.upgrader');
var roleUpgrader2 = require('role.upgrader2');
var roleBuilder = require('role.builder');
var auto_check = require('func.auto_check');
var roleKeeper = require('role.towerKeeper');

module.exports.loop = function () {
    
    const creepsName = Object.keys(Game.creeps)// 清理 死去 creep 内存
    Object.keys(Memory.creeps).forEach(name => {
        if (!creepsName.includes(name)) {
            delete Memory.creeps[name]
        }
    });
    
    
    
    
    var emergency = false;  // 紧急模式
    var tower = Game.getObjectById('6254e60c2740d17db2fe533f'); // 一号炮塔
    if(tower) {
        var attacked = false;
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {                // 炮塔攻击
            tower.attack(closestHostile);
            emergency = true;
            attacked = true;
        }
        else {
            emergency = false;
        }
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax) && (structure.hits < 10000);    // 炮塔给建筑 回血 (墙上限 10000)
            }
        });
        if(tower.store[RESOURCE_ENERGY] > 800) {            // 炮塔 存量 > 800 , 启动回血模式
            if(closestDamagedStructure && !attacked) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
    
    auto_check.run();       // 自动 补充 creep
    
    
    var targets = Game.spawns['716'].room.find(FIND_STRUCTURES, {           // 能量 需求 单位
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN) && 
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });

   
    var sources = Game.spawns['716'].room.find(FIND_SOURCES);   // 资源 单位

    for(var name in Game.creeps) {          // 遍历 每个 creep , 根据 其中内存 role 字段 进行分工
        var creep = Game.creeps[name];
        if(creep.memory.role == 'farmer') {
            if(emergency == true) {
                roleKeeper.run(creep, tower, sources[1]);
            }
            else if(targets.length > 0) {
                roleHarvester.run(creep, sources[1], targets);
            }
            else if(tower.store[RESOURCE_ENERGY] < 1000) {
                roleKeeper.run(creep, tower, sources[1]);
            }
            // else roleUpgrader2.run(creep);
            // else roleBuilder.run(creep);
            
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            // roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            if(emergency == true) {
                roleKeeper.run(creep, tower, sources[1]);
            }
            else if(targets.length > 0) {
                roleHarvester.run(creep, sources[1], targets);
            }
            else roleUpgrader2.run(creep);
            // else roleBuilder.run(creep);
        }
        if(creep.memory.role == 'keeper') {
            roleKeeper.run(creep, tower, sources[0]);
            // roleHarvester.run(creep, sources[1], targets);
        }
    }
}