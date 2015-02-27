'use strict';

var storage = require('./game-storage');
var game = require('./game');
var action = require('./action');
var validator = require('./action-validator');
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

    if (!playerHouse) {
        // If player is not in the game, return an error
        return done(errors.NOT_AUTHORIZED);
    }
    return done(null, {
        playerHouse: playerHouse,
        status: status,
        turn: myGame.period.turn,
        phase: myGame.period.phase,
        nextPlayer: myGame.period.players
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
// args.order: New order to replace existing one
module.exports.replaceOrder = function crowReplaceOrder(args, done) {
    var game = storage.getRunningGame(args.gameId);
    if (!game) {
        return done(errors.NOT_FOUND);
    }

    if (!validator.canReplaceOrder(game, args.playerId, args.order)) {
        return done(errors.WRONG_PARAMETERS);
    }

    action.replaceOrder(game, args.order);

    return done(null, args.order);
};

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
module.exports.bet = function bet(args, done) {
    console.log('Betting with %j', args);

    return done(null, {});
};
