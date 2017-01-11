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

