// Place orders for one player
module.exports.placeOrders = function(game, playerId, orders) {
    var playerHouse = game.getPlayerById(playerId);

    orders.forEach(function placeOrder(e) {
        game.map.zones[e.zone].order = e.order;
    });
    // Remove player from pending for that period
    game.period.players.splice(game.period.players.indexOf(playerHouse), 1);
    // If it's last player, advance period
    if (game.period.players.length === 0) {
        game.nextPeriod();
    }
};

// Get top of wildlings deck
module.exports.getWildlingsTop = function(game) {
    game.period.viewedWildlingsTop = true;

    return game.cards.wildlings[0];
};

// Skip or not the top of wildlings deck
module.exports.skipWildlingsTop = function(game, skip) {
    delete game.period.viewedWildlingsTop;

    if (skip) {
        game.cards.wildlings.shift();
    }

    game.nextPeriod();
};

// Replace one order for player with crow
module.exports.replaceOrder = function(game, e) {
    game.map.zones[e.zone].order = e.order;

    game.nextPeriod();
};

// Remove orders for all players
module.exports.cleanOrders = function(game) {
    for (var zoneName in game.map.zones) {
        delete game.map.zones[zoneName].order;
    }
};
