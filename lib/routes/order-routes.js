'use strict';

var orderService = require('../service/order-service');
var errors = require('../errors');

function placeOrders(req, res, next) {
    var data = {
        gameId: req.params.gameId,
        playerId: req.headers['player-id'],
        orders: req.body
    };

    if (!data.playerId || !data.orders) {
        return next(errors.WRONG_PARAMETERS);
    }

    orderService.placeOrders(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

// TODO: Unfinished
function execute(req, res, next) {
    var data = {
        gameId: req.params.gameId,
        orderId: req.params.orderId,
        playerId: req.headers['player-id']
    };

    orderService.execute(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(result);
        }
    });
}

// TODO: Unfinished
function support(req, res, next) {
    var data = {
        gameId: req.params.gameId,
        orderId: req.params.orderId,
        playerId: req.headers['player-id']
    };

    orderService.support(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

// TODO: Unfinished
function playCard(req, res, next) {
    var data = {
        gameId: req.params.gameId,
        orderId: req.params.orderId,
        playerId: req.headers['player-id']
    };

    orderService.playCard(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

exports.registerRoutes = function(app) {
    app.put('/games/:gameId/orders', placeOrders);
    app.post('/games/:gameId/orders/:orderId', execute);
    app.put('/games/:gameId/orders/:orderId/support', support);
    app.put('/games/:gameId/orders/:orderId/card', playCard);
};
