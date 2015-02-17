'use strict';

var chai = require ('chai');

/*jshint loopfunc:true */
describe('Action validator (3 players)', function() {

    var game, storage, validator;
    var p1, p2, p3;
    var consoleLog;

    // Must create a full game, to let other tests run properly
    before(function(done) {
        game = require('../../../lib/service/game-service.js');
        storage = require('../../../lib/service/game-storage.js');
        validator = require('../../../lib/service/action-validator.js');
        // Disable console.log
        consoleLog = console.log;
        console.log = function() {};

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

    after(function(done) {
        console.log = consoleLog;

        done();
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
});
