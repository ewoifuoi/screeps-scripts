/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('func.auto_check');
 * mod.thing == 'a thing'; // true
 */
 
var check = {
    run: function() {
        var farmer = _.filter(Game.creeps, (creep) => creep.memory.role == 'farmer');
        if(farmer.length < 2) {
            var newName = 'farmer' + Game.time;
            // console.log('Spawning new harvester: ' + newName);
                Game.spawns['716'].spawnCreep([WORK,CARRY,MOVE, WORK, MOVE], newName, 
                {memory: {role: 'farmer'}});
        }
    
        var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if(builder.length < 2) {
            var newName = 'builder' + Game.time;
            // console.log('Spawning new harvester: ' + newName);
            Game.spawns['716'].spawnCreep([WORK,CARRY,MOVE, WORK, MOVE], newName, 
                {memory: {role: 'builder'}});
        }
        
        var grader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        // console.log('Harvesters: ' + harvesters.length);

        if(grader.length < 4) {
            var newName = 'upgrader' + Game.time;
            // console.log('Spawning new harvester: ' + newName);
            Game.spawns['716'].spawnCreep([WORK,CARRY,MOVE, WORK, MOVE, CARRY, CARRY, MOVE, WORK, CARRY], newName, 
                {memory: {role: 'upgrader'}});
        }
    
        
        
        var keeper = _.filter(Game.creeps, (creep) => creep.memory.role == 'keeper');
        // console.log('Harvesters: ' + harvesters.length);

        if(keeper.length < 2) {
            var newName = 'keeper' + Game.time;
            // console.log('Spawning new harvester: ' + newName);
                Game.spawns['716'].spawnCreep([WORK,CARRY,MOVE, WORK, MOVE], newName, 
                {memory: {role: 'keeper'}});
        }
    
        if(Game.spawns['716'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['716'].spawning.name];
            Game.spawns['716'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['716'].pos.x + 1, 
                Game.spawns['716'].pos.y, 
            {align: 'left', opacity: 0.8});
        }
        
    }
};


module.exports = check;