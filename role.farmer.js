var rolefarmer = {

    /** @param {Creep} creep **/
    run: function(creep, sources, targets) {
	   if(!creep.memory.havesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.havesting = true;
            creep.say('🔄 harvest');
	    }
	    if(creep.memory.havesting && creep.store.getFreeCapacity() == 0) {
	        creep.memory.havesting = false;
	        creep.say('🔨 transfer');
	    }
	    if(creep.memory.havesting) {
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
        else {
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // console.log("now I am going to" + targets[0]);
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = rolefarmer;