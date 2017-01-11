module.exports = function(obj) {

    return function(item) {
        var encumbrance = obj.calculateEncumbrance();
        if (item.area.id !== obj.area.id) return false;
        if (!(encumbrance + item.encumbrance < obj.encumbranceLimit && obj.inventoryWeight + item.weight < obj.weightLimit)) {
            console.log('you cant carry it');
            return false;
        }
        item.move(character);
        return true;
    };

};
