'use strict';

var storage = require('./game-storage');
var action = require('./action');
var validator = require('./action-validator');
var errors = require('../errors');

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
// args.orders: Orders to be placed
module.exports.placeOrders = function placeOrders(args, done) {
    var game = storage.getRunningGame(args.gameId);
    if (!game) {
        return done(errors.NOT_FOUND);
    }

    if (!validator.canPlaceOrders(game, args.playerId, args.orders)) {
        return done(errors.WRONG_PARAMETERS);
    }

    action.placeOrders(game, args.playerId, args.orders);

    return done(null, args.orders);
};

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
// args.orderId: Id of current order
module.exports.execute = function execute(args, done) {
    console.log('Executing order with %j', args);

    // TODO: Get the game

    // TODO: Check that the order ir valid and belongs to the player

    // TODO: Check that player has turn

    // TODO: All raids must be played before any march, and all march before any crown

    // TODO: Execute order, that could be raid against other player, move or crown (the others won't be executed alone)

    return done(null, {});
};

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
// args.orderId: Id of current order
module.exports.support = function support(args, done) {
    console.log('Supporting with %j', args);

    return done(null, {});
};

// args.gameId: Id of the game
// args.playerId: Id of the player that did the request
// args.orderId: Id of current order
module.exports.playCard = function playCard(args, done) {
    console.log('Playing card with %j', args);

    return done(null, {});
};
