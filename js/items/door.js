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
