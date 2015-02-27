'use strict';

var chai = require ('chai');
var request = require('request');
var async = require('async');

var SERVER_URL = 'http://localhost:10429';

describe('Server test', function() {

    var app;
    var gameId;
    var players = {};

    // Must create a full game, to let other tests run properly
    before(function(done) {
        app = require('../../lib/got-server.js');

        app.start(true, function(err) {
            chai.assert.equal(err, undefined, 'Could not start server');

            done();
        })
    });

    after(function(done) {
        app.stop(function(err) {
            chai.assert.equal(err, undefined, 'Could not stop server');

            done();
        });
    });

    var joinPlayer = function(callback) {
        request.post(
            {
                url: SERVER_URL + '/games',
                body : {maxPlayers: 3},
                json: true
            },
            function (error, response, game) {
                chai.assert.equal(error, undefined, 'Unexpected error');
                chai.assert.equal(response.statusCode, 202, 'Unexpected response code');

                console.log('Player joined %j', game);

                gameId = game.gameId;
                players[game.playerHouse] = game.playerId;

                return callback(null, game);
            }
        );
    };

    var getGame = function(house, callback) {
        request.get(
            {
                url: SERVER_URL + '/games/' + gameId,
                headers: {'player-id': players[house]},
                json: true
            },
            function (error, response, game) {
                chai.assert.equal(error, undefined, 'Unexpected error');
                chai.assert.equal(response.statusCode, 200, 'Unexpected response code');

                console.log('Got game %j', game);

                return callback(null, game);
            }
        );
    };

    var placeOrders = function(house, orders, callback) {
        request.put(
            {
                url: SERVER_URL + '/games/' + gameId + '/orders',
                headers: {'player-id': players[house]},
                body : orders,
                json: true
            },
            function (error, response, orders) {
                chai.assert.equal(error, undefined, 'Unexpected error');
                chai.assert.equal(response.statusCode, 202, 'Unexpected response code');

                console.log('Orders placed %j', orders);

                return callback(null, orders);
            }
        );
    };

    var replaceOrder = function(house, order, callback) {
        request.post(
            {
                url: SERVER_URL + '/games/' + gameId + '/crow/order',
                headers: {'player-id': players[house]},
                body : order,
                json: true
            },
            function (error, response, order) {
                chai.assert.equal(error, undefined, 'Unexpected error');
                chai.assert.equal(response.statusCode, 202, 'Unexpected response code');

                console.log('Order replaced %j', order);

                return callback(null, order);
            }
        );
    };

    it('Should create server and play game', function(done) {
        // Could take some time...
        this.timeout(0);

        async.series([
            joinPlayer,
            joinPlayer,
            joinPlayer,
            async.apply(placeOrders, 'stark', [{zone: 'winterfell', order: 'MARCH*'}]),
            async.apply(placeOrders, 'lannister', [
                {zone: 'lannisport', order:'MARCH*'},
                {zone:'stoney-sept',order:'MARCH'}
            ]),
            async.apply(placeOrders, 'baratheon', [
                {zone: 'dragonstone', order:'MARCH*'},
                {zone:'shipbreaker-bay',order:'MARCH'}
            ]),
            async.apply(replaceOrder, 'lannister', {zone: 'lannisport', order: 'CROWN*'})
        ],
        function(err, results) {
            // Final validations
            getGame('stark', function(err, game) {
                chai.assert.equal(game.phase, 'EXECUTE_RAID_ORDERS', 'Incorrect phase');

                done();
            });
        });
    });
});
