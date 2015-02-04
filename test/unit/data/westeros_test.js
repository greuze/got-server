'use strict';

var chai = require ('chai');

/*jshint loopfunc:true */
describe('Westeros map is correct', function() {

    var westeros;

    before(function(done) {
        westeros = require('../../../lib/data/westeros.json');

        done();
    });

    it('Links should be bidirectional', function(done) {
        var zones = westeros.zones;
        for (var zone in zones) {
            zones[zone].links.forEach(function (linked) {
                chai.assert(zones[linked], linked + ' does not exist');
                chai.assert(zones[linked].links.indexOf(zone) !== -1,
                    'A link ' + zone + ' -> ' + linked + ' exists, but not the reverse');
            });
        }

        done();
    });

    it('Every zone have valid resources (only land)', function(done) {
        var zones = westeros.zones;
        for (var zone in zones) {
            zones[zone].resources.forEach(function (resource) {
                switch (resource) {
                    case 'barrel':
                    case 'crown':
                    case 'stronghold':
                    case 'castle':
                    case 'stark-token':
                    case 'lannister-token':
                    case 'tyrell-token':
                    case 'greyjoy-token':
                    case 'baratheon-token':
                    case 'martell-token':
                        break;
                    default:
                        chai.assert(false, 'Resource ' + resource + ' is not valid');
                }
            });
        }

        done();
    });

    it('Every zone have valid type', function(done) {
        var zones = westeros.zones;
        for (var zone in zones) {
            switch (zones[zone].type) {
                case 'land':
                case 'sea':
                case 'port':
                    break;
                default:
                    chai.assert(false, 'Type ' + zones[zone].type + ' is not valid');
            }
        }

        done();
    });
});
