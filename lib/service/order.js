'use strict';

module.exports.placeOrders = function placeOrders(args, done) {
    console.log('Placing orders with %j', args);

    return done(null, {});
};

module.exports.execute = function execute(args, done) {
    console.log('Executing order with %j', args);

    return done(null, {});
};

module.exports.support = function support(args, done) {
    console.log('Supporting with %j', args);

    return done(null, {});
};

module.exports.playCard = function playCard(args, done) {
    console.log('Playing card with %j', args);

    return done(null, {});
};
