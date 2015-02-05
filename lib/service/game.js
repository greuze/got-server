'use strict';

// Is an array, to easily filter
var openGames = [];
// Is an object, to easily delete games
var runningGames = {};

var uuid = require('node-uuid');
var errors = require('../errors');

var VALIDATE_USERS = false;

var HOUSES = [
    'stark',
    'lannister',
    'baratheon',
    'greyjoy',
    'tyrell',
    'martell'
];

function pickHouse(game, preferredHouse) {
    var playerHouse;
    if (preferredHouse) {
        playerHouse = preferredHouse;
    } else {
        playerHouse = game.availableHouses[Math.floor((Math.random() * game.availableHouses.length))];
    }
    game.availableHouses.splice(game.availableHouses.indexOf(playerHouse), 1);

    return playerHouse;
}

function getPlayingHouses(numberOfPlayers) {
    return HOUSES.filter(function(house, i) {
        return i < numberOfPlayers;
    });
}

function initializeGame(game) {
    var allHouseCards = require('../data/house-cards.json');
    game.cards = {
        // TODO: Shuffle westeros decks (no need to store played cards)
        westerosI: [],
        westerosII: [],
        westerosIII: [],
        // TODO: Shuffle wildlings deck (no need to store played cards)
        wildlings: [],
        house: {}
    };

    // Set starting armies and garrisons
    var startingForces = require('../data/starting-forces.json');
    var availableHouses = getPlayingHouses(game.maxPlayers);
    availableHouses.forEach(function(house) {
        // Add initial forces
        var houseForces = startingForces[house];
        houseForces.forEach(function(forceOriginal) {
            var force = JSON.parse(JSON.stringify(forceOriginal));
            force.house = house;
            game.map.zones[force.zone].forces = force;
            delete force.zone;
        });
        // Add initial house cards
        game.cards.house[house] = JSON.parse(JSON.stringify(allHouseCards[house]));
    });

    // TODO: Set starting influente indicators

    // TODO: Set supply limit and castle count

    game.turn = 1;
}

// Should join game by number of players, difficulty, location, or whatever
function joinOpenGame(args) {
    // Get open games with same maxPlayers (could filter by location, difficulty, house, etc.)
    var candidates = openGames.filter(function(game) {
        return game.maxPlayers === args.maxPlayers;
    });
    if (candidates.length === 0) {
        return;
    }
    // Take the first candidate (that should be the oldest)
    var joinGame = candidates[0];

    var playerId = uuid.v4();
    var playerHouse = pickHouse(joinGame);
    joinGame.players[playerId] = playerHouse;

    // If there are no open houses, start game
    if (joinGame.availableHouses.length === 0) {
        openGames = openGames.filter(function(game) {
            return game.id !== joinGame.id;
        });
        initializeGame(joinGame);
        runningGames[joinGame.id] = joinGame;
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
    var availableHouses = getPlayingHouses(args.maxPlayers);

    var newGame = {
        id: gameId,
        maxPlayers: args.maxPlayers,
        players: {},
        availableHouses: availableHouses,
        map: JSON.parse(JSON.stringify(require('../data/westeros.json')))
    };

    var playerHouse = pickHouse(newGame);
    newGame.players[playerId] = playerHouse;

    openGames.push(newGame);

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
    var myGame = runningGames[args.gameId];
    var status = 'running';
    if (!myGame) {
        var openGame = openGames.filter(function(game) {
            return game.id === args.gameId;
        });
        if (openGame.length === 0) {
            console.log('Game %s does not exist', args.gameId);
            return done(errors.NOT_FOUND);
        } else {
            status = 'waiting';
            myGame = openGame[0];
        }
    }
    // If player is not in the game, return an error
    if (VALIDATE_USERS && !myGame.players[args.playerId]) {
        return done(errors.NOT_AUTHORIZED);
    }
    console.log('Requested game: %j', myGame);
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
