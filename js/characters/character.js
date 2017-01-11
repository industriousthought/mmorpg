var view = require('../ui/view.js');
var makeContainer = require('../make/Container.js');
var look = require('../verbs/look.js');
var getItem = require('../verbs/getItem.js');
var makeMobile = require('../make/Mobile.js');
var makeId = require('../make/Id.js');
var makeVisible = require('../make/Visible.js');
var World = require('../world.js');

module.exports = function(options) {


    var character = options;
    character.inventoryWeight;
    character.weightLimit = 80;
    character.encumbranceLimit = 10;

    character.verbs = {};
    makeId(character);
    makeMobile(character);
    makeContainer(character);

    character.calculateEncumbrance(character);
    
    character.verbs.getItem = getItem(character);
    character.verbs.look = look(character);
    character.view = view(character);
    character.verbs.look();

    character.verbs.go = function(area) {
        if (character
            .area
            .listInventory()
            .filter(function(item) { if (item.type === 'path') return true;})
            .reduce(function(test, item) { if (item.link(area).id === character.area.id || test) return true; }, false)) {

            character.move(area);
            character.verbs.look();
        }

    };

    World.addInventory(character);

    return character;
};
