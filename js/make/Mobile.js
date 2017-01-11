
var move = require('../verbs/move.js');

module.exports = function(obj) {

    obj.move = move(obj);
    obj.area.addInventory(obj);

};

