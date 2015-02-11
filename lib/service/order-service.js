'use strict';

module.exports.placeOrders = function placeOrders(args, done) {
    console.log('Placing orders with %j', args);

    // TODO: Check that every zone is owned by the player

    // TODO: Check that the orders are valid (and not repeated) for the player

    // TODO: Add the orders to the zones

    return done(null, {});
};

module.exports.execute = function execute(args, done) {
    console.log('Executing order with %j', args);

    // TODO: Check that the order ir valid and belongs to the player

    // TODO: Check that player has turn

    // TODO: All raids must be played before any march, and all march before any crown

    // TODO: Execute order, that could be raid against other player, move or crown (the others won't be executed alone)

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
