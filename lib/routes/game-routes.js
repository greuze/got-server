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

    gameService.getGame(data, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(result);
        }
    });
}

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

function useCrow(req, res, next) {
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
    app.post('/games/:id/crow', useCrow);
    app.put('/games/:id/bet', bet);
};
