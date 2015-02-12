'use strict';

// Is an array, to easily filter
var openGames = [];
// Is an object, to easily delete games
var runningGames = {};

module.exports.startGame = function startGame(newGame) {
    openGames = openGames.filter(function(game) {
        return game.id !== newGame.id;
    });
    runningGames[newGame.id] = newGame;
};

module.exports.filterOpenGames = function filterOpenGamesByMaxPlayers(maxPlayers) {
    return openGames.filter(function(game) {
        return game.maxPlayers === maxPlayers;
    });
};

module.exports.addOpenGame = function addOpenGame(game) {
    openGames.push(game);
};

module.exports.getOpenGame = function getOpenGame(gameId) {
    var openGame = openGames.filter(function(game) {
        return game.id === gameId;
    });
    return openGame.length > 0 ? openGame[0] : null;
};

module.exports.getRunningGame = function getRunningGame(gameId) {
    return runningGames[gameId];
};
