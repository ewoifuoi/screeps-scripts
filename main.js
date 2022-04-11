var roleHarvester = require('role.farmer');
var roleUpgrader = require('role.upgrader');
var roleUpgrader2 = require('role.upgrader2');
var roleBuilder = require('role.builder');
var auto_check = require('func.auto_check');

module.exports.loop = function () {

    var tower = Game.getObjectById('3c8d1242c3f3fb431a4de5bc');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    
    
    auto_check.run();//
    
    
    var targets = Game.spawns['716'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) && 
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'farmer') {
            if(targets.length > 0) {
                roleHarvester.run(creep);
            }
            // else roleUpgrader2.run(creep);
            else roleBuilder.run(creep);
            
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            // roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {

            if(targets.length > 0) {
                roleHarvester.run(creep);
            }
            // else roleUpgrader2.run(creep);
            else roleBuilder.run(creep);
        }
    }
}