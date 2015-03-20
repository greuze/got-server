'use strict';

var gameService = require('../service/game-service');
var errors = require('../errors');

function createGame(req, res, next) {
    var data = {
        maxPlayers: req.body.maxPlayers
    };

    if (!data.maxPlayers || data.maxPlayers < 3 || data.maxPlayers > 6) {
        return next(errors.WRONG_PARAMETERS);
    }

    gameService.createGame(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

function getGame(req, res, next) {
    var data = {
        gameId: req.params.id,
        playerId: req.headers['player-id']
    };

    if (!data.playerId) {
        return next(errors.WRONG_PARAMETERS);
    }

    gameService.getGame(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(result);
        }
    });
}

// TODO: Unfinished
function muster(req, res, next) {
    var data = {
        gameId: req.params.id,
        playerId: req.headers['player-id']
    };

    gameService.muster(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

function getWildlingsTop(req, res, next) {
    var data = {
        gameId: req.params.id,
        playerId: req.headers['player-id']
    };

    if (!data.playerId) {
        return next(errors.WRONG_PARAMETERS);
    }

    gameService.getWildlingsTop(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(result);
        }
    });
}

function skipWildlingsTop(req, res, next) {
    var data = {
        gameId: req.params.id,
        playerId: req.headers['player-id'],
        skip: req.body.skip
    };

    if (!data.playerId || !data.skip) {
        return next(errors.WRONG_PARAMETERS);
    }

    gameService.skipWildlingsTop(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

function replaceOrder(req, res, next) {
    var data = {
        gameId: req.params.id,
        playerId: req.headers['player-id'],
        order: req.body
    };

    if (!data.playerId || !data.order) {
        return next(errors.WRONG_PARAMETERS);
    }

    gameService.replaceOrder(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

// TODO: Unfinished
function bet(req, res, next) {
    var data = {
        gameId: req.params.id,
        playerId: req.headers['player-id']
    };

    gameService.useCrow(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(202).json(result);
        }
    });
}

exports.registerRoutes = function(app) {
    app.post('/games', createGame);
    app.get('/games/:id', getGame);
    app.post('/games/:id/muster', muster);
    app.get('/games/:id/crow/wildlings', getWildlingsTop);
    app.post('/games/:id/crow/wildlings', skipWildlingsTop);
    app.post('/games/:id/crow/order', replaceOrder);
    app.put('/games/:id/bet', bet);
};
