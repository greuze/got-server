'use strict';

var chai = require ('chai');

/*jshint loopfunc:true */
describe('Period game is correct (4 players)', function() {

    var gameService, game, storage;
    var p1, p2, p3, p4;

    // Must create a full game, to let other tests run properly
    before(function(done) {
        gameService = require('../../../lib/service/game-service.js');
        game = require('../../../lib/service/game.js');
        storage = require('../../../lib/service/game-storage.js');

        gameService.createGame({maxPlayers: 4}, function(error, player) {
            p1 = player;
            gameService.createGame({maxPlayers: 4}, function(error, player) {
                p2 = player;
                gameService.createGame({maxPlayers: 4}, function(error, player) {
                    p3 = player;
                    gameService.createGame({maxPlayers: 4}, function(error, player) {
                        p4 = player;
                        done();
                    });
                });
            });
        });
    });

    // Helper functions
    function allEquals(elements) {
        for (var i = 0; i < elements.length; i++) {
            for (var j = i + 1; j < elements.length; j++) {
                if (elements[i] !== elements[j]) {
                    return false;
                }
            }
        }
        return true;
    }
    function allDifferent(elements) {
        for (var i = 0; i < elements.length; i++) {
            for (var j = i + 1; j < elements.length; j++) {
                if (elements[i] === elements[j]) {
                    return false;
                }
            }
        }
        return true;
    }
    function anyIs(e, elements) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] === e) {
                return true;
            }
        }
        return false;
    }

    it('Every player is in same game', function(done) {
        var gameIds = [p1.gameId, p2.gameId, p3.gameId, p4.gameId];
        chai.assert(allEquals(gameIds), 'Game id is not the same for every player ' + gameIds);

        done();
    });

    it('Every house is different', function(done) {
        var players = [p1.playerHouse, p2.playerHouse, p3.playerHouse, p4.playerHouse];
        chai.assert(allDifferent(players), 'Some house is assigned more than once ' + players);

        done();
    });

    it('Every house is valid', function(done) {
        var players = [p1.playerHouse, p2.playerHouse, p3.playerHouse, p4.playerHouse];
        chai.assert(anyIs('stark', players), 'None is the Starks');
        chai.assert(anyIs('baratheon', players), 'None is the Baratheons');
        chai.assert(anyIs('lannister', players), 'None is the Lannisters');
        chai.assert(anyIs('greyjoy', players), 'None is the Greyjoys');

        done();
    });

    it('Game is running', function(done) {
        gameService.getGame({gameId: p1.gameId, playerId: p1.playerId}, function(error, myGame) {
            chai.assert(myGame.status, 'Game is not running');

            done();
        });
    });

    function checkPeriod(period, turn, phase, players, overlappable) {
        chai.assert.equal(period.turn, turn,
            'Turn is not correct in ' + period.phase);
        chai.assert.equal(period.phase, phase,
            'Phase is not correct in ' + period.phase);
        chai.assert.equal(period.players ? period.players.length : 0, players,
            'Number of players is not correct in ' + period.phase);
        chai.assert.equal(period.overlappable, overlappable,
            'Overlappable is not correct in ' + period.phase);
    }

    it('Next period is correct', function(done) {
        // Get full game from internal object
        var myGame = storage.getRunningGame(p1.gameId);

        // Initial period
        checkPeriod(myGame.period, 1, 'PLANIFICATION', 4, true);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'SHOW_ORDERS', 0, false);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'USE_CROW', 1, false);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'EXECUTE_RAID_ORDERS', 4, false);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'EXECUTE_MARCH_ORDERS', 4, false);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'EXECUTE_CROWN_ORDERS', 4, false);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'FINISH_TURN', 0, false);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'DRAW_WESTEROS_CARDS', 0, false);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'WILDLINGS_ATTACK', 4, false);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'RESOLVE_WESTEROS_I', 4, true);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'RESOLVE_WESTEROS_II', 4, true);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'RESOLVE_WESTEROS_III', 4, true);

        game.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'PLANIFICATION', 4, true);

        done();
    });
});
