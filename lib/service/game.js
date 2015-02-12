'use strict';

var common = require('./common');

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
module.exports.pickHouse = pickHouse;

function getResourcesByHouse(game, resourceTypes, max) {
    // Ensure resourceTypes is always a list
    if (typeof resourceTypes === 'string') {
        resourceTypes = [resourceTypes];
    }

    var resources = {};
    var availableHouses = common.getPlayingHouses(game.maxPlayers);
    var isInList = function(resource) {
        return resourceTypes.indexOf(resource) > -1;
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
module.exports.getResourcesByHouse = getResourcesByHouse;

function initialPeriod(game) {
    return {
        turn: 1,
        phase: 'PLANIFICATION',
        players: game.influenceTracks.ironThrone,
        overlappable: common.isOverlappable('PLANIFICATION')
    };
}
module.exports.initialPeriod = initialPeriod;

function nextPeriod(game) {
    if (common.isLastPhase(game.period.phase)) {
        game.period.turn += 1;
    }
    game.period.phase = common.nextPhase(game.period.phase);

    if (game.period.phase === 'USE_CROW') {
        game.period.players = [game.influenceTracks.kingsCourt[0]];
    } else if (common.isPlayable(game.period.phase)) {
        // TODO: Use only players with orders according to phase
        game.period.players = game.influenceTracks.ironThrone;
    } else {
        delete game.period.players;
    }
    game.period.overlappable = common.isOverlappable(game.period.phase);
}
module.exports.nextPeriod = nextPeriod;

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
    game.period = initialPeriod(game);

    // Adjust supply limit and castle count
    game.supplyLimit = getResourcesByHouse(game, 'barrel', 6);
    game.castleCount = getResourcesByHouse(game, ['castle', 'stronghold']);
}
module.exports.initialize = initializeGame;
