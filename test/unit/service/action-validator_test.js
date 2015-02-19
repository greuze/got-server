'use strict';

var chai = require ('chai');

/*jshint loopfunc:true */
describe('Action validator (3 players)', function() {

    var game, storage, action, validator;
    var p1, p2, p3;

    // Must create a full game, to let other tests run properly
    before(function(done) {
        game = require('../../../lib/service/game-service.js');
        storage = require('../../../lib/service/game-storage.js');
        action = require('../../../lib/service/action.js');
        validator = require('../../../lib/service/action-validator.js');

        game.createGame({maxPlayers: 3}, function(error, player) {
            p1 = player;
            game.createGame({maxPlayers: 3}, function(error, player) {
                p2 = player;
                game.createGame({maxPlayers: 3}, function(error, player) {
                    p3 = player;
                    done();
                });
            });
        });
    });

    function getPlayerIdByHouse(house) {
        return [p1, p2, p3].filter(function filterByHouse(p) {
            return p.playerHouse === house;
        })[0].playerId;
    }

    it('Can place correct orders (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'CROWN*'
            },
            {
                zone: 'white-harbor',
                order: 'MARCH'
            },
            {
                zone: 'the-shivering-sea',
                order: 'MARCH-1'
            }
        ];

        var starkId = getPlayerIdByHouse('stark');

        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), true,
            'Orders validation are not correct');

        done();
    });

    it('Can place less orders than available (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'CROWN*'
            },
            {
                zone: 'white-harbor',
                order: 'MARCH'
            }
        ];

        var starkId = getPlayerIdByHouse('stark');

        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), true,
            'Orders validation are not correct');

        done();
    });

    it('Incorrect order name (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'UNKNOWN'
            }
        ];

        var starkId = getPlayerIdByHouse('stark');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), false,
            'Orders validation are not correct');

        done();
    });

    it('Duplicate special order name (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'CROWN*'
            },
            {
                zone: 'white-harbor',
                order: 'CROWN*'
            },
            {
                zone: 'the-shivering-sea',
                order: 'MARCH-1'
            }
        ];

        var starkId = getPlayerIdByHouse('stark');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), false,
            'Orders validation are not correct');

        done();
    });

    it('Too many special orders (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'MARCH*'
            },
            {
                zone: 'white-harbor',
                order: 'CROWN*'
            },
            {
                zone: 'the-shivering-sea',
                order: 'RAID*'
            }
        ];

        var starkId = getPlayerIdByHouse('stark');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), false,
            'Orders validation are not correct');

        done();
    });

    it('Zone is empty (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'MARCH*'
            },
            {
                zone: 'white-harbor',
                order: 'CROWN'
            },
            {
                zone: 'castle-black',
                order: 'RAID'
            }
        ];

        var starkId = getPlayerIdByHouse('stark');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), false,
            'Orders validation are not correct');

        done();
    });

    it('Zone belongs to other player (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'MARCH*'
            },
            {
                zone: 'white-harbor',
                order: 'CROWN'
            },
            {
                zone: 'dragonstone',
                order: 'RAID'
            }
        ];

        var starkId = getPlayerIdByHouse('stark');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), false,
            'Orders validation are not correct');

        done();
    });

    it('Two orders in same zone (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'MARCH*'
            },
            {
                zone: 'winterfell',
                order: 'CROWN'
            }
        ];

        var starkId = getPlayerIdByHouse('stark');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), false,
            'Orders validation are not correct');

        done();
    });

    it('Zone belongs to other player (Baratheon)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'winterfell',
                order: 'MARCH*'
            },
            {
                zone: 'dragonstone',
                order: 'RAID'
            }
        ];

        var starkId = getPlayerIdByHouse('baratheon');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), false,
            'Orders validation are not correct');

        done();
    });

    it('Can place less orders than available (Baratheon)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var orders = [
            {
                zone: 'shipbreaker-bay',
                order: 'MARCH*'
            },
            {
                zone: 'dragonstone',
                order: 'RAID'
            }
        ];

        var starkId = getPlayerIdByHouse('baratheon');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders), true,
            'Orders validation are not correct');

        done();
    });

    it('Cannot place orders twice (Stark)', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);
        var starkId = getPlayerIdByHouse('stark');

        var orders1 = [
            {
                zone: 'winterfell',
                order: 'CROWN*'
            }
        ];
        var orders2 = [
            {
                zone: 'white-harbor',
                order: 'MARCH'
            }
        ];

        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders1), true,
            'Orders validation are not correct');
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders2), true,
            'Orders validation are not correct');
        // After placing orders once, no more orders placement is valid for that player
        action.placeOrders(myGame, starkId, orders1);
        chai.assert.equal(validator.canPlaceOrders(myGame, starkId, orders2), false,
            'Orders validation are not correct');

        done();
    });
});
