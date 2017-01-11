var listFilter = function(blockage) {//require('../filters/list.js');
    return function(item) {
        if (item.visibility > blockage) return true;
        return false;
    };
};

module.exports = function(obj) {
    return function() {
        var pathsRendered = [];
        var currentArea = obj.area;
        var newObjects = [];
        var objects = [{type: 'location', area: obj.area}].concat(obj.area.listInventory().filter(listFilter(1 - obj.area.light)));
        var processObjs = function(item, index, array) { 
            if (item.type && item.type === 'path') {
                newObjects = newObjects.concat(follow(item));
            }
            if (item.id === obj.id) objects[index] = {type: 'self', me: item};

        };

        var follow = function(path) {
            
            if (pathsRendered.indexOf(path.id) !== -1) return [];
            pathsRendered.push(path.id);

            var opacity = (path.primaryObstruction) ? path.primaryObstruction.opacity : 0;
            path.obstructions[0].listInventory().concat(path.obstructions[1].listInventory()).forEach(function(item) {
                opacity += item.opacity || 0;
            });
            if (opacity >= 1) return [];
            var list = path.link(obj.area).listInventory().filter(listFilter(opacity));
            list = list.filter(function(item) { return (item.id !== path.id); });
            list.push(path.link(obj.area));

            currentArea = path.link(currentArea);
            list.forEach(processObjs);
            return list;

        };
        objects.forEach(processObjs);
        objects = objects.concat(newObjects);
        objects.forEach(function(item, index, array) { 
            var e; 
            if (item.type === 'area') { 
                e = item; 
                array.splice(index, 1); 
                array.splice(0, 0, e); 
            } 
        } ); //sort(function(obj) { if (obj.type === 'area') return -1; });
        obj.view(objects);
        return objects;
    };
};
