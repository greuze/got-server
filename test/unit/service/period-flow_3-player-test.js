'use strict';

var chai = require ('chai');

/*jshint loopfunc:true */
describe('Period flow is correct (4 players)', function() {

    var game, flow;
    var p1, p2, p3, p4;

    // Must create a full game, to let other tests run properly
    before(function(done) {
        game = require('../../../lib/service/game-service.js');
        flow = require('../../../lib/service/period-flow.js');

        game.createGame({maxPlayers: 4}, function(error, player) {
            p1 = player;
            game.createGame({maxPlayers: 4}, function(error, player) {
                p2 = player;
                game.createGame({maxPlayers: 4}, function(error, player) {
                    p3 = player;
                    game.createGame({maxPlayers: 4}, function(error, player) {
                        p4 = player;
                        done();
                    });
                });
            });
        });
    });

    it('Game is running', function(done) {
        game.getGame({gameId: p1.gameId, playerId: p1.playerId}, function(error, myGame) {
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
        var myGame = game._getFullGame(p1.gameId);

        // Initial period
        checkPeriod(myGame.period, 1, 'PLANIFICATION', 4, true);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'SHOW_ORDERS', 0, false);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'USE_CROW', 1, false);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'EXECUTE_RAID_ORDERS', 4, false);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'EXECUTE_MARCH_ORDERS', 4, false);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'EXECUTE_CROWN_ORDERS', 4, false);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 1, 'FINISH_TURN', 0, false);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'DRAW_WESTEROS_CARDS', 0, false);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'WILDLINGS_ATTACK', 4, false);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'RESOLVE_WESTEROS_I', 4, true);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'RESOLVE_WESTEROS_II', 4, true);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'RESOLVE_WESTEROS_III', 4, true);

        flow.nextPeriod(myGame);
        checkPeriod(myGame.period, 2, 'PLANIFICATION', 4, true);

        done();
    });

});
