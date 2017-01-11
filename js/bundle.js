(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../make/Container.js":7,"../make/Id.js":8,"../make/Visible.js":10,"../world.js":21}],2:[function(require,module,exports){
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

},{"../make/Container.js":7,"../make/Id.js":8,"../make/Mobile.js":9,"../make/Visible.js":10,"../ui/view.js":17,"../verbs/getItem.js":18,"../verbs/look.js":19,"../world.js":21}],3:[function(require,module,exports){
var Item = require('./item.js');


module.exports = function(options) {
    var door = Item(options);
    door.closed = true;
    door.verbs.toggle = function() {
        door.closed = !door.closed;
        if (door.closed) { door.opacity = 1; } else { door.opacity = .5; }
    };
    door.opacity = 1;
    return door;
};

},{"./item.js":5}],4:[function(require,module,exports){
var Item = require('./item.js');


module.exports = function(options) {
    var gun = Item(options);
    gun.name = 'gun';

    gun.visibility = 0.2;
    return gun;
};


},{"./item.js":5}],5:[function(require,module,exports){
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

},{"../make/Id.js":8,"../make/Mobile.js":9,"../make/Visible.js":10,"../world.js":21}],6:[function(require,module,exports){
var Area = require('./areas/area.js');
var Path = require('./paths/path.js');
var Character = require('./characters/character.js');
var Item = require('./items/item.js');
window.Door = require('./items/door.js');
window.Gun = require('./items/gun.js');
window.World = require('./world.js');

window.areas = [];
for (var i = 0; i < 10; i++) {
    areas.push([]);
    for (var j = 0; j < 10; j++) {
        areas[i].push(Area({name: 'Area ' + i + ', ' + j, pos: {x: i * 51, y: j * 51}, dim: {width: 50, height: 50}}));
    }
}

var pathsX = [];
var door, path;
for (i = 0; i < 9; i++) {
    pathsX.push([]);
    for (j = 0; j < 9; j++) {
        path = Path({name: 'Door opening', areas: [areas[i][j], areas[i][j + 1]]});
        door = Door({name: 'Door' + i + ', ' + j, area: path});
        path.primaryObstruction = door;
        pathsX[i].push(path);
    }
}

var pathsY = [];
for (j = 0; j < 9; j++) {
    pathsY.push([]);
    for (i = 0; i < 9; i++) {
        path = Path({name: 'Door opening', areas: [areas[i][j], areas[i + 1][j]]});
        door = Door({name: 'Door' + i + ', ' + j, area: path});
        path.primaryObstruction = door;
        pathsY[j].push(path);
    }
}

window.gun = Gun({weight: 2, encumbrance: 2, area: areas[1][3]});
window.couch = Item({name: 'couch', area: areas[1][3]});
window.person = Character({name: 'Bob', area: areas[1][3]});



 


},{"./areas/area.js":1,"./characters/character.js":2,"./items/door.js":3,"./items/gun.js":4,"./items/item.js":5,"./paths/path.js":11,"./world.js":21}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){
var index = 0;

module.exports = function(obj) {

    obj.id = index++;
};


},{}],9:[function(require,module,exports){

var move = require('../verbs/move.js');

module.exports = function(obj) {

    obj.move = move(obj);
    obj.area.addInventory(obj);

};


},{"../verbs/move.js":20}],10:[function(require,module,exports){

module.exports = function(obj) {
    obj.visibility = 1;

};


},{}],11:[function(require,module,exports){
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

},{"../make/Container.js":7,"../make/Id.js":8,"../make/Visible.js":10,"../world.js":21}],12:[function(require,module,exports){
var camera = require('./camera.js');

module.exports = function(area) {
    var div = document.createElement('div');
    var objs = [];
    div.style.border = '1px solid black';
    document.getElementById('map').appendChild(div);
    div.style.position = 'absolute';
    div.addEventListener('click', function() {
        person.verbs.go(area);
    });
    //camera.addObject(area);

    return {
        draw: function() {
            div.style.left = camera.xcoord(area.pos.x) + 'px';
            div.style.top = camera.ycoord(area.pos.y) + 'px';
            div.style.width = camera.dim(area.dim.width) + 'px';
            div.style.height = camera.dim(area.dim.height) + 'px';
        },
        kill: function() {
            div.parentNode.removeChild(div);
        },
        el: div,
        registerObj: function(obj) { 
            div.innerHTML += '<br/>' + obj.name;
        },
        clearObjs: function() {
            div.innerHTML = area.name;
        }
    }

};


},{"./camera.js":14}],13:[function(require,module,exports){
var camera = require('./camera.js');

module.exports = function(path) {
    var img = document.createElement('img');
    img.style.border = '1px solid black';
    document.getElementById('map').appendChild(img);
    img.style.position = 'absolute';
    img.style.zIndex = 2;
    img.addEventListener('click', function(e) {
        if (path.primaryObstruction) path.primaryObstruction.verbs.toggle();
        camera.refresh();
    });
    //camera.addObject(path);

    return {
        draw: function() {
            var dx, dy, pa, px, py;
            if (path.areas[0].pos.x === path.areas[1].pos.x) {
                dx = 30 ;
                dy = 10 ;
                px = 10;
                py = -5;
                if (path.areas[0].pos.y > path.areas[1].pos.y) {
                    pa = 0;
                } else {
                    pa = 1;
                }
            } else {
                dx = 10 ;
                dy = 30 ;
                px = -5;
                py = 10;
                if (path.areas[0].pos.x > path.areas[1].pos.x) {
                    pa = 0;
                } else {
                    pa = 1;
                }
            };
            img.style.width = camera.dim(dx) + 'px';
            img.style.height = camera.dim(dy) + 'px';
            img.style.left = camera.xcoord(path.areas[pa].pos.x + px) + 'px';
            img.style.top = camera.ycoord(path.areas[pa].pos.y + py) + 'px';

        },
        kill: function() {
            img.parentNode.removeChild(img);
        }
    }

};


},{"./camera.js":14}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){


module.exports = {

};

},{}],16:[function(require,module,exports){

module.exports = {
};

},{}],17:[function(require,module,exports){

var camera = require('./camera.js');
var Area = require('./Area.js');
var Path = require('./Path.js');

var menu = require('./menu.js');
var text = require('./text.js');

var map = document.getElementById('map');
map.addEventListener('wheel', function(e) {
    camera.setZoom(e.deltaY);
    e.preventDefault();
});


module.exports = function(character) {

    camera.refresh = character.verbs.look;

    return function(objects) {

        window.o = objects;
        objects.forEach(function(item, index, array) { 

            switch (item.type) {

                case 'location': 
                    document.getElementById('location').innerText =  'You are in ' + item.area.name;
                    camera.setPos(item.area.pos.x + item.area.dim.width / 2, item.area.pos.y + item.area.dim.height / 2);
                    item = item.area;
                    array[index] = item;
                case 'area': 
                    if (!item.dom) item.dom = Area(item);
                    item.dom.clearObjs();
                    break;
                case 'self': 
                    break;
                case 'item': 
                    if (item.area.dom) item.area.dom.registerObj(item);
                    break;
                case 'path': 
                    if (!item.dom) item.dom = Path(item);
                    break;

            }
        });

        camera.draw(objects);

    };

};

},{"./Area.js":12,"./Path.js":13,"./camera.js":14,"./menu.js":15,"./text.js":16}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){


module.exports = function(obj) {
    return function(area) {
        obj.area.removeInventory(obj);
        obj.area = area;
        obj.area.addInventory(obj);
    };
};

},{}],21:[function(require,module,exports){
var makeContainer = require('./make/Container.js');


var World = {}; 

makeContainer(World);

module.exports = World;

},{"./make/Container.js":7}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImpzL2FyZWFzL2FyZWEuanMiLCJqcy9jaGFyYWN0ZXJzL2NoYXJhY3Rlci5qcyIsImpzL2l0ZW1zL2Rvb3IuanMiLCJqcy9pdGVtcy9ndW4uanMiLCJqcy9pdGVtcy9pdGVtLmpzIiwianMvbWFpbi5qcyIsImpzL21ha2UvQ29udGFpbmVyLmpzIiwianMvbWFrZS9JZC5qcyIsImpzL21ha2UvTW9iaWxlLmpzIiwianMvbWFrZS9WaXNpYmxlLmpzIiwianMvcGF0aHMvcGF0aC5qcyIsImpzL3VpL0FyZWEuanMiLCJqcy91aS9QYXRoLmpzIiwianMvdWkvY2FtZXJhLmpzIiwianMvdWkvbWVudS5qcyIsImpzL3VpL3RleHQuanMiLCJqcy91aS92aWV3LmpzIiwianMvdmVyYnMvZ2V0SXRlbS5qcyIsImpzL3ZlcmJzL2xvb2suanMiLCJqcy92ZXJicy9tb3ZlLmpzIiwianMvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtYWtlQ29udGFpbmVyID0gcmVxdWlyZSgnLi4vbWFrZS9Db250YWluZXIuanMnKTtcbnZhciBtYWtlSWQgPSByZXF1aXJlKCcuLi9tYWtlL0lkLmpzJyk7XG52YXIgbWFrZVZpc2libGUgPSByZXF1aXJlKCcuLi9tYWtlL1Zpc2libGUuanMnKTtcbnZhciBXb3JsZCA9IHJlcXVpcmUoJy4uL3dvcmxkLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgdmFyIGFyZWEgPSBvcHRpb25zO1xuXG4gICAgYXJlYS50eXBlID0gJ2FyZWEnO1xuICAgIGFyZWEubGlnaHQgPSAxO1xuICAgIGlmIChhcmVhLmltZykgYXJlYS5pbWcgPSBuZXcgSW1hZ2UoYXJlYS5pbWcpO1xuICAgIFxuICAgIG1ha2VDb250YWluZXIoYXJlYSk7XG4gICAgbWFrZUlkKGFyZWEpO1xuXG5cbiAgICBXb3JsZC5hZGRJbnZlbnRvcnkoYXJlYSk7XG4gICAgXG4gICAgcmV0dXJuIGFyZWE7XG5cbn07XG4iLCJ2YXIgdmlldyA9IHJlcXVpcmUoJy4uL3VpL3ZpZXcuanMnKTtcbnZhciBtYWtlQ29udGFpbmVyID0gcmVxdWlyZSgnLi4vbWFrZS9Db250YWluZXIuanMnKTtcbnZhciBsb29rID0gcmVxdWlyZSgnLi4vdmVyYnMvbG9vay5qcycpO1xudmFyIGdldEl0ZW0gPSByZXF1aXJlKCcuLi92ZXJicy9nZXRJdGVtLmpzJyk7XG52YXIgbWFrZU1vYmlsZSA9IHJlcXVpcmUoJy4uL21ha2UvTW9iaWxlLmpzJyk7XG52YXIgbWFrZUlkID0gcmVxdWlyZSgnLi4vbWFrZS9JZC5qcycpO1xudmFyIG1ha2VWaXNpYmxlID0gcmVxdWlyZSgnLi4vbWFrZS9WaXNpYmxlLmpzJyk7XG52YXIgV29ybGQgPSByZXF1aXJlKCcuLi93b3JsZC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuXG4gICAgdmFyIGNoYXJhY3RlciA9IG9wdGlvbnM7XG4gICAgY2hhcmFjdGVyLmludmVudG9yeVdlaWdodDtcbiAgICBjaGFyYWN0ZXIud2VpZ2h0TGltaXQgPSA4MDtcbiAgICBjaGFyYWN0ZXIuZW5jdW1icmFuY2VMaW1pdCA9IDEwO1xuXG4gICAgY2hhcmFjdGVyLnZlcmJzID0ge307XG4gICAgbWFrZUlkKGNoYXJhY3Rlcik7XG4gICAgbWFrZU1vYmlsZShjaGFyYWN0ZXIpO1xuICAgIG1ha2VDb250YWluZXIoY2hhcmFjdGVyKTtcblxuICAgIGNoYXJhY3Rlci5jYWxjdWxhdGVFbmN1bWJyYW5jZShjaGFyYWN0ZXIpO1xuICAgIFxuICAgIGNoYXJhY3Rlci52ZXJicy5nZXRJdGVtID0gZ2V0SXRlbShjaGFyYWN0ZXIpO1xuICAgIGNoYXJhY3Rlci52ZXJicy5sb29rID0gbG9vayhjaGFyYWN0ZXIpO1xuICAgIGNoYXJhY3Rlci52aWV3ID0gdmlldyhjaGFyYWN0ZXIpO1xuICAgIGNoYXJhY3Rlci52ZXJicy5sb29rKCk7XG5cbiAgICBjaGFyYWN0ZXIudmVyYnMuZ28gPSBmdW5jdGlvbihhcmVhKSB7XG4gICAgICAgIGlmIChjaGFyYWN0ZXJcbiAgICAgICAgICAgIC5hcmVhXG4gICAgICAgICAgICAubGlzdEludmVudG9yeSgpXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHsgaWYgKGl0ZW0udHlwZSA9PT0gJ3BhdGgnKSByZXR1cm4gdHJ1ZTt9KVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbih0ZXN0LCBpdGVtKSB7IGlmIChpdGVtLmxpbmsoYXJlYSkuaWQgPT09IGNoYXJhY3Rlci5hcmVhLmlkIHx8IHRlc3QpIHJldHVybiB0cnVlOyB9LCBmYWxzZSkpIHtcblxuICAgICAgICAgICAgY2hhcmFjdGVyLm1vdmUoYXJlYSk7XG4gICAgICAgICAgICBjaGFyYWN0ZXIudmVyYnMubG9vaygpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgV29ybGQuYWRkSW52ZW50b3J5KGNoYXJhY3Rlcik7XG5cbiAgICByZXR1cm4gY2hhcmFjdGVyO1xufTtcbiIsInZhciBJdGVtID0gcmVxdWlyZSgnLi9pdGVtLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGRvb3IgPSBJdGVtKG9wdGlvbnMpO1xuICAgIGRvb3IuY2xvc2VkID0gdHJ1ZTtcbiAgICBkb29yLnZlcmJzLnRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb29yLmNsb3NlZCA9ICFkb29yLmNsb3NlZDtcbiAgICAgICAgaWYgKGRvb3IuY2xvc2VkKSB7IGRvb3Iub3BhY2l0eSA9IDE7IH0gZWxzZSB7IGRvb3Iub3BhY2l0eSA9IC41OyB9XG4gICAgfTtcbiAgICBkb29yLm9wYWNpdHkgPSAxO1xuICAgIHJldHVybiBkb29yO1xufTtcbiIsInZhciBJdGVtID0gcmVxdWlyZSgnLi9pdGVtLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGd1biA9IEl0ZW0ob3B0aW9ucyk7XG4gICAgZ3VuLm5hbWUgPSAnZ3VuJztcblxuICAgIGd1bi52aXNpYmlsaXR5ID0gMC4yO1xuICAgIHJldHVybiBndW47XG59O1xuXG4iLCJ2YXIgbWFrZUlkID0gcmVxdWlyZSgnLi4vbWFrZS9JZC5qcycpO1xudmFyIG1ha2VWaXNpYmxlID0gcmVxdWlyZSgnLi4vbWFrZS9WaXNpYmxlLmpzJyk7XG52YXIgbWFrZU1vYmlsZSA9IHJlcXVpcmUoJy4uL21ha2UvTW9iaWxlLmpzJyk7XG52YXIgV29ybGQgPSByZXF1aXJlKCcuLi93b3JsZC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgIHZhciBpdGVtID0gb3B0aW9ucztcbiAgICBpdGVtLnR5cGUgPSAnaXRlbSc7XG4gICAgXG4gICAgaXRlbS52ZXJicyA9IHt9O1xuXG4gICAgbWFrZUlkKGl0ZW0pO1xuICAgIG1ha2VNb2JpbGUoaXRlbSk7XG4gICAgbWFrZVZpc2libGUoaXRlbSk7XG5cbiAgICBXb3JsZC5hZGRJbnZlbnRvcnkoaXRlbSk7XG5cbiAgICByZXR1cm4gaXRlbTtcbn07XG4iLCJ2YXIgQXJlYSA9IHJlcXVpcmUoJy4vYXJlYXMvYXJlYS5qcycpO1xudmFyIFBhdGggPSByZXF1aXJlKCcuL3BhdGhzL3BhdGguanMnKTtcbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuL2NoYXJhY3RlcnMvY2hhcmFjdGVyLmpzJyk7XG52YXIgSXRlbSA9IHJlcXVpcmUoJy4vaXRlbXMvaXRlbS5qcycpO1xud2luZG93LkRvb3IgPSByZXF1aXJlKCcuL2l0ZW1zL2Rvb3IuanMnKTtcbndpbmRvdy5HdW4gPSByZXF1aXJlKCcuL2l0ZW1zL2d1bi5qcycpO1xud2luZG93LldvcmxkID0gcmVxdWlyZSgnLi93b3JsZC5qcycpO1xuXG53aW5kb3cuYXJlYXMgPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGFyZWFzLnB1c2goW10pO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBhcmVhc1tpXS5wdXNoKEFyZWEoe25hbWU6ICdBcmVhICcgKyBpICsgJywgJyArIGosIHBvczoge3g6IGkgKiA1MSwgeTogaiAqIDUxfSwgZGltOiB7d2lkdGg6IDUwLCBoZWlnaHQ6IDUwfX0pKTtcbiAgICB9XG59XG5cbnZhciBwYXRoc1ggPSBbXTtcbnZhciBkb29yLCBwYXRoO1xuZm9yIChpID0gMDsgaSA8IDk7IGkrKykge1xuICAgIHBhdGhzWC5wdXNoKFtdKTtcbiAgICBmb3IgKGogPSAwOyBqIDwgOTsgaisrKSB7XG4gICAgICAgIHBhdGggPSBQYXRoKHtuYW1lOiAnRG9vciBvcGVuaW5nJywgYXJlYXM6IFthcmVhc1tpXVtqXSwgYXJlYXNbaV1baiArIDFdXX0pO1xuICAgICAgICBkb29yID0gRG9vcih7bmFtZTogJ0Rvb3InICsgaSArICcsICcgKyBqLCBhcmVhOiBwYXRofSk7XG4gICAgICAgIHBhdGgucHJpbWFyeU9ic3RydWN0aW9uID0gZG9vcjtcbiAgICAgICAgcGF0aHNYW2ldLnB1c2gocGF0aCk7XG4gICAgfVxufVxuXG52YXIgcGF0aHNZID0gW107XG5mb3IgKGogPSAwOyBqIDwgOTsgaisrKSB7XG4gICAgcGF0aHNZLnB1c2goW10pO1xuICAgIGZvciAoaSA9IDA7IGkgPCA5OyBpKyspIHtcbiAgICAgICAgcGF0aCA9IFBhdGgoe25hbWU6ICdEb29yIG9wZW5pbmcnLCBhcmVhczogW2FyZWFzW2ldW2pdLCBhcmVhc1tpICsgMV1bal1dfSk7XG4gICAgICAgIGRvb3IgPSBEb29yKHtuYW1lOiAnRG9vcicgKyBpICsgJywgJyArIGosIGFyZWE6IHBhdGh9KTtcbiAgICAgICAgcGF0aC5wcmltYXJ5T2JzdHJ1Y3Rpb24gPSBkb29yO1xuICAgICAgICBwYXRoc1lbal0ucHVzaChwYXRoKTtcbiAgICB9XG59XG5cbndpbmRvdy5ndW4gPSBHdW4oe3dlaWdodDogMiwgZW5jdW1icmFuY2U6IDIsIGFyZWE6IGFyZWFzWzFdWzNdfSk7XG53aW5kb3cuY291Y2ggPSBJdGVtKHtuYW1lOiAnY291Y2gnLCBhcmVhOiBhcmVhc1sxXVszXX0pO1xud2luZG93LnBlcnNvbiA9IENoYXJhY3Rlcih7bmFtZTogJ0JvYicsIGFyZWE6IGFyZWFzWzFdWzNdfSk7XG5cblxuXG4gXG5cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcblxuICAgIHZhciBpbnZlbnRvcnkgPSBbXTtcblxuICAgIG9iai5saXN0SW52ZW50b3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBpbnZlbnRvcnk7XG4gICAgfTtcblxuICAgIG9iai5hZGRJbnZlbnRvcnkgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaW52ZW50b3J5LnB1c2gob2JqKTtcbiAgICB9O1xuXG4gICAgb2JqLnJlbW92ZUludmVudG9yeSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpbnZlbnRvcnkgPSBpbnZlbnRvcnkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHsgcmV0dXJuIChpdGVtLmlkICE9PSBvYmouaWQpIH0pO1xuICAgIH1cblxuICAgIG9iai5nZXRJbnZlbnRvcnkgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gaW52ZW50b3J5LmZpbHRlcihmdW5jdGlvbihpdGVtKSB7IHJldHVybiAoKCEhaWQubGVuZ3RoKSA/IChpZC5pbmRleE9mKGl0ZW0uaWQpID4gLTEpIDogaXRlbS5pZCA9PT0gaWQpIH0pO1xuICAgIH1cbiAgICBcbiAgICBvYmouY2FsY3VsYXRlRW5jdW1icmFuY2UgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgb2JqLmVuY3VtYnJhbmNlID0gb2JqLmxpc3RJbnZlbnRvcnkoKS5yZWR1Y2UoZnVuY3Rpb24oZW5jdW1icmFuY2UsIGl0ZW0pIHsgZW5jdW1icmFuY2UgKz0gaXRlbS5lbmN1bWJyYW5jZTsgfSwgMCk7XG4gICAgICAgIG9iai5pbnZlbnRvcnlXZWlnaHQgPSBvYmoubGlzdEludmVudG9yeSgpLnJlZHVjZShmdW5jdGlvbih3ZWlnaHQsIGl0ZW0pIHsgd2VpZ2h0ICs9IGl0ZW0ud2VpZ2h0OyB9LCAwKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9iajtcbn07XG4iLCJ2YXIgaW5kZXggPSAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xuXG4gICAgb2JqLmlkID0gaW5kZXgrKztcbn07XG5cbiIsIlxudmFyIG1vdmUgPSByZXF1aXJlKCcuLi92ZXJicy9tb3ZlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG5cbiAgICBvYmoubW92ZSA9IG1vdmUob2JqKTtcbiAgICBvYmouYXJlYS5hZGRJbnZlbnRvcnkob2JqKTtcblxufTtcblxuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIG9iai52aXNpYmlsaXR5ID0gMTtcblxufTtcblxuIiwidmFyIG1ha2VDb250YWluZXIgPSByZXF1aXJlKCcuLi9tYWtlL0NvbnRhaW5lci5qcycpO1xudmFyIG1ha2VJZCA9IHJlcXVpcmUoJy4uL21ha2UvSWQuanMnKTtcbnZhciBtYWtlVmlzaWJsZSA9IHJlcXVpcmUoJy4uL21ha2UvVmlzaWJsZS5qcycpO1xudmFyIFdvcmxkID0gcmVxdWlyZSgnLi4vd29ybGQuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgXG4gICAgdmFyIHBhdGggPSBvcHRpb25zO1xuICAgIHBhdGgudHlwZSA9ICdwYXRoJztcbiAgICBwYXRoLnZpc2liaWxpdHkgPSAxO1xuICAgIC8vcGF0aC5hcmVhcyA9IG9wdGlvbnMuYXJlYXM7XG4gICAgdmFyIG9ic3RhY2xlcyA9IFtdO1xuICAgIG1ha2VJZChwYXRoKTtcbiAgICBtYWtlQ29udGFpbmVyKHBhdGgpO1xuICAgIHBhdGgub2JzdHJ1Y3Rpb25zID0gW21ha2VDb250YWluZXIoe30pLCBtYWtlQ29udGFpbmVyKHt9KV07XG4gICAgXG4gICAgXG5cbiAgICBwYXRoLmFyZWFzLmZvckVhY2goZnVuY3Rpb24oYXJlYSkgeyBhcmVhLmFkZEludmVudG9yeShwYXRoKSB9KTtcblxuICAgIHBhdGgubGluayA9IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgaWYgKHBhdGguYXJlYXNbMF0uaWQgPT09IGFyZWEuaWQpIHJldHVybiBwYXRoLmFyZWFzWzFdO1xuICAgICAgICByZXR1cm4gcGF0aC5hcmVhc1swXTtcbiAgICB9O1xuXG5cbiAgICBXb3JsZC5hZGRJbnZlbnRvcnkocGF0aCk7XG5cbiAgICByZXR1cm4gcGF0aDtcbn07XG4iLCJ2YXIgY2FtZXJhID0gcmVxdWlyZSgnLi9jYW1lcmEuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcmVhKSB7XG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZhciBvYmpzID0gW107XG4gICAgZGl2LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgYmxhY2snO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKS5hcHBlbmRDaGlsZChkaXYpO1xuICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHBlcnNvbi52ZXJicy5nbyhhcmVhKTtcbiAgICB9KTtcbiAgICAvL2NhbWVyYS5hZGRPYmplY3QoYXJlYSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gY2FtZXJhLnhjb29yZChhcmVhLnBvcy54KSArICdweCc7XG4gICAgICAgICAgICBkaXYuc3R5bGUudG9wID0gY2FtZXJhLnljb29yZChhcmVhLnBvcy55KSArICdweCc7XG4gICAgICAgICAgICBkaXYuc3R5bGUud2lkdGggPSBjYW1lcmEuZGltKGFyZWEuZGltLndpZHRoKSArICdweCc7XG4gICAgICAgICAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gY2FtZXJhLmRpbShhcmVhLmRpbS5oZWlnaHQpICsgJ3B4JztcbiAgICAgICAgfSxcbiAgICAgICAga2lsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXYpO1xuICAgICAgICB9LFxuICAgICAgICBlbDogZGl2LFxuICAgICAgICByZWdpc3Rlck9iajogZnVuY3Rpb24ob2JqKSB7IFxuICAgICAgICAgICAgZGl2LmlubmVySFRNTCArPSAnPGJyLz4nICsgb2JqLm5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFyT2JqczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gYXJlYS5uYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG4iLCJ2YXIgY2FtZXJhID0gcmVxdWlyZSgnLi9jYW1lcmEuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZy5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkIGJsYWNrJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJykuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICBpbWcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGltZy5zdHlsZS56SW5kZXggPSAyO1xuICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKHBhdGgucHJpbWFyeU9ic3RydWN0aW9uKSBwYXRoLnByaW1hcnlPYnN0cnVjdGlvbi52ZXJicy50b2dnbGUoKTtcbiAgICAgICAgY2FtZXJhLnJlZnJlc2goKTtcbiAgICB9KTtcbiAgICAvL2NhbWVyYS5hZGRPYmplY3QocGF0aCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkeCwgZHksIHBhLCBweCwgcHk7XG4gICAgICAgICAgICBpZiAocGF0aC5hcmVhc1swXS5wb3MueCA9PT0gcGF0aC5hcmVhc1sxXS5wb3MueCkge1xuICAgICAgICAgICAgICAgIGR4ID0gMzAgO1xuICAgICAgICAgICAgICAgIGR5ID0gMTAgO1xuICAgICAgICAgICAgICAgIHB4ID0gMTA7XG4gICAgICAgICAgICAgICAgcHkgPSAtNTtcbiAgICAgICAgICAgICAgICBpZiAocGF0aC5hcmVhc1swXS5wb3MueSA+IHBhdGguYXJlYXNbMV0ucG9zLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGEgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR4ID0gMTAgO1xuICAgICAgICAgICAgICAgIGR5ID0gMzAgO1xuICAgICAgICAgICAgICAgIHB4ID0gLTU7XG4gICAgICAgICAgICAgICAgcHkgPSAxMDtcbiAgICAgICAgICAgICAgICBpZiAocGF0aC5hcmVhc1swXS5wb3MueCA+IHBhdGguYXJlYXNbMV0ucG9zLngpIHtcbiAgICAgICAgICAgICAgICAgICAgcGEgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1nLnN0eWxlLndpZHRoID0gY2FtZXJhLmRpbShkeCkgKyAncHgnO1xuICAgICAgICAgICAgaW1nLnN0eWxlLmhlaWdodCA9IGNhbWVyYS5kaW0oZHkpICsgJ3B4JztcbiAgICAgICAgICAgIGltZy5zdHlsZS5sZWZ0ID0gY2FtZXJhLnhjb29yZChwYXRoLmFyZWFzW3BhXS5wb3MueCArIHB4KSArICdweCc7XG4gICAgICAgICAgICBpbWcuc3R5bGUudG9wID0gY2FtZXJhLnljb29yZChwYXRoLmFyZWFzW3BhXS5wb3MueSArIHB5KSArICdweCc7XG5cbiAgICAgICAgfSxcbiAgICAgICAga2lsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpbWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpbWcpO1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG4iLCJ2YXIgem9vbSA9IDI7XG52YXIgeCA9IDA7XG52YXIgeSA9IDA7XG52YXIgb2JqZWN0cyA9IFtdO1xudmFyIGRyYXcgPSBmdW5jdGlvbihvYmpzKSB7XG4gICAgb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKG9sZE9iamVjdCkgeyBcbiAgICAgICAgaWYgKCFvYmpzLnJlZHVjZShmdW5jdGlvbih2YWx1ZSwgbmV3T2JqZWN0KSB7IFxuICAgICAgICAgICAgcmV0dXJuIChvbGRPYmplY3QuaWQgPT09IG5ld09iamVjdC5pZCB8fCB2YWx1ZSk7IFxuICAgICAgICB9LCBmYWxzZSkgJiYgb2xkT2JqZWN0LmRvbSkge1xuICAgICAgICAgICAgb2xkT2JqZWN0LmRvbS5raWxsKCk7XG4gICAgICAgICAgICBkZWxldGUgb2xkT2JqZWN0LmRvbTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIG9iamVjdHMgPSBvYmpzO1xuICAgIG9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihvYmopIHsgaWYgKG9iai5kb20gJiYgb2JqLmRvbS5kcmF3KSBvYmouZG9tLmRyYXcoKTsgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB4Y29vcmQ6IGZ1bmN0aW9uKGNvb3JkKSB7XG4gICAgICAgIHJldHVybiB6b29tICogKGNvb3JkIC0geCArIDEwMCk7XG4gICAgfSxcbiAgICB5Y29vcmQ6IGZ1bmN0aW9uKGNvb3JkKSB7XG4gICAgICAgIHJldHVybiB6b29tICogKGNvb3JkIC0geSArIDEwMCk7XG4gICAgfSxcbiAgICBkaW06IGZ1bmN0aW9uKGRpbSkge1xuICAgICAgICByZXR1cm4gZGltICogem9vbTtcbiAgICB9LFxuICAgIHNldFpvb206IGZ1bmN0aW9uKG5ld1pvb20pIHsgXG4gICAgICAgIHpvb20gKz0gbmV3Wm9vbSAvIDEwMDtcbiAgICAgICAgZHJhdyhvYmplY3RzKTtcbiAgICB9LFxuICAgIHNldFBvczogZnVuY3Rpb24obmV3WCwgbmV3WSkge1xuICAgICAgICB4ID0gbmV3WDtcbiAgICAgICAgeSA9IG5ld1k7XG4gICAgfSxcbiAgICBkcmF3OiBkcmF3XG4gICAgLy9hZGRPYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAvL29iamVjdHMucHVzaChvYmopO1xuICAgIC8vfSxcbn07XG4iLCJcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbn07XG4iLCJcbm1vZHVsZS5leHBvcnRzID0ge1xufTtcbiIsIlxudmFyIGNhbWVyYSA9IHJlcXVpcmUoJy4vY2FtZXJhLmpzJyk7XG52YXIgQXJlYSA9IHJlcXVpcmUoJy4vQXJlYS5qcycpO1xudmFyIFBhdGggPSByZXF1aXJlKCcuL1BhdGguanMnKTtcblxudmFyIG1lbnUgPSByZXF1aXJlKCcuL21lbnUuanMnKTtcbnZhciB0ZXh0ID0gcmVxdWlyZSgnLi90ZXh0LmpzJyk7XG5cbnZhciBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG5tYXAuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBmdW5jdGlvbihlKSB7XG4gICAgY2FtZXJhLnNldFpvb20oZS5kZWx0YVkpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG5cbiAgICBjYW1lcmEucmVmcmVzaCA9IGNoYXJhY3Rlci52ZXJicy5sb29rO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdHMpIHtcblxuICAgICAgICB3aW5kb3cubyA9IG9iamVjdHM7XG4gICAgICAgIG9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCwgYXJyYXkpIHsgXG5cbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsb2NhdGlvbic6IFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb24nKS5pbm5lclRleHQgPSAgJ1lvdSBhcmUgaW4gJyArIGl0ZW0uYXJlYS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBjYW1lcmEuc2V0UG9zKGl0ZW0uYXJlYS5wb3MueCArIGl0ZW0uYXJlYS5kaW0ud2lkdGggLyAyLCBpdGVtLmFyZWEucG9zLnkgKyBpdGVtLmFyZWEuZGltLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS5hcmVhO1xuICAgICAgICAgICAgICAgICAgICBhcnJheVtpbmRleF0gPSBpdGVtO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FyZWEnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmRvbSkgaXRlbS5kb20gPSBBcmVhKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmRvbS5jbGVhck9ianMoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2VsZic6IFxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdpdGVtJzogXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmFyZWEuZG9tKSBpdGVtLmFyZWEuZG9tLnJlZ2lzdGVyT2JqKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwYXRoJzogXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbS5kb20pIGl0ZW0uZG9tID0gUGF0aChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2FtZXJhLmRyYXcob2JqZWN0cyk7XG5cbiAgICB9O1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcblxuICAgIHJldHVybiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciBlbmN1bWJyYW5jZSA9IG9iai5jYWxjdWxhdGVFbmN1bWJyYW5jZSgpO1xuICAgICAgICBpZiAoaXRlbS5hcmVhLmlkICE9PSBvYmouYXJlYS5pZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoIShlbmN1bWJyYW5jZSArIGl0ZW0uZW5jdW1icmFuY2UgPCBvYmouZW5jdW1icmFuY2VMaW1pdCAmJiBvYmouaW52ZW50b3J5V2VpZ2h0ICsgaXRlbS53ZWlnaHQgPCBvYmoud2VpZ2h0TGltaXQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygneW91IGNhbnQgY2FycnkgaXQnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtLm1vdmUoY2hhcmFjdGVyKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxufTtcbiIsInZhciBsaXN0RmlsdGVyID0gZnVuY3Rpb24oYmxvY2thZ2UpIHsvL3JlcXVpcmUoJy4uL2ZpbHRlcnMvbGlzdC5qcycpO1xuICAgIHJldHVybiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLnZpc2liaWxpdHkgPiBibG9ja2FnZSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwYXRoc1JlbmRlcmVkID0gW107XG4gICAgICAgIHZhciBjdXJyZW50QXJlYSA9IG9iai5hcmVhO1xuICAgICAgICB2YXIgbmV3T2JqZWN0cyA9IFtdO1xuICAgICAgICB2YXIgb2JqZWN0cyA9IFt7dHlwZTogJ2xvY2F0aW9uJywgYXJlYTogb2JqLmFyZWF9XS5jb25jYXQob2JqLmFyZWEubGlzdEludmVudG9yeSgpLmZpbHRlcihsaXN0RmlsdGVyKDEgLSBvYmouYXJlYS5saWdodCkpKTtcbiAgICAgICAgdmFyIHByb2Nlc3NPYmpzID0gZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KSB7IFxuICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSAmJiBpdGVtLnR5cGUgPT09ICdwYXRoJykge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdHMgPSBuZXdPYmplY3RzLmNvbmNhdChmb2xsb3coaXRlbSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IG9iai5pZCkgb2JqZWN0c1tpbmRleF0gPSB7dHlwZTogJ3NlbGYnLCBtZTogaXRlbX07XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZm9sbG93ID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocGF0aHNSZW5kZXJlZC5pbmRleE9mKHBhdGguaWQpICE9PSAtMSkgcmV0dXJuIFtdO1xuICAgICAgICAgICAgcGF0aHNSZW5kZXJlZC5wdXNoKHBhdGguaWQpO1xuXG4gICAgICAgICAgICB2YXIgb3BhY2l0eSA9IChwYXRoLnByaW1hcnlPYnN0cnVjdGlvbikgPyBwYXRoLnByaW1hcnlPYnN0cnVjdGlvbi5vcGFjaXR5IDogMDtcbiAgICAgICAgICAgIHBhdGgub2JzdHJ1Y3Rpb25zWzBdLmxpc3RJbnZlbnRvcnkoKS5jb25jYXQocGF0aC5vYnN0cnVjdGlvbnNbMV0ubGlzdEludmVudG9yeSgpKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5ICs9IGl0ZW0ub3BhY2l0eSB8fCAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAob3BhY2l0eSA+PSAxKSByZXR1cm4gW107XG4gICAgICAgICAgICB2YXIgbGlzdCA9IHBhdGgubGluayhvYmouYXJlYSkubGlzdEludmVudG9yeSgpLmZpbHRlcihsaXN0RmlsdGVyKG9wYWNpdHkpKTtcbiAgICAgICAgICAgIGxpc3QgPSBsaXN0LmZpbHRlcihmdW5jdGlvbihpdGVtKSB7IHJldHVybiAoaXRlbS5pZCAhPT0gcGF0aC5pZCk7IH0pO1xuICAgICAgICAgICAgbGlzdC5wdXNoKHBhdGgubGluayhvYmouYXJlYSkpO1xuXG4gICAgICAgICAgICBjdXJyZW50QXJlYSA9IHBhdGgubGluayhjdXJyZW50QXJlYSk7XG4gICAgICAgICAgICBsaXN0LmZvckVhY2gocHJvY2Vzc09ianMpO1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG5cbiAgICAgICAgfTtcbiAgICAgICAgb2JqZWN0cy5mb3JFYWNoKHByb2Nlc3NPYmpzKTtcbiAgICAgICAgb2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KG5ld09iamVjdHMpO1xuICAgICAgICBvYmplY3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KSB7IFxuICAgICAgICAgICAgdmFyIGU7IFxuICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2FyZWEnKSB7IFxuICAgICAgICAgICAgICAgIGUgPSBpdGVtOyBcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpOyBcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoMCwgMCwgZSk7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfSApOyAvL3NvcnQoZnVuY3Rpb24ob2JqKSB7IGlmIChvYmoudHlwZSA9PT0gJ2FyZWEnKSByZXR1cm4gLTE7IH0pO1xuICAgICAgICBvYmoudmlldyhvYmplY3RzKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfTtcbn07XG4iLCJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICBvYmouYXJlYS5yZW1vdmVJbnZlbnRvcnkob2JqKTtcbiAgICAgICAgb2JqLmFyZWEgPSBhcmVhO1xuICAgICAgICBvYmouYXJlYS5hZGRJbnZlbnRvcnkob2JqKTtcbiAgICB9O1xufTtcbiIsInZhciBtYWtlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9tYWtlL0NvbnRhaW5lci5qcycpO1xuXG5cbnZhciBXb3JsZCA9IHt9OyBcblxubWFrZUNvbnRhaW5lcihXb3JsZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gV29ybGQ7XG4iXX0=
