var roleHarvester = require('role.farmer');
var roleUpgrader = require('role.upgrader');
var roleUpgrader2 = require('role.upgrader2');
var roleBuilder = require('role.builder');
var auto_check = require('func.auto_check');
var roleKeeper = require('role.towerKeeper');

module.exports.loop = function () {
    var emergency = false;
    var tower = Game.getObjectById('6254e60c2740d17db2fe533f'); // 一号炮塔
    if(tower) {
        var attacked = false;
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
            emergency = true;
            attacked = true;
        }
        else {
            emergency = false;
        }
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(tower.store[RESOURCE_ENERGY] > 800) {
            if(closestDamagedStructure && !attacked) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
    
    auto_check.run();
    
    
    var targets = Game.spawns['716'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN) && 
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });

   
    var sources = Game.spawns['716'].room.find(FIND_SOURCES);


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'farmer') {
            if(emergency == true) {
                roleKeeper.run(creep, tower, sources[1]);
            }
            else if(targets.length > 0) {
                roleHarvester.run(creep, sources[1], targets);
            }
            else if(tower.store[RESOURCE_ENERGY] < 800) {
                roleKeeper.run(creep, tower, sources[1]);
            }
            // else roleUpgrader2.run(creep);
            
            else roleBuilder.run(creep);
            
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
            // else roleUpgrader2.run(creep);
            else roleBuilder.run(creep);
        }
        if(creep.memory.role == 'keeper') {
            roleKeeper.run(creep, tower, sources[0]);
            // roleHarvester.run(creep, sources[1], targets);
        }
    }
}