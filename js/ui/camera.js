var zoom = 2;
var x = 0;
var y = 0;
var objects = [];
var draw = function(objs) {
    objects.forEach(function(oldObject) { 
        if (!objs.reduce(function(value, newObject) { 
            return (oldObject.id === newObject.id || value); 
        }, false) && oldObject.dom) {
            oldObject.dom.kill();
            delete oldObject.dom;
        }
    });
    objects = objs;
    objects.forEach(function(obj) { if (obj.dom && obj.dom.draw) obj.dom.draw(); });
};

module.exports = {
    xcoord: function(coord) {
        return zoom * (coord - x + 100);
    },
    ycoord: function(coord) {
        return zoom * (coord - y + 100);
    },
    dim: function(dim) {
        return dim * zoom;
    },
    setZoom: function(newZoom) { 
        zoom += newZoom / 100;
        draw(objects);
    },
    setPos: function(newX, newY) {
        x = newX;
        y = newY;
    },
    draw: draw
    //addObject: function(obj) {
        //objects.push(obj);
    //},
};
