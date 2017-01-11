var makeContainer = require('../make/Container.js');
var makeId = require('../make/Id.js');
var makeVisible = require('../make/Visible.js');
var World = require('../world.js');

module.exports = function(options) {
    
    var path = options;
    path.type = 'path';
    path.visibility = 1;
    //path.areas = options.areas;
    var obstacles = [];
    makeId(path);
    makeContainer(path);
    path.obstructions = [makeContainer({}), makeContainer({})];
    
    

    path.areas.forEach(function(area) { area.addInventory(path) });

    path.link = function(area) {
        if (path.areas[0].id === area.id) return path.areas[1];
        return path.areas[0];
    };


    World.addInventory(path);

    return path;
};
