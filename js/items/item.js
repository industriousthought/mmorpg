var makeId = require('../make/Id.js');
var makeVisible = require('../make/Visible.js');
var makeMobile = require('../make/Mobile.js');
var World = require('../world.js');

module.exports = function(options) {

    var item = options;
    item.type = 'item';
    
    item.verbs = {};

    makeId(item);
    makeMobile(item);
    makeVisible(item);

    World.addInventory(item);

    return item;
};
