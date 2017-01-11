var Item = require('./item.js');


module.exports = function(options) {
    var gun = Item(options);
    gun.name = 'gun';

    gun.visibility = 0.2;
    return gun;
};

