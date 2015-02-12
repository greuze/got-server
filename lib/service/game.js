'use strict';

var uuid = require('node-uuid');
var common = require('./common');

function Game(maxPlayers) {
    // Public properties
    this.id = uuid.v4();
    this.availableHouses = common.getPlayingHouses(maxPlayers);
    this.maxPlayers = maxPlayers;
    this.players = {};
}

Game.prototype.pickHouse = function pickHouse(preferredHouse) {
    var playerId = uuid.v4();
    var playerHouse;
    if (preferredHouse) {
        playerHouse = preferredHouse;
    } else {
        playerHouse = this.availableHouses[Math.floor((Math.random() * this.availableHouses.length))];
    }
    this.availableHouses.splice(this.availableHouses.indexOf(playerHouse), 1);

    this.players[playerId] = playerHouse;

    return {
        id: playerId,
        house: playerHouse
    };
};

Game.prototype.getPlayerById = function getPlayerById(id) {
    return this.players[id];
};

Game.prototype.getResourcesByHouse = function getResourcesByHouse(resourceTypes, max) {
    // Ensure resourceTypes is always a list
    if (typeof resourceTypes === 'string') {
        resourceTypes = [resourceTypes];
    }

    var resources = {};
    var availableHouses = common.getPlayingHouses(this.maxPlayers);
    var isInList = function(resource) {
        return resourceTypes.indexOf(resource) > -1;
    };

    var game = this;
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
};

Game.prototype.initialPeriod = function initialPeriod() {
    return {
        turn: 1,
        phase: 'PLANIFICATION',
        players: this.influenceTracks.ironThrone,
        overlappable: common.isOverlappable('PLANIFICATION')
    };
};

Game.prototype.nextPeriod = function nextPeriod() {
    if (common.isLastPhase(this.period.phase)) {
        this.period.turn += 1;
    }
    this.period.phase = common.nextPhase(this.period.phase);

    if (this.period.phase === 'USE_CROW') {
        this.period.players = [this.influenceTracks.kingsCourt[0]];
    } else if (common.isPlayable(this.period.phase)) {
        // TODO: Use only players with orders according to phase
        this.period.players = this.influenceTracks.ironThrone;
    } else {
        delete this.period.players;
    }
    this.period.overlappable = common.isOverlappable(this.period.phase);
};

Game.prototype.initialize = function initializeGame() {
    this.map = JSON.parse(JSON.stringify(require('../data/westeros.json')));
    var allHouseCards = require('../data/house-cards.json');
    this.cards = {
        westerosI: common.shuffle(JSON.parse(JSON.stringify(require('../data/westeros-cards.js').westerosDeckI))),
        westerosII: common.shuffle(JSON.parse(JSON.stringify(require('../data/westeros-cards.js').westerosDeckII))),
        westerosIII: common.shuffle(JSON.parse(JSON.stringify(require('../data/westeros-cards.js').westerosDeckIII))),
        wildlings: common.shuffle(JSON.parse(JSON.stringify(require('../data/wildlings-cards.json')))),
        house: {}
    };
    this.influenceTracks = {
        ironThrone: [],
        fiefdoms: [],
        kingsCourt: []
    };

    // Set starting armies and garrisons
    var startingForces = require('../data/starting-forces.json');
    var startingInfluence = require('../data/house-influence.json');
    var availableHouses = common.getPlayingHouses(this.maxPlayers);

    var game = this;
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
    this.influenceTracks.ironThrone = this.influenceTracks.ironThrone.filter(filterUndefined);
    this.influenceTracks.fiefdoms = this.influenceTracks.fiefdoms.filter(filterUndefined);
    this.influenceTracks.kingsCourt = this.influenceTracks.kingsCourt.filter(filterUndefined);

    this.wildlingsForce = 2;
    this.period = this.initialPeriod();

    // Adjust supply limit and castle count
    this.supplyLimit = this.getResourcesByHouse('barrel', 6);
    this.castleCount = this.getResourcesByHouse(['castle', 'stronghold']);
};

module.exports = Game;
