// Place orders for one player
module.exports.placeOrders = function canPlaceOrders(game, playerId, orders) {
    var playerHouse = game.getPlayerById(playerId);

    orders.forEach(function placeOrder(e) {
        game.map.zones[e.zone].order = e.order;
    });
    // Remove player from pending for that period
    game.period.players.splice(game.period.players.indexOf(playerHouse), 1);
};

// Remove orders for all players
module.exports.cleanOrders = function cleanOrders(game) {
    for (var zoneName in game.map.zones) {
        delete game.map.zones[zoneName].order;
    }
};
