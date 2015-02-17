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

    // maxDeviation is in percentage
    function checkShuffleStatistics(iterations, arrayLength, maxDeviation) {
        var expectedAverage = iterations / arrayLength;

        var results = [];
        // Fill the results matrix with zeroes
        for (var a = 0; a < arrayLength; a++) {
            var line = [];
            for (var b = 0; b < arrayLength; b++) {
                line[b] = 0;
            }
            results[a] = line;
        }
        // Iterate shuffle to see if results are statistically simillars
        for (var i = 0; i < iterations; i++) {
            var arr = [];
            // Fill array to shuffle with sorted numbers
            for (var e = 0; e < arrayLength; e++) {
                arr[e] = e;
            }

            common.shuffle(arr);

            // Add one to the final position of every element
            for (var j = 0; j < arr.length; j++) {
                results[j][arr.indexOf(j)] += 1;
            }
        }

        // Check the results
        for (var k = 0; k < arrayLength; k++) {
            results[k].forEach(function(value){
                // Percentage of deviation
                var deviation = 100 * Math.abs(value - expectedAverage) / expectedAverage;
                chai.expect(deviation).to.be.below(maxDeviation, 'Deviation is bigger than maximum allowed');
            });
        }
    }

    it('Shuffle statistics (10,000)', function(done) {
        // Statistics could take some time...
        this.timeout(0);

        checkShuffleStatistics(10000, 10, 15);

        done();
    });

    it('Shuffle statistics (50,000)', function(done) {
        // Statistics could take some time...
        this.timeout(0);

        checkShuffleStatistics(50000, 10, 7);

        done();
    });

    it('Shuffle statistics (250,000)', function(done) {
        // Statistics could take some time...
        this.timeout(0);

        checkShuffleStatistics(250000, 10, 3);

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
