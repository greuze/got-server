'use strict';

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

    var player = joinGame.pickHouse();

    // If there are no open houses, start game
    if (joinGame.availableHouses.length === 0) {
        storage.startGame(joinGame);
        joinGame.initialize();
    }

    return {
        gameId: joinGame.id,
        playerId: player.id,
        playerHouse: player.house,
        pendingPlayers: joinGame.availableHouses.length
    };
}

function createNewGame(args) {
    var newGame = new game(args.maxPlayers);

    var player = newGame.pickHouse();

    storage.addOpenGame(newGame);

    return {
        gameId: newGame.id,
        playerId: player.id,
        playerHouse: player.house,
        pendingPlayers: newGame.availableHouses.length
    };
}

// args.maxPlayers: Maximum number of players of the game
module.exports.createGame = function createGame(args, done) {
    var openGame = joinOpenGame(args);
    if (openGame) {
        return done(null, openGame);
    } else {
        return done(null, createNewGame(args));
    }
};

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
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

    var playerHouse = myGame.getPlayerById(args.playerId);

    if (common.VALIDATE_USERS && !playerHouse) {
        // If player is not in the game, return an error
        return done(errors.NOT_AUTHORIZED);
    }
    return done(null, {
        gameId: myGame.id,
        playerId: args.playerId,
        playerHouse: playerHouse,
        status: status
    });
};

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
module.exports.muster = function muster(args, done) {
    console.log('Mustering with %j', args);

    return done(null, {});
};

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
module.exports.useCrow = function useCrow(args, done) {
    console.log('Using crow with %j', args);

    return done(null, {});
};

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
module.exports.bet = function bet(args, done) {
    console.log('Betting with %j', args);

    return done(null, {});
};
