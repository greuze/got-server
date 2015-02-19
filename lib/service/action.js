// Place orders for one player
module.exports.placeOrders = function placeOrders(game, playerId, orders) {
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

// Replace one order for player with crow
module.exports.replaceOrder = function replaceOrder(game, e) {
    game.map.zones[e.zone].order = e.order;

    game.period.players = [];

    game.nextPeriod();
};

// Remove orders for all players
module.exports.cleanOrders = function cleanOrders(game) {
    for (var zoneName in game.map.zones) {
        delete game.map.zones[zoneName].order;
    }
};
