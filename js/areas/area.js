var makeContainer = require('../make/Container.js');
var makeId = require('../make/Id.js');
var makeVisible = require('../make/Visible.js');
var World = require('../world.js');

module.exports = function(options) {

    var area = options;

    area.type = 'area';
    area.light = 1;
    if (area.img) area.img = new Image(area.img);
    
    makeContainer(area);
    makeId(area);


    World.addInventory(area);
    
    return area;

};
