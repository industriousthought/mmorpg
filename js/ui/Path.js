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

