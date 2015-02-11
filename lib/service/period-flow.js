'use strict';

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

var MAX_TURNS = 10;

function isOverlappable(phase) {
    return OVERLAPPABLE_PHASES.indexOf(phase) > -1;
}

function isPlayable(phase) {
    return NON_PLAYABLE_PHASES.indexOf(phase) === -1;
}

module.exports.initialPeriod = function initialPeriod(game) {
    return {
        turn: 1,
        phase: 'PLANIFICATION',
        players: game.influenceTracks.ironThrone,
        overlappable: isOverlappable('PLANIFICATION')
    };
};

module.exports.nextPeriod = function nextPeriod(game) {
    if (game.period.phase === 'FINISH_TURN') {
        game.period.turn += 1;
        game.period.phase = 'DRAW_WESTEROS_CARDS';
    } else {
        game.period.phase = PHASES[PHASES.indexOf(game.period.phase) + 1];
    }
    if (game.period.phase === 'USE_CROW') {
        game.period.players = [game.influenceTracks.kingsCourt[0]];
    } else if (isPlayable(game.period.phase)) {
        // TODO: Use only players with orders according to phase
        game.period.players = game.influenceTracks.ironThrone;
    } else {
        delete game.period.players;
    }
    game.period.overlappable = isOverlappable(game.period.phase);
};

module.exports.isLastPeriod = function isLastPeriod(game) {
    return game.period.turn === MAX_TURNS && game.period.phase === 'FINISH_TURN';
};
