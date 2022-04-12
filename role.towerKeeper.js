var roleKeeper = {

    /** @param {Creep} creep **/
    run: function(creep, tower, source) {
	   if(!creep.memory.havesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.havesting = true;
            creep.say('🔄 harvest');
	    }
	    if(creep.memory.havesting && creep.store.getFreeCapacity() == 0) {
	        creep.memory.havesting = false;
	        creep.say('📌 keep');
	    }

	    if(creep.memory.havesting) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
        else {
            // if(tower.store.getFreeCapacity() > 0) {
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            // }
        }
	}
};

module.exports = roleKeeper;