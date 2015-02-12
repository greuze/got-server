'use strict';

var uuid = require('node-uuid');
var common = require('./common');
var storage = require('./game-storage');
var game = require('./game');
var errors = require('../errors');

// Should join game by number of players, difficulty, location, or whatever
function joinOpenGame(args) {
    // Get open games with same maxPlayers (could filter by location, difficulty, house, etc.)
    var candidates = storage.filterOpenGames(args.maxPlayers);
    if (candidates.length === 0) {
        return;
    }
    // Take the first candidate (that should be the oldest)
    var joinGame = candidates[0];

    var playerId = uuid.v4();
    var playerHouse = game.pickHouse(joinGame);
    joinGame.players[playerId] = playerHouse;

    // If there are no open houses, start game
    if (joinGame.availableHouses.length === 0) {
        storage.startGame(joinGame);
        game.initialize(joinGame);
    }

    return {
        gameId: joinGame.id,
        playerId: playerId,
        playerHouse: playerHouse,
        pendingPlayers: joinGame.availableHouses.length
    };
}

function createNewGame(args) {
    var gameId = uuid.v4();
    var playerId = uuid.v4();
    var availableHouses = common.getPlayingHouses(args.maxPlayers);

    var newGame = {
        id: gameId,
        maxPlayers: args.maxPlayers,
        players: {},
        availableHouses: availableHouses,
        map: JSON.parse(JSON.stringify(require('../data/westeros.json')))
    };

    var playerHouse = game.pickHouse(newGame);
    newGame.players[playerId] = playerHouse;

    storage.addOpenGame(newGame);

    return {
        gameId: gameId,
        playerId: playerId,
        playerHouse: playerHouse,
        pendingPlayers: newGame.availableHouses.length
    };
}

module.exports.createGame = function createGame(args, done) {
    var openGame = joinOpenGame(args);
    if (openGame) {
        return done(null, openGame);
    } else {
        return done(null, createNewGame(args));
    }
};

module.exports.getGame = function getGame(args, done) {
    var myGame = storage.getRunningGame(args.gameId);
    var status = 'running';
    if (!myGame) {
        myGame = storage.getOpenGame(args.gameId);
        if (!myGame) {
            console.log('Game %s does not exist', args.gameId);
            return done(errors.NOT_FOUND);
        }
        status = 'waiting';
    }
    // If player is not in the game, return an error
    if (common.VALIDATE_USERS && !myGame.players[args.playerId]) {
        return done(errors.NOT_AUTHORIZED);
    }
    return done(null, {
        gameId: myGame.id,
        playerId: args.playerId,
        playerHouse: myGame.players[args.playerId],
        status: status
    });
};

module.exports.muster = function muster(args, done) {
    console.log('Mustering with %j', args);

    return done(null, {});
};

module.exports.useCrow = function useCrow(args, done) {
    console.log('Using crow with %j', args);

    return done(null, {});
};

module.exports.bet = function bet(args, done) {
    console.log('Betting with %j', args);

    return done(null, {});
};