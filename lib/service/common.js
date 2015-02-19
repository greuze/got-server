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

var PHASES = [
    'DRAW_WESTEROS_CARDS',
    'WILDLINGS_ATTACK',
    'RESOLVE_WESTEROS_I',
    'RESOLVE_WESTEROS_II',
    'RESOLVE_WESTEROS_III',
    'PLANIFICATION',
    'SHOW_ORDERS',
    'USE_CROW',
    'EXECUTE_RAID_ORDERS',
    'EXECUTE_MARCH_ORDERS',
    'EXECUTE_CROWN_ORDERS', // Could be splited by House (mainly on mustering)
    'FINISH_TURN' // Advance turn or finish game
];

// These phases can overlap player responses (to save time)
var OVERLAPPABLE_PHASES = [
    'RESOLVE_WESTEROS_I',
    'RESOLVE_WESTEROS_II',
    'RESOLVE_WESTEROS_III',
    'PLANIFICATION'
];

// These phases doesn't require player response
var NON_PLAYABLE_PHASES = [
    'DRAW_WESTEROS_CARDS',
    'SHOW_ORDERS',
    'FINISH_TURN'
];

var ORDERS = [
    'RAID*',
    'RAID',
    'RAID',
    'MARCH*',
    'MARCH',
    'MARCH-1',
    'CROWN*',
    'CROWN',
    'CROWN',
    'SUPPORT*',
    'SUPPORT',
    'SUPPORT',
    'DEFEND*',
    'DEFEND',
    'DEFEND'
];

var STARS_LIMIT = {
    small: [3, 2, 1, 0],
    big: [3, 3, 2, 1, 0, 0]
};

var MAX_TURNS = 10;

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

module.exports.isOverlappable = function isOverlappable(phase) {
    return OVERLAPPABLE_PHASES.indexOf(phase) > -1;
};

module.exports.isPlayable = function isPlayable(phase) {
    return NON_PLAYABLE_PHASES.indexOf(phase) === -1;
};

module.exports.isLastPhase = function isLastPhase(phase) {
    return phase === 'FINISH_TURN';
};

module.exports.isLastTurn = function isLastTurn(turn, phase) {
    return turn === MAX_TURNS && phase === 'FINISH_TURN';
};

module.exports.nextPhase = function nextPhase(phase) {
    if (phase === 'FINISH_TURN') {
        return 'DRAW_WESTEROS_CARDS';
    }
    return PHASES[PHASES.indexOf(phase) + 1];
};

// Returns an array with a copy of all orders, that can me modified
module.exports.getAvailableOrders = function getAvailableOrders() {
    return JSON.parse(JSON.stringify(ORDERS));
};

// Returns how many special orders can a player use
// First kingsCourtPosition is 0
module.exports.getMaxSpecialOrders = function getMaxSpecialOrders(kingsCourtPosition, numberOfPlayers) {
    if (numberOfPlayers <= 4) {
        return STARS_LIMIT.small[kingsCourtPosition];
    } else {
        return STARS_LIMIT.big[kingsCourtPosition];
    }
};
