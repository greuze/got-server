'use strict';

var chai = require ('chai');

/*jshint loopfunc:true */
describe('Starting forces are correct', function() {

    var westeros;
    var forces;

    before(function(done) {
        westeros = require('../../../lib/data/westeros.json');
        forces = require('../../../lib/data/starting-forces.json');

        done();
    });

    it('Zones should exist', function(done) {
        var zones = westeros.zones;
        for (var house in forces) {
            var houseForces = forces[house];
            houseForces.forEach(function(force, i) {
                chai.assert(force.zone, 'Zone property does not exist for ' + house + '[' + i + ']');
                chai.assert(zones[force.zone], force.zone + ' does not exist');
            });
        }

        done();
    });

    it('Forces properties shoudl be valid', function(done) {
        for (var house in forces) {
            var houseForces = forces[house];
            houseForces.forEach(function(force, i) {
                for (var property in force) {
                    switch (property) {
                        case 'footmen':
                        case 'knights':
                        case 'ships':
                        case 'towers':
                        case 'garrison':
                        case 'zone':
                            break;
                        default:
                            chai.assert(false, 'Property ' + property + ' is not valid for ' + house + '[' + i + ']');
                    }
                }
            });
        }

        done();
    });
});
