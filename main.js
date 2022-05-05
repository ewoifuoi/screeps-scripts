var roleHarvester = require('role.farmer');
var roleUpgrader = require('role.upgrader');
var roleUpgrader2 = require('role.upgrader2');
var roleBuilder = require('role.builder');
var auto_check = require('func.auto_check');
var roleKeeper = require('role.towerKeeper');
var roleScout = require('role.scout');

module.exports.loop = function () {
    
    const creepsName = Object.keys(Game.creeps)// 清理 死去 creep 内存
    Object.keys(Memory.creeps).forEach(name => {
        if (!creepsName.includes(name)) {
            delete Memory.creeps[name]
        }
    });
    
    
    
    
    var emergency = false;  // 紧急模式
    var towers = [Game.getObjectById('626b596604c4692f415de104'), Game.getObjectById('62732539c9328e11a51297db')]; // 炮塔
    var hungry_tower = null;
    for(var i = 0; i <= towers.length; i++){
        if(towers[i]) {
            var attacked = false;
            var closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {                // 炮塔攻击
                towers[i].attack(closestHostile);
                emergency = true;
                attacked = true;
            }
            else {
                emergency = false;
            }
            var closestDamagedStructure = towers[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < structure.hitsMax) && (structure.hits < 10000);    // 炮塔给建筑 回血 (墙上限 10000)
                }
            });
            if(towers[i].store[RESOURCE_ENERGY] > 400) {            // 炮塔 存量 > 800 , 启动回血模式
                if(closestDamagedStructure && !attacked) {
                    towers[i].repair(closestDamagedStructure);
                }   
            }
            if(towers[i].store[RESOURCE_ENERGY] != 1000) {
                hungry_tower = towers[i];
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
            var build_targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            // if(emergency == true) {
                // roleKeeper.run(creep, tower, sources[1]);
            // }
            if(targets.length > 0) {
                roleHarvester.run(creep, sources[1], targets);
                // console.log(targets);
            }
            // else if(tower.store[RESOURCE_ENERGY] < 1000) {
            //     roleKeeper.run(creep, tower, sources[1]);
            // }
            // else roleUpgrader2.run(creep);
            else if(build_targets.length > 0) roleBuilder.run(creep);
            else {
                roleUpgrader2.run(creep);
            }
            
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            // roleHarvester.run(creep, sources[1], targets);
        }
        if(creep.memory.role == 'builder') {
            
            var build_targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            // if(emergency == true) {
                // roleKeeper.run(creep, tower, sources[1]);
            // }
            if(targets.length > 0) {
                roleHarvester.run(creep, sources[1], targets);
            }
            // else if(tower.store[RESOURCE_ENERGY] < 1000) {
            //     roleKeeper.run(creep, tower, sources[1]);
            // }
            // else roleUpgrader2.run(creep);
            else if(build_targets.length > 0) roleBuilder.run(creep);
            else {
                roleUpgrader2.run(creep);
            }
        }
        if(creep.memory.role == 'keeper') {
            // 
            var labor = _.filter(Game.creeps, (creep) => {return creep.memory.role == 'farmer' || creep.memory.role == 'builder'});
            if(labor.length == 0) {
                roleHarvester.run(creep, sources[1], targets);
            }
            else if(hungry_tower) {
                roleKeeper.run(creep, hungry_tower, sources[1]);
            }
            else {
                roleUpgrader2.run(creep);
                // console.log("!!!");
            }
            
        }
        if(creep.memory.role == 'scout') {
            roleScout.run(creep, Game.flags['scout']);
        }
    }
}