
module.exports = function(obj) {

    var inventory = [];

    obj.listInventory = function() {
        return inventory;
    };

    obj.addInventory = function(obj) {
        inventory.push(obj);
    };

    obj.removeInventory = function(obj) {
        inventory = inventory.filter(function(item) { return (item.id !== obj.id) });
    }

    obj.getInventory = function(id) {
        return inventory.filter(function(item) { return ((!!id.length) ? (id.indexOf(item.id) > -1) : item.id === id) });
    }
    
    obj.calculateEncumbrance = function(obj) {
        obj.encumbrance = obj.listInventory().reduce(function(encumbrance, item) { encumbrance += item.encumbrance; }, 0);
        obj.inventoryWeight = obj.listInventory().reduce(function(weight, item) { weight += item.weight; }, 0);
    };

    return obj;
};
