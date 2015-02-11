'use strict';

var HOUSES = [
    'stark',
    'lannister',
    'baratheon',
    'greyjoy',
    'tyrell',
    'martell'
];

var SUPPLY_LIMITS = [
    [2, 2],         // 0
    [3, 2],         // 1
    [3, 2, 2],      // 2
    [3, 2, 2, 2],   // 3
    [3, 3, 2, 2],   // 4
    [4, 3, 2, 2],   // 5
    [4, 3, 2, 2, 2] // 6
];

module.exports.VALIDATE_USERS = false;

// Randomize array element order in-place using Fisher-Yates shuffle algorithm.
module.exports.shuffle = function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

module.exports.getPlayingHouses = function getPlayingHouses(numberOfPlayers) {
    return HOUSES.filter(function(house, i) {
        return i < numberOfPlayers;
    });
};

module.exports.isUnderSupplyLimit = function isValidSupply(supplyRange, forces) {
    // Ensure that forces are sorted from bigger to lower, and with every element >= 2
    var filteredForces = forces.filter(function(e) {
        return e > 1;
    }).sort().reverse();

    var supplyLimit = SUPPLY_LIMITS[supplyRange];
    // There cannot bemore forces >= 2 than in supply limit
    if (filteredForces.length > supplyLimit.length) {
        return false;
    }
    // If just one force is bigger than supply limit, limit is surpassed
    for (var i = 0; i < filteredForces.length; i++) {
        if (filteredForces[i] > supplyLimit[i]) {
            return false;
        }
    }

    return true;
};
