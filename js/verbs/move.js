

module.exports = function(obj) {
    return function(area) {
        obj.area.removeInventory(obj);
        obj.area = area;
        obj.area.addInventory(obj);
    };
};
