'use strict';

var chai = require ('chai');

/*jshint loopfunc:true */
describe('Common test', function() {

    var common;

    // Must create a full game, to let other tests run properly
    before(function(done) {
        common = require('../../../lib/service/common.js');

        done();
    });

    it('Get playing houses', function(done) {
        chai.assert(common.getPlayingHouses(3).length, 3, 'Get playing houses with size 3 is not correct');
        chai.assert(common.getPlayingHouses(4).length, 4, 'Get playing houses with size 3 is not correct');
        chai.assert(common.getPlayingHouses(5).length, 5, 'Get playing houses with size 3 is not correct');
        chai.assert(common.getPlayingHouses(6).length, 6, 'Get playing houses with size 3 is not correct');

        done();
    });

    function checkSupplyLimit(supplyRange, forces, expected) {
        chai.assert.equal(common.isUnderSupplyLimit(supplyRange, forces), expected,
            'Forces ' + forces + ' with supply range ' + supplyRange);
    }

    it('Is valid supply 0', function(done) {
        checkSupplyLimit(0, [2, 2], true);
        checkSupplyLimit(0, [2, 1, 1], true);
        checkSupplyLimit(0, [1, 1, 2], true);
        checkSupplyLimit(0, [3, 1], false);

        done();
    });

    it('Is valid supply 1', function(done) {
        checkSupplyLimit(1, [3, 3, 1], false);
        checkSupplyLimit(1, [1, 3, 3], false);
        checkSupplyLimit(1, [3, 2, 1], true);
        checkSupplyLimit(1, [3], true);
        checkSupplyLimit(1, [4], false);

        done();
    });

    it('Is valid supply 2', function(done) {
        checkSupplyLimit(2, [2, 1, 1, 2, 1, 1, 2], true);
        checkSupplyLimit(2, [2, 2, 2, 2], false);
        checkSupplyLimit(2, [3, 3], false);
        checkSupplyLimit(2, [3, 2, 2, 1], true);
        checkSupplyLimit(2, [3], true);
        checkSupplyLimit(2, [4], false);

        done();
    });

    it('Is valid supply 3', function(done) {
        checkSupplyLimit(3, [2, 1, 1, 2, 1, 1, 2], true);
        checkSupplyLimit(3, [2, 2, 2, 2], true);
        checkSupplyLimit(3, [3, 3, 2], false);
        checkSupplyLimit(3, [2, 3, 2, 2], true);
        checkSupplyLimit(3, [5], false);

        done();
    });

    it('Is valid supply 4', function(done) {
        checkSupplyLimit(4, [2, 1, 1, 2, 1, 2, 2, 1, 2], false);
        checkSupplyLimit(4, [3, 3, 3], false);
        checkSupplyLimit(4, [3, 3, 2], true);
        checkSupplyLimit(4, [1, 3, 2, 2], true);
        checkSupplyLimit(4, [4, 1], false);

        done();
    });

    it('Is valid supply 5', function(done) {
        checkSupplyLimit(5, [2, 1, 1, 2, 1, 2, 2, 1, 2], false);
        checkSupplyLimit(5, [3, 3, 3], false);
        checkSupplyLimit(5, [3, 3, 2], true);
        checkSupplyLimit(5, [1, 3, 2, 2], true);
        checkSupplyLimit(5, [4, 1], true);

        done();
    });

    it('Is valid supply 6', function(done) {
        checkSupplyLimit(6, [2, 1, 1, 2, 1, 2, 2, 1, 2], true);
        checkSupplyLimit(6, [3, 3, 3], false);
        checkSupplyLimit(6, [3, 3, 2], true);
        checkSupplyLimit(6, [1, 3, 4, 2], true);
        checkSupplyLimit(6, [5], false);

        done();
    });
});
