
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
