'use strict';

var request = require('request');
var async = require('async');

var app = require('../lib/got-server.js');

var SERVER_URL = 'http://localhost:10429';

var gameId;
var players = {};

var joinPlayer = function(callback) {
    request.post(
        {
            url: SERVER_URL + '/games',
            headers: {'content-Type': 'application/json'},
            body : {maxPlayers: 3},
            json: true
        },
        function (error, response, game) {
            if (error || response.statusCode !== 202) {
                console.error('Error joining game %j', error || response.statusCode);
                return callback(error || response.statusCode);
            }

            console.log('Player joined %j', game);
            gameId = game.gameId;
            players[game.playerHouse] = game.playerId;

            return callback(null, game);
        }
    );
};

var joinStarkPlayer = function(callback) {
    request.put(
        {
            url: SERVER_URL + '/games/' + gameId + '/orders',
            headers: {'content-Type': 'application/json', 'player-id': players.stark},
            body : [{zone: 'winterfell', order: 'MARCH*'}],
            json: true
        },
        function (error, response, orders) {
            if (error || response.statusCode !== 202) {
                console.error('Error placing orders %j', error || response.statusCode);
                return callback(error || response.statusCode);
            }

            console.log('Orders placed %j', orders);

            return callback(null, orders);
        }
    );
};

app.start(function(err) {
    if (err) {
        console.error('Got Server could not start');
    } else {
        console.log('Got Server started');

        async.series([
            joinPlayer,
            joinPlayer,
            joinPlayer,
            joinStarkPlayer
        ],
        function(err, results) {
            app.stop(function(err) {
                if (err) {
                    console.error('Got Server could not stop');
                } else {
                    console.log('Got Server stopped');
                }
            });
        });
    }
});
