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



 

