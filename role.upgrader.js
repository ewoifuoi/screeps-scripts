var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrader && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrader = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrader && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrader = true;
	        creep.say('🆙 upgrade');
	    }

	    if(creep.memory.upgrader) {
	        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
	    }
	    
	}
};

module.exports = roleUpgrader;