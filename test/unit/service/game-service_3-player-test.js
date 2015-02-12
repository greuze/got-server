'use strict';

var chai = require ('chai');

/*jshint loopfunc:true */
describe('Service game is correct (3 players)', function() {

    var game, storage;
    var p1, p2, p3;

    // Must create a full game, to let other tests run properly
    before(function(done) {
        game = require('../../../lib/service/game-service.js');
        storage = require('../../../lib/service/game-storage.js');

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

    // Helper functions
    function allEquals(e1, e2, e3) {
        return e1 === e2 && e1 === e3;
    }
    function allDifferent(e1, e2, e3) {
        return e1 !== e2 && e1 !== e3 && e2 !== e3;
    }
    function anyIs(e, e1, e2, e3) {
        return e === e1 || e === e2 || e === e3;
    }

    it('Every player is in same game', function(done) {
        chai.assert(allEquals(p1.gameId, p2.gameId, p3.gameId), 'Game id is not the same for every player');

        done();
    });

    it('Every house is different', function(done) {
        chai.assert(
            allDifferent(p1.playerHouse, p2.playerHouse, p3.playerHouse),
            'Some house is assigned more than once'
        );

        done();
    });

    it('Every house is valid', function(done) {
        chai.assert(anyIs('stark', p1.playerHouse, p2.playerHouse, p3.playerHouse), 'None is the Starks');
        chai.assert(anyIs('baratheon', p1.playerHouse, p2.playerHouse, p3.playerHouse), 'None is the Baratheons');
        chai.assert(anyIs('lannister', p1.playerHouse, p2.playerHouse, p3.playerHouse), 'None is the Lannisters');

        done();
    });

    it('Game is running', function(done) {
        game.getGame({gameId: p1.gameId, playerId: p1.playerId}, function(error, myGame) {
            chai.assert(myGame.status, 'Game is not running');

            done();
        });
    });

    it('Every recovered house is the same', function(done) {
        game.getGame({gameId: p1.gameId, playerId: p1.playerId}, function(error, gameP1) {
            chai.assert(p1.playerHouse === gameP1.playerHouse, 'Game of player 1 has changed');
            game.getGame({gameId: p2.gameId, playerId: p2.playerId}, function(error, gameP2) {
                chai.assert(p2.playerHouse === gameP2.playerHouse, 'Game of player 2 has changed');
                game.getGame({gameId: p3.gameId, playerId: p3.playerId}, function(error, gameP3) {
                    chai.assert(p3.playerHouse === gameP3.playerHouse, 'Game of player 3 has changed');
                    done();
                });
            });
        });
    });

    it('Initial settings are correct', function(done) {
        var myGame = storage.getRunningGame(p1.gameId);

        chai.assert.equal(myGame.wildlingsForce, 2, 'Wildlings force is not correct');
        chai.assert.equal(myGame.period.turn, 1, 'Turn is not correct');
        chai.assert.equal(myGame.period.phase, 'PLANIFICATION', 'Phase is not correct');

        chai.assert.equal(myGame.influenceTracks.ironThrone[0], 'baratheon', 'One influence tracks is not correct');
        chai.assert.equal(myGame.influenceTracks.ironThrone[1], 'lannister', 'One influence tracks is not correct');
        chai.assert.equal(myGame.influenceTracks.ironThrone[2], 'stark', 'One influence tracks is not correct');
        chai.assert.equal(myGame.influenceTracks.fiefdoms[0], 'stark', 'One influence tracks is not correct');
        chai.assert.equal(myGame.influenceTracks.fiefdoms[1], 'baratheon', 'One influence tracks is not correct');
        chai.assert.equal(myGame.influenceTracks.fiefdoms[2], 'lannister', 'One influence tracks is not correct');
        chai.assert.equal(myGame.influenceTracks.kingsCourt[0], 'lannister', 'One influence tracks is not correct');
        chai.assert.equal(myGame.influenceTracks.kingsCourt[1], 'stark', 'One influence tracks is not correct');
        chai.assert.equal(myGame.influenceTracks.kingsCourt[2], 'baratheon', 'One influence tracks is not correct');

        chai.assert.equal(myGame.cards.westerosI.length, 10, 'Westeros cards (I) are not correct');
        chai.assert.equal(myGame.cards.westerosII.length, 10, 'Wildlings cards (II) are not correct');
        chai.assert.equal(myGame.cards.westerosIII.length, 10, 'Wildlings cards (III) are not correct');

        chai.assert.equal(myGame.cards.wildlings.length, 9, 'Wildlings cards are not correct');

        chai.assert.equal(myGame.cards.house.stark.length, 7, 'House cards are not correct for Starks');
        chai.assert.equal(myGame.cards.house.lannister.length, 7, 'House cards are not correct for Lannisters');
        chai.assert.equal(myGame.cards.house.baratheon.length, 7, 'House cards are not correct for Baratheons');

        chai.assert.equal(myGame.supplyLimit.stark, 1, 'Supply limit is not correct for Starks');
        chai.assert.equal(myGame.supplyLimit.lannister, 2, 'Supply limit is not correct for Lannisters');
        chai.assert.equal(myGame.supplyLimit.baratheon, 2, 'Supply limit is not correct for Baratheons');

        chai.assert.equal(myGame.castleCount.stark, 2, 'Castle count is not correct for Starks');
        chai.assert.equal(myGame.castleCount.lannister, 1, 'Castle count is not correct for Lannisters');
        chai.assert.equal(myGame.castleCount.baratheon, 1, 'Castle count is not correct for Baratheons');

        done();
    });
});
