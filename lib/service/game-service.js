'use strict';

// Is an array, to easily filter
var openGames = [];
// Is an object, to easily delete games
var runningGames = {};

var uuid = require('node-uuid');
var flow = require('./period-flow');
var common = require('./common');
var errors = require('../errors');

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

function getResourcesByHouse(game, resourceList, max) {
    // Ensure resourceList is always a list
    if (typeof resourceList === 'string') {
        resourceList = [resourceList];
    }

    var resources = {};
    var availableHouses = common.getPlayingHouses(game.maxPlayers);
    var isInList = function(resource) {
        return resourceList.indexOf(resource) > -1;
    };

    availableHouses.forEach(function(house) {
        var count = 0;
        var zones = game.map.zones;
        for (var zoneName in zones) {
            var zone = zones[zoneName];
            if (zone.forces && zone.resources && zone.forces.house === house) {
                var res = zone.resources.filter(isInList);
                count += res.length;
            }
        }
        resources[house] = count > max ? max : count; // (count > undefined) == false
    });
    return resources;
}

function initializeGame(game) {
    var allHouseCards = require('../data/house-cards.json');
    game.cards = {
        westerosI: common.shuffle(JSON.parse(JSON.stringify(require('../data/westeros-cards.js').westerosDeckI))),
        westerosII: common.shuffle(JSON.parse(JSON.stringify(require('../data/westeros-cards.js').westerosDeckII))),
        westerosIII: common.shuffle(JSON.parse(JSON.stringify(require('../data/westeros-cards.js').westerosDeckIII))),
        wildlings: common.shuffle(JSON.parse(JSON.stringify(require('../data/wildlings-cards.json')))),
        house: {}
    };
    game.influenceTracks = {
        ironThrone: [],
        fiefdoms: [],
        kingsCourt: []
    };

    // Set starting armies and garrisons
    var startingForces = require('../data/starting-forces.json');
    var startingInfluence = require('../data/house-influence.json');
    var availableHouses = common.getPlayingHouses(game.maxPlayers);
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

        // Set starting influente indicators
        game.influenceTracks.ironThrone[startingInfluence[house].ironThroneTrack] = house;
        game.influenceTracks.fiefdoms[startingInfluence[house].fiefdomsTrack] = house;
        game.influenceTracks.kingsCourt[startingInfluence[house].kingsCourtTrack] = house;
    });

    var filterUndefined = function(n) { return n !== undefined; };
    game.influenceTracks.ironThrone = game.influenceTracks.ironThrone.filter(filterUndefined);
    game.influenceTracks.fiefdoms = game.influenceTracks.fiefdoms.filter(filterUndefined);
    game.influenceTracks.kingsCourt = game.influenceTracks.kingsCourt.filter(filterUndefined);

    game.wildlingsForce = 2;
    game.period = flow.initialPeriod(game);

    // Adjust supply limit and castle count
    game.supplyLimit = getResourcesByHouse(game, 'barrel', 6);
    game.castleCount = getResourcesByHouse(game, ['castle', 'stronghold']);
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
    var availableHouses = common.getPlayingHouses(args.maxPlayers);

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

// Internal methods for testing and debugging purposes
module.exports._getFullGame = function getFullRunningGame(gameId) {
    return runningGames[gameId];
};
