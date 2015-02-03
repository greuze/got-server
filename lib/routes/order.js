'use strict';

var orderService = require('../service/order');

function placeOrders(req, res, next) {
    var data = {
        gameId: req.params.gameId,
        orderId: req.params.orderId,
        playerId: req.headers['player-id']
    };

    orderService.placeOrders(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

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
